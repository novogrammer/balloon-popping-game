import PlayingStateBase from "../PlayingState/PlayingStateBase";
import { COUNTDOWN_DURATION, GAME_DURATION, IS_DEBUG, TIMEOUT_DURATION } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";
import SceneStateResult from "./SceneStateResult";
import PlayingContextInterface from "../PlayingState/PlayingContextInterface";
import PlayingStateCountdown from "../PlayingState/PlayingStateCountdown";
import ObjectLocation from "../ObjectLocation";
import Foot from "../Foot";
import Balloon from "../Balloon";
import AddScoreListenerInterface from "../AddScoreListenerInterface";

export default class SceneStatePlaying extends SceneStateBase implements PlayingContextInterface,AddScoreListenerInterface{
  currentPlayingState:PlayingStateBase|null=null;
  // 減っていく
  countdownTime:number;
  // 減っていく
  gameTime:number;
  // 減っていく
  timeoutTime:number;
  score:number;
  objectLocationList:ObjectLocation[]=[];

  debugTitle:HTMLDivElement;
  debugCountdownTime:HTMLDivElement;
  debugGameTime:HTMLDivElement;
  debugTimeoutTime:HTMLDivElement;
  debugScore:HTMLDivElement;
  debugObjectLocationList:HTMLDivElement;

  constructor(sceneContext:SceneContextInterface){
    super(sceneContext);
    this.countdownTime=COUNTDOWN_DURATION;
    this.gameTime=GAME_DURATION;
    this.timeoutTime=TIMEOUT_DURATION;
    this.score=0;
    this.debugTitle=document.createElement("div");
    this.debugTitle.classList.add("p-debug-view__title");
    this.debugTitle.textContent="SceneStatePlaying";

    this.debugObjectLocationList=document.createElement("div");
    this.debugObjectLocationList.classList.add("p-debug-view__object-location-list");

    this.debugCountdownTime=document.createElement("div");
    this.debugCountdownTime.classList.add("p-debug-view__countdown-time");

    this.debugGameTime=document.createElement("div");
    this.debugGameTime.classList.add("p-debug-view__game-time");

    this.debugTimeoutTime=document.createElement("div");
    this.debugTimeoutTime.classList.add("p-debug-view__timeout-time");

    this.debugScore=document.createElement("div");
    this.debugScore.classList.add("p-debug-view__score");

    this.setupGame2DScene();
    
  }
  setupGame2DScene(){
    this.game2DSceneElement.classList.add("p-game2d-scene-playing");

    for(let n=1;n<=3;n+=1){
      const countdownElement=document.createElement("div");
      countdownElement.classList.add("p-game2d-scene-playing__countdown");
      countdownElement.classList.add(`p-game2d-scene-playing__countdown--${n}`);
      countdownElement.textContent=`${n}`
      this.game2DSceneElement.appendChild(countdownElement);
    }

    const scoreElement=document.createElement("div");
    scoreElement.classList.add("p-game2d-scene-playing__score");
    this.game2DSceneElement.appendChild(scoreElement);

    const timeElement=document.createElement("div");
    timeElement.classList.add("p-game2d-scene-playing__time");
    this.game2DSceneElement.appendChild(timeElement);



  }
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.appendChild(this.debugTitle);
    debugViewElement.appendChild(this.debugCountdownTime);
    debugViewElement.appendChild(this.debugGameTime);
    debugViewElement.appendChild(this.debugTimeoutTime);
    debugViewElement.appendChild(this.debugScore);
    debugViewElement.appendChild(this.debugObjectLocationList);

    const debugObjectLocationJ=document.createElement("div");
    debugObjectLocationJ.classList.add("p-debug-view__object-location");
    this.debugObjectLocationList.appendChild(debugObjectLocationJ);
    const debugObjectLocationK=document.createElement("div");
    debugObjectLocationK.classList.add("p-debug-view__object-location");
    this.debugObjectLocationList.appendChild(debugObjectLocationK);
    const debugObjectLocationL=document.createElement("div");
    debugObjectLocationL.classList.add("p-debug-view__object-location");
    this.debugObjectLocationList.appendChild(debugObjectLocationL);

    const game2DViewElement=this.sceneContext.getGame2DViewElement();
    game2DViewElement.appendChild(this.game2DSceneElement);

