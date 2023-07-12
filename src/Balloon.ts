import * as THREE from "three";
import {gsap} from "gsap";
import BalloonContextInterface from "./BalloonState/BalloonContextInterface";
import BalloonStateBase from "./BalloonState/BalloonStateBase";
import BalloonStatePreparing from "./BalloonState/BalloonStatePreparing";
import ObjectLocation from "./ObjectLocation";
import { AWAY_DURATION, POPPING_DURATION, READY_DURATION, STAR_EFFECT_MOVE_LENGTH, STAR_EFFECT_QTY } from "./constants";

export default class Balloon implements BalloonContextInterface{
  objectLocation:ObjectLocation|null=null;
  currentBalloonState:BalloonStateBase|null=null;
  debugBalloon:HTMLElement;
  baseGroup:THREE.Group;
  balloonMesh:THREE.Mesh;
  starMeshList:THREE.Mesh[];
  constructor(originalBalloonMesh:THREE.Mesh,originalStarMesh:THREE.Mesh){
    this.debugBalloon=document.createElement("div");
    this.debugBalloon.classList.add("p-debug-view__balloon");
    this.baseGroup=new THREE.Group();
    this.balloonMesh=originalBalloonMesh.clone();
    // this.balloonMesh.visible=false;
    this.baseGroup.add(this.balloonMesh);

    this.starMeshList=Array.from({length:STAR_EFFECT_QTY}).map(()=>originalStarMesh.clone());
    for(let starMesh of this.starMeshList){
      // starMesh.visible=false;
      this.baseGroup.add(starMesh);
    }

    this.setNextBalloonState(new BalloonStatePreparing(this));
  }
  destroy(){
    this.setNextBalloonState(null);
  }
  setObjectLocation(objectLocation:ObjectLocation|null){
    if(this.objectLocation){
      this.objectLocation.objectLocationGroup.remove(this.baseGroup);
      this.objectLocation.debugObjectLocation.removeChild(this.debugBalloon);
    }
    this.objectLocation=objectLocation;
    if(this.objectLocation){
      this.objectLocation.debugObjectLocation.appendChild(this.debugBalloon);
      this.objectLocation.objectLocationGroup.add(this.baseGroup);
    }
  }

  setNextBalloonState(nextBalloonState: BalloonStateBase|null): void {
    if(this.currentBalloonState){
      this.currentBalloonState.onEndBalloonState();
    }
    this.currentBalloonState=nextBalloonState;
    if(this.currentBalloonState){
      this.currentBalloonState.onBeginBalloonState();
    }
  }
  addDebugModifier(modifier:string):void{
    this.debugBalloon.classList.add("p-debug-view__balloon--"+modifier);
  }
  removeDebugModifier(modifier:string):void{
    this.debugBalloon.classList.remove("p-debug-view__balloon--"+modifier);
  }

  update(dt:number){
    if(!this.currentBalloonState){
      throw new Error("currentBalloonState is null");
    }
    this.currentBalloonState.update(dt);
  }
  onStamp():void{
    if(!this.currentBalloonState){
      throw new Error("currentBalloonState is null");
    }
    this.currentBalloonState.onStamp();
  }
  addScore(score: number): void {
    if(this.objectLocation){
      this.objectLocation.addScore(score);
    }
  }
  startPreparingAnimation():void{
    this.balloonMesh.visible=false;
    for(let starMesh of this.starMeshList){
      starMesh.visible=false;
    }
  }
  startReadyAnimation():void{
    this.balloonMesh.visible=true;
    // this.balloonMesh.scale.set(0.1,0.1,0.1);
    gsap.set(this.balloonMesh.position,{
      x:0,
      y:0,
      z:0,
    })
    gsap.fromTo(this.balloonMesh.scale,{
      x:0.1,
      y:0.1,
      z:0.1,
    },{
      x:1,
      y:1,
      z:1,
      duration:READY_DURATION,
      ease:"power3.out",
    });

  }
  startAwayAnimation():void{
    gsap.to(this.balloonMesh.position,{
      y:10,
      z:-10,
      duration:AWAY_DURATION,
      ease:"none",
    });

  }
  startPoppingAnimation():void{
    this.balloonMesh.visible=false;
    for(let [index,starMesh] of this.starMeshList.entries()){
      const angle=(index/this.starMeshList.length)*360*THREE.MathUtils.DEG2RAD;
      starMesh.visible=true;
      gsap.fromTo(starMesh.position,{
        x:0,
        y:0.5,
      },{
        x:0+Math.cos(angle)*STAR_EFFECT_MOVE_LENGTH,
        y:0.5+Math.sin(angle)*STAR_EFFECT_MOVE_LENGTH,
        duration:POPPING_DURATION*0.75,
        ease:"power3.out",
      });
    }

  }

}