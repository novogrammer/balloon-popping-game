import { IS_DEBUG } from "../constants";
import SceneContextInterface from "./SceneContextInterface";
import SceneStateBase from "./SceneStateBase";

import SceneStatePlaying from "./SceneStatePlaying";

export default class SceneStateTitle extends SceneStateBase{
  debugTitle:HTMLDivElement;
  constructor(sceneContext:SceneContextInterface){
    super(sceneContext);
    this.debugTitle=document.createElement("div");
    this.debugTitle.classList.add("p-debug-view__title");
    this.debugTitle.textContent="SceneStateTitle";
    this.setupGame2DScene();
  }
  setupGame2DScene(){
    this.game2DSceneElement.classList.add("p-game2d-scene-title");

    const titleElement=document.createElement("div");
    titleElement.classList.add("p-game2d-scene-title__title");
    titleElement.textContent="Balloon Popping Game";
    this.game2DSceneElement.appendChild(titleElement);

    const copyrightElement=document.createElement("div");
    copyrightElement.classList.add("p-game2d-scene-title__copyright");
    copyrightElement.textContent="novogrammer 2023";
    this.game2DSceneElement.appendChild(copyrightElement);

    const orderElement=document.createElement("div");
    orderElement.classList.add("p-game2d-scene-title__order");
    orderElement.textContent="PUSH ANY BUTTON";
    this.game2DSceneElement.appendChild(orderElement);
  }
  onBeginSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onBeginSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.appendChild(this.debugTitle);
    const game2DViewElement=this.sceneContext.getGame2DViewElement();
    game2DViewElement.appendChild(this.game2DSceneElement);
    
  }
  onEndSceneState(): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onEndSceneState`);
    }
    const debugViewElement=this.sceneContext.getDebugViewElement();
    debugViewElement.removeChild(this.debugTitle);
    const game2DViewElement=this.sceneContext.getGame2DViewElement();
    game2DViewElement.removeChild(this.game2DSceneElement);
    
  }
  onCodeDown(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeDown`,code);
    }
    if(["KeyJ","KeyK","KeyL"].includes(code)){
      const nextSceneState=new SceneStatePlaying(this.sceneContext);
      this.sceneContext.setNextSceneState(nextSceneState);
    }
  }
  onCodeUp(code:string): void {
    if(IS_DEBUG){
      console.log(`${this.constructor.name}.onCodeUp`,code);
    }
  }
  update(_dt:number):void{

  }
}