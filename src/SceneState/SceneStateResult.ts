import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateTitle from "./SceneStateTitle";

export default class SceneStateResult extends SceneStateBase{
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
    const nextSceneState=new SceneStateTitle(this.sceneContext);
    this.sceneContext.setNextSceneState(nextSceneState);
  }
  onKeyUp(event: KeyboardEvent): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onKeyUp`,event);
    }
  }
}