// import { IS_DEBUG } from "../constants";
import { AWAY_DURATION, IS_DEBUG } from "../constants";
import BalloonContextInterface from "./BalloonContextInterface";
import BalloonStateBase from "./BalloonStateBase";
import BalloonStatePreparing from "./BalloonStatePreparing";

export default class BalloonStateAway extends BalloonStateBase{
  awayTime:number;
  constructor(balloonContext:BalloonContextInterface){
    super(balloonContext);
    this.awayTime=AWAY_DURATION;
  }
  onBeginBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginBalloonState`);
    }
    this.balloonContext.addDebugModifier("away");
  }
  onEndBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndBalloonState`);
    }
    this.balloonContext.removeDebugModifier("away");
  }
  onStamp(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onStamp`);
    }
  }
  update(dt: number): void {
    this.awayTime-=dt;
    if(this.awayTime<0){
      this.balloonContext.setNextBalloonState(new BalloonStatePreparing(this.balloonContext));
    }
  }
}