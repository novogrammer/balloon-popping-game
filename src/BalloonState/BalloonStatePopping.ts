// import { IS_DEBUG } from "../constants";
import { IS_DEBUG, POPPING_DURATION } from "../constants";
import BalloonContextInterface from "./BalloonContextInterface";
import BalloonStateBase from "./BalloonStateBase";
import BalloonStatePreparing from "./BalloonStatePreparing";

export default class BalloonStatePopping extends BalloonStateBase{
  poppingTime:number;
  constructor(balloonContext:BalloonContextInterface){
    super(balloonContext);
    this.poppingTime=POPPING_DURATION;
  }
  onBeginBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginBalloonState`);
    }
    this.balloonContext.addDebugModifier("popping");
    this.balloonContext.addScore(1);
  }
  onEndBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndBalloonState`);
    }
    this.balloonContext.removeDebugModifier("popping");
  }
  onStamp(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onStamp`);
    }
  }
  update(dt: number): void {
    this.poppingTime-=dt;
    if(this.poppingTime<0){
      this.balloonContext.setNextBalloonState(new BalloonStatePreparing(this.balloonContext));
    }
  }
}