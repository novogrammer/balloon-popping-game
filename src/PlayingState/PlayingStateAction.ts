import { IS_DEBUG } from "../constants";
import PlayingContextInterface from "./PlayingContextInterface";
import PlayingStateBase from "./PlayingStateBase";
import PlayingStateTimeover from "./PlayingStateTimeover";

export default class PlayingStateAction extends PlayingStateBase{
  constructor(playingContext:PlayingContextInterface){
    super(playingContext);
  }
  onBeginPlayingState():void{
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginPlayingState`);
    }
    this.playingContext.showGo();
  }
  onEndPlayingState():void{
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndPlayingState`);
    }
  }
  update(dt:number):void{
    const isOK=this.playingContext.updateGameTime(dt);
    if(!isOK){
      this.playingContext.setNextPlayingState(new PlayingStateTimeover(this.playingContext));
    }

  }
  isInAction():boolean{
    return true;
  }
}