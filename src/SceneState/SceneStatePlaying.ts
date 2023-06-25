import Field from "../Field";
import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateResult from "./SceneStateResult";

export default class SceneStatePlaying extends SceneStateBase{
  field:Field;
  debugTitle:HTMLDivElement;
  constructor(sceneContext:SceneContextInterface){
    super(sceneContext);
    this.field=new Field();
    this.debugTitle=document.createElement("div");
    this.debugTitle.classList.add("p-debug-view__title");
    this.debugTitle.textContent="SceneStatePlaying";
  }
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.appendChild(this.debugTitle);
    
  }
  onEndSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.removeChild(this.debugTitle);
    
  }
  onKeyDown(event: KeyboardEvent): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onKeyDown`,event);
    }
    const nextSceneState=new SceneStateResult(this.sceneContext);
    this.sceneContext.setNextSceneState(nextSceneState);
  }
  onKeyUp(event: KeyboardEvent): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onKeyUp`,event);
    }
  }
}