import PlayingStateBase from "./PlayingStateBase";

export default interface PlayingContextInterface{
  updateCountdownTime(dt:number):boolean;
  updateGameTime(dt:number):boolean;
  updateTimeoutTime(dt:number):boolean;
  setNextPlayingState(nextPlayingState:PlayingStateBase|null):void;
  goNextScene():void;
  onActionCodeDown(code:string): void;
  onActionCodeUp(code:string): void;
}