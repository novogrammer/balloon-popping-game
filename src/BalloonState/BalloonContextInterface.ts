import BalloonStateBase from "./BalloonStateBase";
export default interface BalloonContextInterface{
  setNextBalloonState(nextBalloonState:BalloonStateBase|null):void;
  addDebugModifier(modifier:string):void;
  removeDebugModifier(modifier:string):void;
}