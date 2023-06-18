
import * as THREE from "three";

import Stats from "stats.js";

import {gsap} from "gsap";
import { IS_DEBUG } from "./constants";
import SceneContextInterface from "./scene/SceneContextInterface";
import SceneStateBase from "./scene/SceneStateBase";
import SceneStateTitle from "./scene/SceneStateTitle";
// import {ScrollTrigger} from "gsap/ScrollTrigger";
// import {ScrollToPlugin} from "gsap/ScrollToPlugin";

// gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default class App implements SceneContextInterface{
  currentSceneState?:SceneStateBase;
  constructor(){
    console.log(THREE);
    console.log(Stats);
    console.log(gsap);
    this.setupEvents();
    this.setNextSceneState(new SceneStateTitle(this))
  }
  onKeyDown(event:KeyboardEvent){
    if(IS_DEBUG){
      console.log(event);
    }
    if(!this.currentSceneState){
      throw new Error("this.currentSceneState is null");
    }
    this.currentSceneState.onKeyDown(event);
    // switch(event.code){
    //   case "KeyJ":
    //     console.log(event.code);
    //     break;
    //   case "KeyK":
    //     console.log(event.code);
    //     break;
    //   case "KeyL":
    //     console.log(event.code);
    //     break;
    // }
  }
  setupEvents(){
    document.addEventListener("keydown",this.onKeyDown.bind(this));
  }
  setNextSceneState(nextSceneState:SceneStateBase):void {
    if(this.currentSceneState){
      this.currentSceneState.onEndSceneState();
    }
    this.currentSceneState=nextSceneState;
    if(this.currentSceneState){
      this.currentSceneState.onBeginSceneState();
    }
  }
}