import SceneStateBase from "./SceneStateBase";
export default interface SceneContextInterface{
  setNextSceneState(sceneState:SceneStateBase):void;
}