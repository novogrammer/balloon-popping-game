
import * as THREE from "three";

import Stats from "stats.js";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import {Firestore, addDoc, collection, getFirestore, onSnapshot} from "firebase/firestore";


// import {gsap} from "gsap";
import { FOVY, IS_DEBUG } from "./constants";
import SceneContextInterface from "./SceneState/SceneContextInterface";
import SceneStateBase from "./SceneState/SceneStateBase";
import SceneStateTitle from "./SceneState/SceneStateTitle";
import PlayerScoreInterface from "./PlayerScoreInterface";
import { firebaseConfig } from "./firebase_constants";
import ElementSizeObserver from "./ElementSizeObserver";
// import {ScrollTrigger} from "gsap/ScrollTrigger";
// import {ScrollToPlugin} from "gsap/ScrollToPlugin";

// gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

interface UIFootObjects{
  buttonJElement:HTMLButtonElement;
  buttonKElement:HTMLButtonElement;
  buttonLElement:HTMLButtonElement;
}
interface UISystemObjects{
  buttonToggleDebugElement:HTMLButtonElement;
  buttonToggleUIElement:HTMLButtonElement;
}

interface FirebaseObjects{
  app:FirebaseApp,
  analytics:Analytics,
  firestore:Firestore,
}

interface ThreeObjects{
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
}

export default class App implements SceneContextInterface{
  currentSceneState:SceneStateBase|null=null;
  appElement:HTMLDivElement;
  debugViewElement:HTMLDivElement;
  uiViewElement:HTMLDivElement;
  uiFootObjects?:UIFootObjects;
  uiSystemObjects?:UISystemObjects;
  game3DViewElement:HTMLDivElement;
  game2DViewElement:HTMLDivElement;

  threeObjects?:ThreeObjects;

  elementSizeObserver:ElementSizeObserver;

  stats?:Stats;
  playerScoreList:PlayerScoreInterface[]=[];

  firebaseObjects?:FirebaseObjects;
  constructor(){
    console.log(THREE);
    this.appElement=document.querySelector<HTMLDivElement>("#app")!;
    if(!this.appElement){
      throw new Error("appElement is null");
    }
    this.game3DViewElement=document.createElement("div");
    this.game3DViewElement.classList.add("p-game3d-view");
    this.appElement.appendChild(this.game3DViewElement);

    this.game2DViewElement=document.createElement("div");
    this.game2DViewElement.classList.add("p-game2d-view");
    this.appElement.appendChild(this.game2DViewElement);
    
    this.debugViewElement=document.createElement("div");
    this.debugViewElement.classList.add("p-debug-view");
    this.appElement.appendChild(this.debugViewElement);

    this.uiViewElement=document.createElement("div");
    this.uiViewElement.classList.add("p-ui-view");
    this.appElement.appendChild(this.uiViewElement);

    this.elementSizeObserver = new ElementSizeObserver({
      elementForSize: this.game3DViewElement,
    });
    
    this.setupStats();
    this.setupFirebase();
    this.setupUI();
    this.setupThree();
    this.setupEvents();
    this.setNextSceneState(new SceneStateTitle(this))
  }
  setupFirebase(){
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const firestore = getFirestore(app);
    onSnapshot(collection(firestore,"playerScores"),(querySnapshot)=>{
      this.playerScoreList=[];
      querySnapshot.forEach((doc) => {
        const data=doc.data() as PlayerScoreInterface;
        // console.log(data);
        this.playerScoreList.push(data);
      });
    });
    this.firebaseObjects={
      app,
      analytics,
      firestore,
    }
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
    switch(event.code){
      case "KeyD":
        this.debugViewElement.classList.toggle("p-debug-view--hidden");
        break;
      case "KeyU":
        this.uiViewElement.classList.toggle("p-ui-view--hidden");
        break;
    }
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
  setupStats(){
    this.stats = new Stats();
    this.stats.dom.style.display = IS_DEBUG ? "block" : "none";
    this.stats.dom.style.left="auto";
    this.stats.dom.style.right="0px";
    document.body.appendChild(this.stats.dom);

  }
  setupUI(){
    {
      
      const footButtonListElement=document.createElement("div");
      footButtonListElement.classList.add("p-ui-view__foot-button-list");
      this.uiViewElement.appendChild(footButtonListElement);
      
      const buttonJElement=document.createElement("button");
      buttonJElement.textContent="J";
      buttonJElement.classList.add("p-ui-view__foot-button");
      buttonJElement.classList.add("p-ui-view__foot-button--j");
      footButtonListElement.appendChild(buttonJElement);

      const buttonKElement=document.createElement("button");
      buttonKElement.textContent="K";
      buttonKElement.classList.add("p-ui-view__foot-button");
      buttonKElement.classList.add("p-ui-view__foot-button--k");
      footButtonListElement.appendChild(buttonKElement);

      const buttonLElement=document.createElement("button");
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

      const buttonToggleDebugElement=document.createElement("button");
      buttonToggleDebugElement.textContent="toggle debug";
      buttonToggleDebugElement.classList.add("p-ui-view__system-button");
      buttonToggleDebugElement.classList.add("p-ui-view__system-button--toggle-debug");
      systemButtonListElement.appendChild(buttonToggleDebugElement);

      const buttonToggleUIElement=document.createElement("button");
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
  setupThree(){

    const size = this.elementSizeObserver.getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOVY, size.width / size.height, 0.1, 1000);
    camera.position.z=5;
    scene.add(camera);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    const renderer = new THREE.WebGLRenderer({
      alpha: false,
    });
    renderer.domElement.classList.add("p-game3d-view__canvas");
    this.game3DViewElement.appendChild(renderer.domElement);

    this.threeObjects={
      renderer,
      camera,
      scene,
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
    this.elementSizeObserver.onResize=this.onResize.bind(this);

    let previousTime=performance.now() * 0.001;
    const animate = () => {
      if(this.stats){
        this.stats.begin();
      }
      requestAnimationFrame(animate);
      const currentTime=performance.now() * 0.001;
      const dt=currentTime-previousTime;
      this.elementSizeObserver.update();
      this.update(dt);
      previousTime=currentTime;
      if(this.stats){
        this.stats.end();
      }
    }

    animate();

  }
  update(dt:number):void{
    if(this.currentSceneState){
      this.currentSceneState.update(dt);
    }
    if (!this.threeObjects) {
      throw new Error("this.threeObjects is null");
    }
    const {renderer,scene,camera}=this.threeObjects;
    renderer.render(scene, camera);

  }

  setNextSceneState(nextSceneState:SceneStateBase|null):void {
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
  getGame2DViewElement():HTMLDivElement{
    return this.game2DViewElement;
  }
  submitPlayerScore(playerScore:PlayerScoreInterface):void{
    if(!this.firebaseObjects){
      throw new Error("firebaseObjects is null");
    }
    const {firestore}=this.firebaseObjects;
    addDoc(collection(firestore, "playerScores"),playerScore);

  }
  getPlayerScoreList(): PlayerScoreInterface[] {
    return this.playerScoreList;
  }
  onResize(){
    if (!this.threeObjects) {
      throw new Error("this.threeObjects is null");
    }
    const { renderer, camera } = this.threeObjects;
    const size = this.elementSizeObserver.getSize();
    if (IS_DEBUG) {
      console.log("onResize", size.width, size.height);
    }
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

  }

}