import InputCharactorInterface from "../InputCharactorInterface";
import PlayerScoreInterface from "../PlayerScoreInterface";
import { INPUT_BLINK_CYCLE, IS_DEBUG, NAME_INPUT_CHARACTOR_LIST, NAME_LENGTH, RESULT_PLAYER_SCORE_LIST_QTY } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateTitle from "./SceneStateTitle";

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

  }
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }

    this.playerScoreList=this.sceneContext.getPlayerScoreList().concat().sort((a,b)=>b.score - a.score).filter((_playerScore,index)=>index<RESULT_PLAYER_SCORE_LIST_QTY);

    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.appendChild(this.debugTitle);
    debugViewElement.appendChild(this.debugScore);
    debugViewElement.appendChild(this.debugName);
    debugViewElement.appendChild(this.debugPlayerScoreList);
    
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

    this.sceneContext.submitPlayerScore({
      name:this.name,
      score:this.score,
    });
    
  }
  onCodeDown(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeDown`,code);
    }
    switch(code){
      case "KeyJ":
        this.moveCharactorInputIndex(-1);
        break;
      case "KeyK":
        {
          const nameInputCharactor=this.getCurrentInputCharactor();
          this.name+=nameInputCharactor.charactor;
          if(NAME_LENGTH<=this.name.length){
            const nextSceneState=new SceneStateTitle(this.sceneContext);
            this.sceneContext.setNextSceneState(nextSceneState);
          }
          
        }
        break;
      case "KeyL":
        this.moveCharactorInputIndex(1);
        break;
    }
  }
  onCodeUp(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeUp`,code);
    }
  }
  getCurrentInputCharactor():InputCharactorInterface{
    return NAME_INPUT_CHARACTOR_LIST[this.charactorInputIndex];
  }
  moveCharactorInputIndex(diff:number):void{
    this.charactorInputIndex=(
      this.charactorInputIndex + NAME_INPUT_CHARACTOR_LIST.length + diff
    )%NAME_INPUT_CHARACTOR_LIST.length;

  }
  update(dt:number):void{
    const nameInputCharactor=this.getCurrentInputCharactor();
    const r=(this.timeForAnimation)/INPUT_BLINK_CYCLE%1;
    const inputCharactor=r<0.5?nameInputCharactor.label:" ";
    this.debugName.textContent=`name: ${this.name}${inputCharactor}`;
    this.debugScore.textContent=`score: ${this.score}`;
    this.debugPlayerScoreList.innerHTML=`playerScoreList:<br>`+this.playerScoreList.map((playerScore)=>`${playerScore.name}:${playerScore.score}`).join("<br>");
    this.timeForAnimation+=dt;
  }
}