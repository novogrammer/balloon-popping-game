import ObjectLocation from "./ObjectLocation";

enum FootState{
  Up="up",
  Down="down",
}

export default class Foot{
  objectLocation:ObjectLocation;
  targetCode:string;
  footState:FootState;
  
  constructor(objectLocation:ObjectLocation,targetCode:string){
    this.objectLocation=objectLocation;
    this.targetCode=targetCode;
    this.footState=FootState.Up;
  }
  update(_dt:number){

  }
  onCodeDown(_code:string){

  }
  onCodeUp(_code:string){

  }
}