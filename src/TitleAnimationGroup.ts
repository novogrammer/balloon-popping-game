import * as THREE from "three";
import { TITLE_ANIMATION_BALLOON_HEIGHT, TITLE_ANIMATION_BALLOON_QTY, TITLE_ANIMATION_BALLOON_RADIUS, TITLE_ANIMATION_DURATION } from "./constants";

export default class TitleAnimationGroup extends THREE.Group{
  titleAnimationTime:number;
  constructor(originalBalloonMesh:THREE.Mesh){
    super();
    this.titleAnimationTime=0;
    for(let i=0;i<TITLE_ANIMATION_BALLOON_QTY;i+=1){
      const balloonMesh=originalBalloonMesh.clone();
      const angle=i/TITLE_ANIMATION_BALLOON_QTY*360*THREE.MathUtils.DEG2RAD;
      const x=Math.cos(angle)*TITLE_ANIMATION_BALLOON_RADIUS;
      const z=Math.sin(angle)*TITLE_ANIMATION_BALLOON_RADIUS;
      balloonMesh.position.set(x,0,z);


      this.add(balloonMesh);
    }
  }
  update(dt:number):void{

    for(let i=0;i<TITLE_ANIMATION_BALLOON_QTY;i+=1){
      const balloonMesh=this.children[i];
      if(!balloonMesh){
        throw new Error("balloonMesh is null");
      }
      const progressOffset=i/TITLE_ANIMATION_BALLOON_QTY*2;
      const progressTime=this.titleAnimationTime/TITLE_ANIMATION_DURATION;
      balloonMesh.position.y=(Math.sin((progressOffset+progressTime)*360*THREE.MathUtils.DEG2RAD)*0.5+0.5)*TITLE_ANIMATION_BALLOON_HEIGHT;
    }
    
    this.titleAnimationTime=(this.titleAnimationTime+dt)%TITLE_ANIMATION_DURATION;
  }

}