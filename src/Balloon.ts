import BalloonContextInterface from "./BalloonState/BalloonContextInterface";
import BalloonStateBase from "./BalloonState/BalloonStateBase";
import BalloonStatePreparing from "./BalloonState/BalloonStatePreparing";
import ObjectLocation from "./ObjectLocation";

export default class Balloon implements BalloonContextInterface{
  objectLocation:ObjectLocation|null=null;
  currentBalloonState:BalloonStateBase|null=null;
  debugBalloon:HTMLElement;
  constructor(){
    this.debugBalloon=document.createElement("div");
    this.debugBalloon.classList.add("p-debug-view__balloon");
    this.setNextBalloonState(new BalloonStatePreparing(this));
  }
  destroy(){
    this.setNextBalloonState(null);
  }
  setObjectLocation(objectLocation:ObjectLocation|null){
    if(this.objectLocation){
      this.objectLocation.debugObjectLocation.removeChild(this.debugBalloon);
    }
    this.objectLocation=objectLocation;
    if(this.objectLocation){
      this.objectLocation.debugObjectLocation.appendChild(this.debugBalloon);
    }
  }

  setNextBalloonState(nextBalloonState: BalloonStateBase|null): void {
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
  onStamp():void{
    if(!this.currentBalloonState){
      throw new Error("currentBalloonState is null");
    }
    this.currentBalloonState.onStamp();
  }
}