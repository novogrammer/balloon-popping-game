import { IS_DEBUG } from "../constants";
import PlayingContextInterface from "./PlayingContextInterface";
import PlayingStateAction from "./PlayingStateAction";
import PlayingStateBase from "./PlayingStateBase";

export default class PlayingStateCountdown extends PlayingStateBase{
  constructor(playingContext:PlayingContextInterface){
    super(playingContext);
  }
  //#region PlayingStateBase
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
    const isOK=this.playingContext.updateCountdownTime(dt);
    if(!isOK){
      this.playingContext.setNextPlayingState(new PlayingStateAction(this.playingContext));
    }
  }
  isInAction():boolean{
    return false;
  }
  //#endregion
}