import BalloonStateBase from "./BalloonStateBase";
export default interface BalloonContextInterface{
  setNextBalloonState(nextBalloonState:BalloonStateBase):void;
}