import Balloon from "./Balloon";
import Foot from "./Foot";
import AddScoreListenerInterface from "./AddScoreListenerInterface";

interface ObjectLocationParams{
  foot:Foot;
  balloon:Balloon;
  debugObjectLocation:HTMLElement;
  addScoreListener:AddScoreListenerInterface;
}

export default class ObjectLocation implements AddScoreListenerInterface{
  foot:Foot;
  balloon:Balloon;
  debugObjectLocation:HTMLElement;
  addScoreListener:AddScoreListenerInterface;
  constructor({foot,balloon,debugObjectLocation,addScoreListener}:ObjectLocationParams){
    this.foot=foot;
    this.balloon=balloon;
    this.debugObjectLocation=debugObjectLocation;
    this.addScoreListener=addScoreListener;
    this.foot.setObjectLocation(this);
    this.balloon.setObjectLocation(this);
  }
  destroy(){
    this.foot.setObjectLocation(null);
    this.balloon.setObjectLocation(null);
    this.foot.destroy();
    this.balloon.destroy();
  }
  onActionCodeDown(code:string): void {
    this.foot.onActionCodeDown(code);
  }
  onActionCodeUp(code:string): void {
    this.foot.onActionCodeUp(code);
  }
  onStamp():void{
    this.balloon.onStamp();
  }
  addScore(score:number):void{
    this.addScoreListener.addScore(score);
  }
  update(dt:number):void{
    this.foot.update(dt);
    this.balloon.update(dt);
  }
}