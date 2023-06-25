import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";

import SceneStatePlaying from "./SceneStatePlaying";

export default class SceneStateTitle extends SceneStateBase{
  debugTitle:HTMLDivElement;
  constructor(sceneContext:SceneContextInterface){
    super(sceneContext);
    this.debugTitle=document.createElement("div");
    this.debugTitle.classList.add("p-debug-view__title");
    this.debugTitle.textContent="SceneStateTitle";

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
    const nextSceneState=new SceneStatePlaying(this.sceneContext);
    this.sceneContext.setNextSceneState(nextSceneState);
  }
  onKeyUp(event: KeyboardEvent): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onKeyUp`,event);
    }
  }
}