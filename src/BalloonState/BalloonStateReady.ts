// import { IS_DEBUG } from "../constants";
import { IS_DEBUG, READY_DURATION } from "../constants";
import BalloonContextInterface from "./BalloonContextInterface";
import BalloonStateAway from "./BalloonStateAway";
import BalloonStateBase from "./BalloonStateBase";
import BalloonStatePopping from "./BalloonStatePopping";

export default class BalloonStateReady extends BalloonStateBase{
  readyTime:number;
  constructor(balloonContext:BalloonContextInterface){
    super(balloonContext);
    this.readyTime=READY_DURATION;
  }
  //#region BalloonStateBase
  onBeginBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginBalloonState`);
    }
    this.balloonContext.addDebugModifier("ready");
    this.balloonContext.startReadyAnimation();
  }
  onEndBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndBalloonState`);
    }
    this.balloonContext.removeDebugModifier("ready");
  }
  onStamp(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onStamp`);
    }
    this.balloonContext.setNextBalloonState(new BalloonStatePopping(this.balloonContext));
  }
  update(dt: number): void {
    this.readyTime-=dt;
    if(this.readyTime<0){
      this.balloonContext.setNextBalloonState(new BalloonStateAway(this.balloonContext));
    }
  }
  //#endregion
}