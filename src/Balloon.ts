import BalloonContextInterface from "./BalloonState/BalloonContextInterface";
import BalloonStateBase from "./BalloonState/BalloonStateBase";
import BalloonStatePreparing from "./BalloonState/BalloonStatePreparing";

export default class Balloon implements BalloonContextInterface{
  currentBalloonState?:BalloonStateBase;
  constructor(){
    this.setNextBalloonState(new BalloonStatePreparing(this));
  }
  setNextBalloonState(nextBalloonState: BalloonStateBase): void {
    if(this.currentBalloonState){
      this.currentBalloonState.onEndBalloonState();
    }
    this.currentBalloonState=nextBalloonState;
    if(this.currentBalloonState){
      this.currentBalloonState.onBeginBalloonState();
    }
  }
  update(dt:number){
    if(!this.currentBalloonState){
      throw new Error("currentBalloonState is null");
    }
    this.currentBalloonState.update(dt);
  }
}