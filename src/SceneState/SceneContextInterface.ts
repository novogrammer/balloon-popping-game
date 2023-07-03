import SceneStateBase from "./SceneStateBase";
export default interface SceneContextInterface{
  setNextSceneState(nextSceneState:SceneStateBase|null):void;
  getDebugViewElement():HTMLDivElement;
  submitScore(score:number,name:string):void;
}