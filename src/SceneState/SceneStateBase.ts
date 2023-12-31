import KeyEventListenerInterface from "../KeyEventListenerInterface";
import SceneContextInterface from "./SceneContextInterface";

export default abstract class SceneStateBase implements KeyEventListenerInterface{
  sceneContext:SceneContextInterface;
  game2DSceneElement:HTMLDivElement;

  constructor(sceneContext:SceneContextInterface){
    this.sceneContext=sceneContext;
    this.game2DSceneElement=document.createElement("div");
    this.game2DSceneElement.classList.add("p-game2d-view__scene");
  }
  abstract onBeginSceneState():void;
  abstract onEndSceneState():void;
  abstract update(dt:number):void;
  abstract isGame():boolean;
  //#region KeyEventListenerInterface
  abstract onCodeDown(code:string):void;
  abstract onCodeUp(code:string):void;
  //#endregion
}