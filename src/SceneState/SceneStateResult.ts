import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateTitle from "./SceneStateTitle";

export default class SceneStateResult extends SceneStateBase{
  score:number;
  debugTitle:HTMLDivElement;
  debugScore:HTMLDivElement;
  constructor(sceneContext:SceneContextInterface,score:number){
    super(sceneContext);
    this.score=score;
    this.debugTitle=document.createElement("div");
    this.debugTitle.classList.add("p-debug-view__title");
    this.debugTitle.textContent="SceneStateResult";
    this.debugScore=document.createElement("div");
    this.debugScore.classList.add("p-debug-view__score");

  }
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.appendChild(this.debugTitle);
    debugViewElement.appendChild(this.debugScore);
    
  }
  onEndSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.removeChild(this.debugTitle);
    debugViewElement.removeChild(this.debugScore);
    
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
    this.debugScore.textContent=`score: ${this.score}`;
  }
}