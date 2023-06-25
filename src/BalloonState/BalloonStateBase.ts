import BalloonContextInterface from "./BalloonContextInterface";

export default abstract class BalloonStateBase{
  balloonContext:BalloonContextInterface;
  constructor(balloonContext:BalloonContextInterface){
    this.balloonContext=balloonContext;
  }
  abstract onBeginBalloonState():void;
  abstract onEndBalloonState():void;
  abstract onStamp():void;
  abstract update(dt:number):void;
}