import SceneContextInterface from "./SceneContextInterface";

export default abstract class SceneStateBase{
  sceneContext:SceneContextInterface;
  constructor(sceneContext:SceneContextInterface){
    this.sceneContext=sceneContext;
  }
  abstract onKeyDown(event:KeyboardEvent):void;
  abstract onBeginSceneState():void;
  abstract onEndSceneState():void;
}