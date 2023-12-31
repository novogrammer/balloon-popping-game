import PlayingContextInterface from "./PlayingContextInterface";

export default abstract class PlayingStateBase{
  playingContext:PlayingContextInterface;
  constructor(playingContext:PlayingContextInterface){
    this.playingContext=playingContext;
  }

  abstract onBeginPlayingState():void;
  abstract onEndPlayingState():void;
  abstract update(dt:number):void;
  abstract isInAction():boolean;

}