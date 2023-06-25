
import * as THREE from "three";

import Stats from "stats.js";

import {gsap} from "gsap";
import { IS_DEBUG } from "./constants";
import SceneContextInterface from "./SceneState/SceneContextInterface";
import SceneStateBase from "./SceneState/SceneStateBase";
import SceneStateTitle from "./SceneState/SceneStateTitle";
// import {ScrollTrigger} from "gsap/ScrollTrigger";
// import {ScrollToPlugin} from "gsap/ScrollToPlugin";

// gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default class App implements SceneContextInterface{
  currentSceneState?:SceneStateBase;
  appElement:HTMLDivElement;
  debugViewElement:HTMLDivElement;
  constructor(){
    console.log(THREE);
    console.log(Stats);
    console.log(gsap);
    this.appElement=document.querySelector<HTMLDivElement>("#app")!;
    if(!this.appElement){
      throw new Error("appElement is null");
    }
    this.debugViewElement=document.createElement("div");
    this.debugViewElement.classList.add("p-debug-view");
    this.appElement.appendChild(this.debugViewElement);
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
  onKeyUp(event:KeyboardEvent){
    if(IS_DEBUG){
      console.log(event);
    }
    if(!this.currentSceneState){
      throw new Error("this.currentSceneState is null");
    }
    this.currentSceneState.onKeyUp(event);
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
  getDebugViewElement(): HTMLDivElement {
    return this.debugViewElement;
  }
}