import * as THREE from "three";
import Balloon from "./Balloon";
import Foot from "./Foot";
import AddScoreListenerInterface from "./AddScoreListenerInterface";
import KeyEventListenerInterface from "./KeyEventListenerInterface";

interface ObjectLocationParams{
  foot:Foot;
  balloon:Balloon;
  debugObjectLocation:HTMLElement;
  addScoreListener:AddScoreListenerInterface;
}

export default class ObjectLocation implements AddScoreListenerInterface,KeyEventListenerInterface{
  foot:Foot;
  balloon:Balloon;
  debugObjectLocation:HTMLElement;
  addScoreListener:AddScoreListenerInterface;
  objectLocationGroup:THREE.Group;
  constructor({foot,balloon,debugObjectLocation,addScoreListener}:ObjectLocationParams){
    this.foot=foot;
    this.balloon=balloon;
    this.debugObjectLocation=debugObjectLocation;
    this.addScoreListener=addScoreListener;
    this.objectLocationGroup=new THREE.Group();
    this.foot.setObjectLocation(this);
    this.balloon.setObjectLocation(this);
  }
  destroy():void{
    this.foot.setObjectLocation(null);
    this.balloon.setObjectLocation(null);
    this.foot.destroy();
    this.balloon.destroy();
  }
  onStamp():void{
    this.balloon.onStamp();
  }
  update(dt:number):void{
    this.foot.update(dt);
    this.balloon.update(dt);
  }
  //#region AddScoreListenerInterface
  addScore(score:number):void{
    this.addScoreListener.addScore(score);
  }
  //#endregion
  //#region KeyEventListenerInterface
  onCodeDown(code:string): void {
    this.foot.onCodeDown(code);
  }
  onCodeUp(code:string): void {
    this.foot.onCodeUp(code);
  }
  //#endregion
}