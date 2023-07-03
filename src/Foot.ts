import ObjectLocation from "./ObjectLocation";

enum FootState{
  Up="up",
  Down="down",
}

export default class Foot{
  objectLocation:ObjectLocation|null=null;
  targetCode:string;
  footState:FootState;
  debugFoot:HTMLElement;
  
  constructor(targetCode:string){
    this.targetCode=targetCode;
    this.footState=FootState.Up;
    this.debugFoot=document.createElement("div");
    this.debugFoot.classList.add("p-debug-view__foot");
    this.debugFoot.classList.add("p-debug-view__foot--up");
  }
  destroy(){
  }
  setObjectLocation(objectLocation:ObjectLocation|null):void{
    if(this.objectLocation){
      this.objectLocation.debugObjectLocation.removeChild(this.debugFoot);
    }
    this.objectLocation=objectLocation;
    if(this.objectLocation){
      this.objectLocation.debugObjectLocation.appendChild(this.debugFoot);
    }
    
  }
  update(_dt:number){

  }
  onActionCodeDown(code:string){
    if(code!==this.targetCode){
      return;
    }
    if(!this.objectLocation){
      throw new Error("objectLocation is null");
    }
    this.footState=FootState.Down;
    this.debugFoot.classList.remove("p-debug-view__foot--up");
    this.debugFoot.classList.add("p-debug-view__foot--down");

    this.objectLocation.onStamp();
  }
  onActionCodeUp(code:string){
    if(code!==this.targetCode){
      return;
    }
    this.footState=FootState.Up;
    this.debugFoot.classList.remove("p-debug-view__foot--down");
    this.debugFoot.classList.add("p-debug-view__foot--up");

  }
}