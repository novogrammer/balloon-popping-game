import Balloon from "./Balloon";
import Foot from "./Foot";
import ObjectLocation from "./ObjectLocation";

export default class Field{
  objectLocationList:ObjectLocation[];
  footList:Foot[];
  balloonList:Balloon[]=[];
  constructor(){
    this.objectLocationList=[
      new ObjectLocation(1),
      new ObjectLocation(2),
      new ObjectLocation(3),
    ];
    this.footList=this.objectLocationList.map((objectLocation)=>{
      return new Foot(objectLocation);
    });

  }
  update(_dt:number){

  }
}