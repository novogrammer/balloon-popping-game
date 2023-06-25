import Field from "../Field";
import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateResult from "./SceneStateResult";

export default class SceneStatePlaying extends SceneStateBase{
  field:Field;
  constructor(sceneContext:SceneContextInterface){
    super(sceneContext);
    this.field=new Field();
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
    const nextSceneState=new SceneStateResult(this.sceneContext);
    this.sceneContext.setNextSceneState(nextSceneState);
  }
  onKeyUp(event: KeyboardEvent): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onKeyUp`,event);
    }
  }
}