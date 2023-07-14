// import { IS_DEBUG } from "../constants";
import { IS_DEBUG, PREPARING_DURATION_MIN,PREPARING_DURATION_MAX } from "../constants";
import BalloonContextInterface from "./BalloonContextInterface";
import BalloonStateBase from "./BalloonStateBase";
import BalloonStateReady from "./BalloonStateReady";

export default class BalloonStatePreparing extends BalloonStateBase{
  preparingTime:number;
  constructor(balloonContext:BalloonContextInterface){
    super(balloonContext);
    const time=(PREPARING_DURATION_MAX-PREPARING_DURATION_MIN)*Math.random()+PREPARING_DURATION_MIN;
    this.preparingTime=time;
  }
  //#region BalloonStateBase
  onBeginBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginBalloonState`);
    }
    this.balloonContext.addDebugModifier("preparing");
    this.balloonContext.startPreparingAnimation();
  }
  onEndBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndBalloonState`);
    }
    this.balloonContext.removeDebugModifier("preparing");
  }
  onStamp(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onStamp`);
    }
  }
  update(dt: number): void {
    this.preparingTime-=dt;
    if(this.preparingTime<0){
      this.balloonContext.setNextBalloonState(new BalloonStateReady(this.balloonContext));
    }
  }
  //#endregion
}