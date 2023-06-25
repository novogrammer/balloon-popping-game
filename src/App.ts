
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

interface UIFootObjects{
  buttonJElement:HTMLDivElement;
  buttonKElement:HTMLDivElement;
  buttonLElement:HTMLDivElement;
}
interface UISystemObjects{
  buttonToggleDebugElement:HTMLDivElement;
  buttonToggleUIElement:HTMLDivElement;
}


export default class App implements SceneContextInterface{
  currentSceneState?:SceneStateBase;
  appElement:HTMLDivElement;
  debugViewElement:HTMLDivElement;
  uiViewElement:HTMLDivElement;
  uiFootObjects?:UIFootObjects;
  uiSystemObjects?:UISystemObjects;
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
    this.uiViewElement=document.createElement("div");
    this.uiViewElement.classList.add("p-debug-view");
    this.appElement.appendChild(this.uiViewElement);
    
    this.setupUI();
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
    if(!event.repeat){
      this.currentSceneState.onCodeDown(event.code);
    }
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
    this.currentSceneState.onCodeUp(event.code);
  }
  setupUI(){
    {
      
      const footButtonListElement=document.createElement("div");
      footButtonListElement.classList.add("p-ui-view__foot-button-list");
      this.uiViewElement.appendChild(footButtonListElement);
      
      const buttonJElement=document.createElement("div");
      buttonJElement.textContent="J";
      buttonJElement.classList.add("p-ui-view__foot-button");
      buttonJElement.classList.add("p-ui-view__foot-button--j");
      footButtonListElement.appendChild(buttonJElement);

      const buttonKElement=document.createElement("div");
      buttonKElement.textContent="K";
      buttonKElement.classList.add("p-ui-view__foot-button");
      buttonKElement.classList.add("p-ui-view__foot-button--k");
      footButtonListElement.appendChild(buttonKElement);

      const buttonLElement=document.createElement("div");
      buttonLElement.textContent="L";
      buttonLElement.classList.add("p-ui-view__foot-button");
      buttonLElement.classList.add("p-ui-view__foot-button--l");
      footButtonListElement.appendChild(buttonLElement);

      this.uiFootObjects={
        buttonJElement,
        buttonKElement,
        buttonLElement,
      };
    }
    {
      const systemButtonListElement=document.createElement("div");
      systemButtonListElement.classList.add("p-ui-view__system-button-list");
      this.uiViewElement.appendChild(systemButtonListElement);

      const buttonToggleDebugElement=document.createElement("div");
      buttonToggleDebugElement.textContent="toggle debug";
      buttonToggleDebugElement.classList.add("p-ui-view__system-button");
      buttonToggleDebugElement.classList.add("p-ui-view__system-button--toggle-debug");
      systemButtonListElement.appendChild(buttonToggleDebugElement);

      const buttonToggleUIElement=document.createElement("div");
      buttonToggleUIElement.textContent="toggle ui";
      buttonToggleUIElement.classList.add("p-ui-view__system-button");
      buttonToggleUIElement.classList.add("p-ui-view__system-button--toggle-debug");
      systemButtonListElement.appendChild(buttonToggleUIElement);

      this.uiSystemObjects={
        buttonToggleDebugElement,
        buttonToggleUIElement,
      };
    }

  }
  setupEvents(){
    document.addEventListener("keydown",this.onKeyDown.bind(this));
    document.addEventListener("keyup",this.onKeyUp.bind(this));
    {
      const {uiFootObjects}=this;
      if(!uiFootObjects){
        throw new Error("uiFootObjects is null");
      }
      const {
        buttonJElement,
        buttonKElement,
        buttonLElement,
      }=uiFootObjects;
      const footDown=(code:string)=>{
        if(!this.currentSceneState){
          throw new Error("this.currentSceneState is null");
        }
        this.currentSceneState.onCodeDown(code);
      }
      const footUp=(code:string)=>{
        if(!this.currentSceneState){
          throw new Error("this.currentSceneState is null");
        }
        this.currentSceneState.onCodeUp(code);
      }
      buttonJElement.addEventListener("pointerdown",footDown.bind(null,"KeyJ"));
      buttonJElement.addEventListener("pointerup",footUp.bind(null,"KeyJ"));
      buttonKElement.addEventListener("pointerdown",footDown.bind(null,"KeyK"));
      buttonKElement.addEventListener("pointerup",footUp.bind(null,"KeyK"));
      buttonLElement.addEventListener("pointerdown",footDown.bind(null,"KeyL"));
      buttonLElement.addEventListener("pointerup",footUp.bind(null,"KeyL"));
    }
    {
      const {uiSystemObjects}=this;
      if(!uiSystemObjects){
        throw new Error("uiSystemObjects is null");
      }
      const {
        buttonToggleDebugElement,
        buttonToggleUIElement,
      }=uiSystemObjects;
      buttonToggleDebugElement.addEventListener("click",()=>{
        this.debugViewElement.classList.toggle("p-debug-view--hidden");
      });
      buttonToggleUIElement.addEventListener("click",()=>{
        this.uiViewElement.classList.toggle("p-ui-view--hidden");
      });

    }
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