import { IS_DEBUG } from "../constants";
import PlayingContextInterface from "./PlayingContextInterface";
import PlayingStateBase from "./PlayingStateBase";

export default class PlayingStateTimeover extends PlayingStateBase{
  constructor(playingContext:PlayingContextInterface){
    super(playingContext);
  }
  onBeginPlayingState():void{
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginPlayingState`);
    }
  }
  onEndPlayingState():void{
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndPlayingState`);
    }

  }
  update(dt:number):void{
    const isOK=this.playingContext.updateTimeoutTime(dt);
    if(!isOK){
      this.playingContext.goNextScene();
    }

  }
  isInAction():boolean{
    return false;
  }
}