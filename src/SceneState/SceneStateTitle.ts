import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";

import SceneStatePlaying from "./SceneStatePlaying";

export default class SceneStateTitle extends SceneStateBase{
  constructor(sceneContext:SceneContextInterface){
    super(sceneContext);
  }
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }
    
  }
  onEndSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndSceneState`);
    }
    
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