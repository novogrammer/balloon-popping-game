import AddScoreListenerInterface from "../AddScoreListenerInterface";
import BalloonStateBase from "./BalloonStateBase";
export default interface BalloonContextInterface extends AddScoreListenerInterface{
  setNextBalloonState(nextBalloonState:BalloonStateBase|null):void;
  addDebugModifier(modifier:string):void;
  removeDebugModifier(modifier:string):void;
}