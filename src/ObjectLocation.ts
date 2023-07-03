import Balloon from "./Balloon";
import Foot from "./Foot";

interface ObjectLocationParams{
  foot:Foot;
  balloon:Balloon;
  debugObjectLocation:HTMLElement;
}

export default class ObjectLocation{
  foot:Foot;
  balloon:Balloon;
  debugObjectLocation:HTMLElement;
  constructor({foot,balloon,debugObjectLocation}:ObjectLocationParams){
    this.foot=foot;
    this.balloon=balloon;
    this.debugObjectLocation=debugObjectLocation;
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
  update(dt:number):void{
    this.foot.update(dt);
    this.balloon.update(dt);
  }
}