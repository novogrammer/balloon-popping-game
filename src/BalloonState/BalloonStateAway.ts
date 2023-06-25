// import { IS_DEBUG } from "../constants";
import { IS_DEBUG } from "../constants";
import BalloonContextInterface from "./BalloonContextInterface";
import BalloonStateBase from "./BalloonStateBase";

export default class BalloonStateAway extends BalloonStateBase{
  constructor(balloonContext:BalloonContextInterface){
    super(balloonContext);
  }
  onBeginBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginBalloonState`);
    }
  }
  onEndBalloonState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndBalloonState`);
    }
  }
  onStamp(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onStamp`);
    }
  }
  update(_dt: number): void {
  }
}