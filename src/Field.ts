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
    this.footList=[
      new Foot(this.objectLocationList[0],"KeyJ"),
      new Foot(this.objectLocationList[1],"KeyK"),
      new Foot(this.objectLocationList[2],"KeyL"),
    ];

  }
  update(dt:number){

    for(let foot of this.footList){
      foot.update(dt);
    }
    for(let balloon of this.balloonList){
      balloon.update(dt);
    }
  }
}