import PlayerScoreInterface from "../PlayerScoreInterface";
import SceneStateBase from "./SceneStateBase";

interface Size{
  width: number;
  height: number;
}

export default interface SceneContextInterface{
  setNextSceneState(nextSceneState:SceneStateBase|null):void;
  getDebugViewElement():HTMLDivElement;
  getGame2DViewElement():HTMLDivElement;
  getThreeScene():THREE.Scene;
  getViewSize():Size;
  submitPlayerScore(playerScore:PlayerScoreInterface):void;
  getPlayerScoreList():PlayerScoreInterface[];
}