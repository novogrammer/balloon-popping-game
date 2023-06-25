import SceneStateBase from "./SceneStateBase";
export default interface SceneContextInterface{
  setNextSceneState(nextSceneState:SceneStateBase):void;
}