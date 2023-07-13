import InputCharactorInterface from "../InputCharactorInterface";
import PlayerScoreInterface from "../PlayerScoreInterface";
import { INPUT_BLINK_CYCLE, IS_DEBUG, NAME_INPUT_CHARACTOR_LIST, NAME_LENGTH, RANK_TEXT_LIST, RESULT_AFTER_DURATION, RESULT_PLAYER_SCORE_LIST_QTY } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateTitle from "./SceneStateTitle";

enum ResultState{
  Input="input",
  After="after",
}


export default class SceneStateResult extends SceneStateBase{
  name:string;
  score:number;
  playerScoreList:PlayerScoreInterface[];
  timeForAnimation:number;
  debugTitle:HTMLDivElement;
  debugScore:HTMLDivElement;
  debugName:HTMLDivElement;
  debugPlayerScoreList:HTMLDivElement;
  charactorInputIndex:number;
  resultState:ResultState;
  afterTime:number;
  constructor(sceneContext:SceneContextInterface,score:number){
    super(sceneContext);
    this.name="";
    this.charactorInputIndex=0;
    this.score=score;
    this.playerScoreList=[];
    this.timeForAnimation=0;
    this.debugTitle=document.createElement("div");
    this.debugTitle.classList.add("p-debug-view__title");
    this.debugTitle.textContent="SceneStateResult";
    this.debugScore=document.createElement("div");
    this.debugScore.classList.add("p-debug-view__score");
    this.debugName=document.createElement("div");
    this.debugName.classList.add("p-debug-view__name");
    this.debugPlayerScoreList=document.createElement("div");
    this.debugPlayerScoreList.classList.add("p-debug-view__player-score-list");
    this.resultState=ResultState.Input;
    this.afterTime=RESULT_AFTER_DURATION;

    this.setupGame2DScene();
  }
  setupGame2DScene(){
    this.game2DSceneElement.classList.add("p-game2d-scene-result");


    const nameElement=document.createElement("div");
    nameElement.classList.add("p-game2d-scene-result__name");
    this.game2DSceneElement.appendChild(nameElement);

    const scoreElement=document.createElement("div");
    scoreElement.classList.add("p-game2d-scene-result__score");
    scoreElement.textContent=`SCORE: ${this.score}`;
    this.game2DSceneElement.appendChild(scoreElement);

    const playerScoreListElement=document.createElement("div");
    playerScoreListElement.classList.add("p-game2d-scene-result__player-score-list");
    this.game2DSceneElement.appendChild(playerScoreListElement);

  }
  //#region SceneStateBase
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }

    this.playerScoreList=this.sceneContext.getPlayerScoreList().concat().sort((a,b)=>b.score - a.score).filter((_playerScore,index)=>index<RESULT_PLAYER_SCORE_LIST_QTY);

    {
      const playerScoreListElement=this.game2DSceneElement.querySelector(".p-game2d-scene-result__player-score-list");
      if(!playerScoreListElement){
        throw new Error("playerScoreListElement is null");
      }

      for(let [index,playerScore] of this.playerScoreList.entries()){
        const playerScoreElement=document.createElement("div");
        playerScoreElement.classList.add("p-game2d-scene-result__player-score");
        playerScoreListElement.appendChild(playerScoreElement);

        const rankElement=document.createElement("div");
        rankElement.classList.add("p-game2d-scene-result__player-score-rank");
        rankElement.textContent=`${RANK_TEXT_LIST[index]}`;
        playerScoreElement.appendChild(rankElement);

        const nameElement=document.createElement("div");
        nameElement.classList.add("p-game2d-scene-result__player-score-name");
        nameElement.textContent=playerScore.name;
        playerScoreElement.appendChild(nameElement);

        const scoreElement=document.createElement("div");
        scoreElement.classList.add("p-game2d-scene-result__player-score-score");
        scoreElement.textContent=`${playerScore.score}`;
        playerScoreElement.appendChild(scoreElement);

      }
    }

    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.appendChild(this.debugTitle);
    debugViewElement.appendChild(this.debugScore);
    debugViewElement.appendChild(this.debugName);
    debugViewElement.appendChild(this.debugPlayerScoreList);

    const game2DViewElement=this.sceneContext.getGame2DViewElement();
    game2DViewElement.appendChild(this.game2DSceneElement);
    
  }
  onEndSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.removeChild(this.debugTitle);
    debugViewElement.removeChild(this.debugScore);
    debugViewElement.removeChild(this.debugName);
    debugViewElement.removeChild(this.debugPlayerScoreList);

    const game2DViewElement=this.sceneContext.getGame2DViewElement();
    game2DViewElement.removeChild(this.game2DSceneElement);

    this.sceneContext.submitPlayerScore({
      name:this.name,
      score:this.score,
    });
    
  }
  update(dt:number):void{
    const nameInputCharactor=this.getCurrentInputCharactor();
    const r=(this.timeForAnimation)/INPUT_BLINK_CYCLE%1;
    const inputCharactor=r<0.5?nameInputCharactor.label:" ";
    this.debugName.textContent=`name: ${this.name}${inputCharactor}`;
    this.debugScore.textContent=`score: ${this.score}`;
    this.debugPlayerScoreList.innerHTML=`playerScoreList:<br>`+this.playerScoreList.map((playerScore)=>`${playerScore.name}:${playerScore.score}`).join("<br>");

    const nameElement=document.querySelector(".p-game2d-scene-result__name");
    if(!nameElement){
      throw new Error("nameElement is null");
    }
    switch(this.resultState){
      case ResultState.Input:
        {
          nameElement.textContent=`NAME: ${this.name}${inputCharactor}`;
        }
        break;
      case ResultState.After:
        {
          nameElement.textContent=`NAME: ${this.name}`;
          this.afterTime-=dt;
          if(this.afterTime<0){
            const nextSceneState=new SceneStateTitle(this.sceneContext);
            this.sceneContext.setNextSceneState(nextSceneState);
          }
        }
        break;
    }


    this.timeForAnimation+=dt;
    
  }
  //#region KeyEventListenerInterface
  onCodeDown(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeDown`,code);
    }
    switch(this.resultState){
      case ResultState.Input:
        {
          switch(code){
            case "KeyJ":
              this.moveCharactorInputIndex(-1);
              break;
            case "KeyK":
              {
                const nameInputCharactor=this.getCurrentInputCharactor();
                this.name+=nameInputCharactor.charactor;
                if(NAME_LENGTH<=this.name.length){
                  this.resultState=ResultState.After;
                }
                
              }
              break;
            case "KeyL":
              this.moveCharactorInputIndex(1);
              break;
          }
        }
        break;
      case ResultState.After:
        // DO NOTHING
        break;
    }
  }
  onCodeUp(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeUp`,code);
    }
  }
  //#endregion
  //#endregion
  getCurrentInputCharactor():InputCharactorInterface{
    return NAME_INPUT_CHARACTOR_LIST[this.charactorInputIndex];
  }
  moveCharactorInputIndex(diff:number):void{
    this.charactorInputIndex=(
      this.charactorInputIndex + NAME_INPUT_CHARACTOR_LIST.length + diff
    )%NAME_INPUT_CHARACTOR_LIST.length;

  }
}