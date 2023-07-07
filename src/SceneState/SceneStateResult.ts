import PlayerScoreInterface from "../PlayerScoreInterface";
import { IS_DEBUG, RESULT_PLAYER_SCORE_LIST_QTY } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateTitle from "./SceneStateTitle";

export default class SceneStateResult extends SceneStateBase{
  name:string;
  score:number;
  playerScoreList:PlayerScoreInterface[];
  debugTitle:HTMLDivElement;
  debugScore:HTMLDivElement;
  debugName:HTMLDivElement;
  debugPlayerScoreList:HTMLDivElement;
  constructor(sceneContext:SceneContextInterface,score:number){
    super(sceneContext);
    this.name="AAA";
    this.score=score;
    this.playerScoreList=[];
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
    const nextSceneState=new SceneStateTitle(this.sceneContext);
    this.sceneContext.setNextSceneState(nextSceneState);
  }
  onCodeUp(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeUp`,code);
    }
  }
  update(_dt:number):void{
    this.debugName.textContent=`name: ${this.name}`;
    this.debugScore.textContent=`score: ${this.score}`;
    this.debugPlayerScoreList.innerHTML=`playerScoreList:<br>`+this.playerScoreList.map((playerScore)=>`${playerScore.name}:${playerScore.score}`).join("<br>");
  }
}