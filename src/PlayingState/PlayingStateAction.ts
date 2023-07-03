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
    this.playingContext.onBeginAction();
  }
  onEndPlayingState():void{
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndPlayingState`);
    }
    this.playingContext.onEndAction();
  }
  update(dt:number):void{
    const isOK=this.playingContext.updateGameTime(dt);
    if(!isOK){
      this.playingContext.setNextPlayingState(new PlayingStateTimeover(this.playingContext));
    }

  }
  onCodeDown(code:string):void{
    this.playingContext.onActionCodeDown(code);
  }
  onCodeUp(code:string):void{
    this.playingContext.onActionCodeUp(code);
  }
}