    this.objectLocationList=[
      new ObjectLocation({
        foot:new Foot("KeyJ"),
        balloon:new Balloon(),
        debugObjectLocation:debugObjectLocationJ,
        addScoreListener:this,
      }),
      new ObjectLocation({
        foot:new Foot("KeyK"),
        balloon:new Balloon(),
        debugObjectLocation:debugObjectLocationK,
        addScoreListener:this,
      }),
      new ObjectLocation({
        foot:new Foot("KeyL"),
        balloon:new Balloon(),
        debugObjectLocation:debugObjectLocationL,
        addScoreListener:this,
      }),
    ];
    this.setNextPlayingState(new PlayingStateCountdown(this));
    
  }
  onEndSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndSceneState`);
    }
    this.setNextPlayingState(null);
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.removeChild(this.debugTitle);
    debugViewElement.removeChild(this.debugCountdownTime);
    debugViewElement.removeChild(this.debugGameTime);
    debugViewElement.removeChild(this.debugTimeoutTime);
    debugViewElement.removeChild(this.debugScore);
    debugViewElement.removeChild(this.debugObjectLocationList);
    for(let objectLocation of this.objectLocationList){
      objectLocation.destroy();
    }
    this.objectLocationList=[];

    const game2DViewElement=this.sceneContext.getGame2DViewElement();
    game2DViewElement.removeChild(this.game2DSceneElement);

  }
  onCodeDown(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeDown`,code);
    }
    if(this.currentPlayingState){
      if(this.currentPlayingState.isInAction()){
        for(let objectLocation of this.objectLocationList){
          objectLocation.onCodeDown(code);
        }
      }
    }
  }
  onCodeUp(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeUp`,code);
    }
    if(this.currentPlayingState){
      if(this.currentPlayingState.isInAction()){
        for(let objectLocation of this.objectLocationList){
          objectLocation.onCodeUp(code);
        }
      }
    }
  }
  goNextScene(){
    const nextSceneState=new SceneStateResult(this.sceneContext,this.score);
    this.sceneContext.setNextSceneState(nextSceneState);
  }
  update(dt:number):void{
    if(this.currentPlayingState){
      this.currentPlayingState.update(dt);
    }
    if(this.currentPlayingState && this.currentPlayingState.isInAction()){
      for(let objectLocation of this.objectLocationList){
        objectLocation.update(dt);
      }
    }
  
    this.debugCountdownTime.textContent=`countdown time: ${this.countdownTime}`;
    this.debugGameTime.textContent=`game time: ${this.gameTime}`;
    this.debugTimeoutTime.textContent=`timeout time: ${this.timeoutTime}`;
    this.debugScore.textContent=`score: ${this.score}`;

    {
      const scoreElement=this.game2DSceneElement.querySelector(".p-game2d-scene-playing__score");
      if(!scoreElement){
        throw new Error("scoreElement is null");
      }
      scoreElement.textContent=`SCORE: ${this.score}`;
    }
    {
      const timeElement=this.game2DSceneElement.querySelector(".p-game2d-scene-playing__time");
      if(!timeElement){
        throw new Error("timeElement is null");
      }
      timeElement.textContent=`TIME: ${Math.ceil(this.gameTime)}`;
    }
    
  }
  updateCountdownTime(dt: number): boolean {
    this.countdownTime-=dt;
    if(this.countdownTime<0){
      this.countdownTime=0;
      return false;
    }
    return true;
  }
  updateGameTime(dt: number): boolean {
    this.gameTime-=dt;
    if(this.gameTime<0){
      this.gameTime=0;
      return false;
    }
    return true;
  }
  updateTimeoutTime(dt: number): boolean {
    this.timeoutTime-=dt;
    if(this.timeoutTime<0){
      this.timeoutTime=0;
      return false;
    }
    return true;
  }
  setNextPlayingState(nextPlayingState: PlayingStateBase|null): void {

    if(this.currentPlayingState){
      this.currentPlayingState.onEndPlayingState();
    }
    this.currentPlayingState=nextPlayingState;
    if(this.currentPlayingState){
      this.currentPlayingState.onBeginPlayingState();
    }
  }
  addScore(score: number): void {
    this.score+=score;
  }
  showGo(): void {
    const goElement=document.createElement("div");
    goElement.classList.add("p-game2d-scene-playing__go");
    goElement.textContent="GO!";
    this.game2DSceneElement.appendChild(goElement);
  }
  showTimeover():void{
    const timeoverElement=document.createElement("div");
    timeoverElement.classList.add("p-game2d-scene-playing__timeover");
    timeoverElement.textContent="TIME OVER!";
    this.game2DSceneElement.appendChild(timeoverElement);

  }
}