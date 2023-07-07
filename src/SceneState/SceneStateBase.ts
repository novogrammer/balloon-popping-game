import KeyEventListenerInterface from "../KeyEventListenerInterface";
import SceneContextInterface from "./SceneContextInterface";

export default abstract class SceneStateBase implements KeyEventListenerInterface{
  sceneContext:SceneContextInterface;
  constructor(sceneContext:SceneContextInterface){
    this.sceneContext=sceneContext;
  }
  abstract onCodeDown(code:string):void;
  abstract onCodeUp(code:string):void;
  abstract onBeginSceneState():void;
  abstract onEndSceneState():void;
  abstract update(dt:number):void;
}