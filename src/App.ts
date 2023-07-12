
import * as THREE from "three";
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

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
import BalloonMesh from "./BalloonMesh";
import FootMesh from "./FootMesh";
import StarMesh from "./StarMesh";
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
  buttonToggleFullscreenElement:HTMLButtonElement;
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

interface OriginalMeshes{
  starMesh:StarMesh;
  footMesh:FootMesh;
  balloonMesh:BalloonMesh;
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

  originalMeshes:OriginalMeshes;
  threeObjects?:ThreeObjects;

  elementSizeObserver:ElementSizeObserver;

  stats?:Stats;
  playerScoreList:PlayerScoreInterface[]=[];

  firebaseObjects?:FirebaseObjects;

  isDebug:boolean;
  constructor(){
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

    this.originalMeshes={
      starMesh:new StarMesh(),
      footMesh:new FootMesh(),
      balloonMesh:new BalloonMesh(),
    };
    this.isDebug=true;
    
    this.setupStats();
    if(!IS_DEBUG){
      this.toggleDebug();
    }
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
        this.toggleDebug();
        break;
      case "KeyU":
        this.toggleUI();
        break;
      case "KeyF":
        this.toggleFullscreen();
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
      buttonToggleDebugElement.innerHTML="Toggle<br>(D)ebug";
      buttonToggleDebugElement.classList.add("p-ui-view__system-button");
      buttonToggleDebugElement.classList.add("p-ui-view__system-button--toggle-debug");
      systemButtonListElement.appendChild(buttonToggleDebugElement);

      const buttonToggleUIElement=document.createElement("button");
      buttonToggleUIElement.innerHTML="Toggle<br>(U)I";
      buttonToggleUIElement.classList.add("p-ui-view__system-button");
      buttonToggleUIElement.classList.add("p-ui-view__system-button--toggle-debug");
      systemButtonListElement.appendChild(buttonToggleUIElement);

      const buttonToggleFullscreenElement=document.createElement("button");
      buttonToggleFullscreenElement.innerHTML="Toggle<br>(F)ullscreen";
      buttonToggleFullscreenElement.classList.add("p-ui-view__system-button");
      buttonToggleFullscreenElement.classList.add("p-ui-view__system-button--toggle-fullscreen");
      systemButtonListElement.appendChild(buttonToggleFullscreenElement);

      this.uiSystemObjects={
        buttonToggleDebugElement,
        buttonToggleUIElement,
        buttonToggleFullscreenElement,
      };
    }

  }
  setupThree(){

    const size = this.elementSizeObserver.getSize();

    THREE.ColorManagement.enabled=true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOVY, size.width / size.height, 0.1, 1000);
    camera.name="MainCamera";
    camera.position.y=2;
    camera.position.z=5;
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    ambientLight.name="AmbientLight";
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-10, 10, 10);
    directionalLight.castShadow=true;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = - 10;
    directionalLight.shadow.camera.left = - 10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 40;    
    directionalLight.name="DirectionalLight";
    scene.add(directionalLight);

    const hdrLoader = new RGBELoader();
    hdrLoader.loadAsync( 'textures/equirectangular/blouberg_sunrise_2_1k.hdr' ).then((envMap:THREE.Texture)=>{
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      const skybox=new GroundProjectedSkybox(envMap);
      skybox.scale.setScalar(100);
      skybox.name="Skybox";
      scene.add(skybox);
      scene.environment=envMap;
    });

    const ground=(()=>{
      const geometry = new THREE.BoxGeometry( 10, 1, 10 );

      const base="./textures/polyhaven/red_brick_03_1k/";
      const prefix="red_brick_03_";
      const diff=new THREE.TextureLoader().load(`${base}${prefix}diff_1k.jpg`);
      const nor=new THREE.TextureLoader().load(`${base}${prefix}nor_gl_1k.png`);
      const rough=new THREE.TextureLoader().load(`${base}${prefix}rough_1k.jpg`);
      const metal=new THREE.TextureLoader().load(`${base}${prefix}metal_1k.png`);


      const material = new THREE.MeshStandardMaterial({
        map:diff,
        normalMap:nor,
        roughnessMap:rough,
        metalnessMap:metal,
      });
      geometry.translate(0,-0.5,0);
      const mesh = new THREE.Mesh( geometry, material );
      mesh.receiveShadow=true;
      return mesh;
    })();
    scene.add(ground);

    // const balloonMesh=new BalloonMesh();
    // balloonMesh.castShadow=true;
    // balloonMesh.receiveShadow=true;
    // balloonMesh.name="BalloonMesh";
    // scene.add( balloonMesh );

    // const starMesh=new StarMesh();
    // starMesh.position.y=2;
    // scene.add(starMesh);


    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias:true,
    });
    renderer.shadowMap.enabled=true;
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
        buttonToggleFullscreenElement,
      }=uiSystemObjects;
      buttonToggleDebugElement.addEventListener("click",()=>{
        this.toggleDebug();
      });
      buttonToggleUIElement.addEventListener("click",()=>{
        this.toggleUI();
      });
      buttonToggleFullscreenElement.addEventListener("click",()=>{
        this.toggleFullscreen();
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
  getThreeScene():THREE.Scene{
    if (!this.threeObjects) {
      throw new Error("this.threeObjects is null");
    }
    const {scene}=this.threeObjects;
    return scene;
  }
  getViewSize(){
    return this.elementSizeObserver.getSize();
  }
  submitPlayerScore(playerScore:PlayerScoreInterface):void{
    if(!this.firebaseObjects){
      throw new Error("this.firebaseObjects is null");
    }
    const {firestore}=this.firebaseObjects;
    addDoc(collection(firestore, "playerScores"),playerScore);

  }
  getPlayerScoreList(): PlayerScoreInterface[] {
    return this.playerScoreList;
  }
  getOriginalStarMesh(): StarMesh {
    return this.originalMeshes.starMesh;
  }
  getOriginalFootMesh(): FootMesh {
    return this.originalMeshes.footMesh;
  }
  getOriginalBalloonMesh(): BalloonMesh {
    return this.originalMeshes.balloonMesh;
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
  toggleDebug(){
    if(!this.stats){
      throw new Error("this.stats is null");
    }
    this.isDebug=!this.isDebug;
    if(this.isDebug){
      this.debugViewElement.classList.remove("p-debug-view--hidden");
      this.stats.dom.style.display = "block";
    }else{
      this.debugViewElement.classList.add("p-debug-view--hidden");
      this.stats.dom.style.display = "none";
    }
    
  }
  toggleUI(){
    this.uiViewElement.classList.toggle("p-ui-view--hidden");
  }
  toggleFullscreen(){
    if (!document.fullscreenElement) {
      this.appElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }

  }

}