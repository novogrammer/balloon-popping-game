import SceneContextInterface from "./SceneContextInterface";

export default abstract class SceneStateBase{
  sceneContext:SceneContextInterface;
  constructor(sceneContext:SceneContextInterface){
    this.sceneContext=sceneContext;
  }
  abstract onCodeDown(code:string):void;
  abstract onCodeUp(code:string):void;
  abstract onBeginSceneState():void;
  abstract onEndSceneState():void;
}