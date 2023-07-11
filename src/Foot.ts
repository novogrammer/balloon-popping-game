import {gsap} from "gsap";

import FootMesh from "./FootMesh";
import KeyEventListenerInterface from "./KeyEventListenerInterface";
import ObjectLocation from "./ObjectLocation";
import { FOOT_LIFT_Y, FOOT_MOVE_DOWN_DURATION, FOOT_MOVE_UP_DURATION } from "./constants";

enum FootState{
  Up="up",
  Down="down",
}

export default class Foot implements KeyEventListenerInterface{
  objectLocation:ObjectLocation|null=null;
  targetCode:string;
  footState:FootState;
  debugFoot:HTMLElement;
  footMesh:FootMesh;
  
  constructor(targetCode:string,originalFootMesh:FootMesh){
    this.targetCode=targetCode;
    this.footState=FootState.Up;
    this.debugFoot=document.createElement("div");
    this.debugFoot.classList.add("p-debug-view__foot");
    this.debugFoot.classList.add("p-debug-view__foot--up");
    this.footMesh=originalFootMesh.clone();
    this.footMesh.position.y=FOOT_LIFT_Y;
  }
  destroy(){
  }
  setObjectLocation(objectLocation:ObjectLocation|null):void{
    if(this.objectLocation){
      this.objectLocation.objectLocationGroup.remove(this.footMesh);
      this.objectLocation.debugObjectLocation.removeChild(this.debugFoot);
    }
    this.objectLocation=objectLocation;
    if(this.objectLocation){
      this.objectLocation.debugObjectLocation.appendChild(this.debugFoot);
      this.objectLocation.objectLocationGroup.add(this.footMesh);
    }
    
  }
  update(_dt:number){

  }
  onCodeDown(code:string){
    if(code!==this.targetCode){
      return;
    }
    if(!this.objectLocation){
      throw new Error("objectLocation is null");
    }
    this.footState=FootState.Down;
    this.debugFoot.classList.remove("p-debug-view__foot--up");
    this.debugFoot.classList.add("p-debug-view__foot--down");

    gsap.to(this.footMesh.position,{
      y:0,
      duration:FOOT_MOVE_DOWN_DURATION,
      ease:"bounce.out",
    });
    

    this.objectLocation.onStamp();
  }
  onCodeUp(code:string){
    if(code!==this.targetCode){
      return;
    }
    this.footState=FootState.Up;
    this.debugFoot.classList.remove("p-debug-view__foot--down");
    this.debugFoot.classList.add("p-debug-view__foot--up");

    gsap.to(this.footMesh.position,{
      y:FOOT_LIFT_Y,
      duration:FOOT_MOVE_UP_DURATION,
      ease:"power2.out",
    });
  }
}