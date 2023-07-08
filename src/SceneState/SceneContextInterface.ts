import PlayerScoreInterface from "../PlayerScoreInterface";
import SceneStateBase from "./SceneStateBase";
export default interface SceneContextInterface{
  setNextSceneState(nextSceneState:SceneStateBase|null):void;
  getDebugViewElement():HTMLDivElement;
  getGame2DViewElement():HTMLDivElement;
  submitPlayerScore(playerScore:PlayerScoreInterface):void;
  getPlayerScoreList():PlayerScoreInterface[];
}