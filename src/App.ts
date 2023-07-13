
import * as THREE from "three";
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import Stats from "stats.js";

import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import {Firestore, addDoc, collection, getFirestore, onSnapshot} from "firebase/firestore";


// import {gsap} from "gsap";
import { FOVY, IS_DEBUG, MAIN_CAMERA_GAME_LOOKAT, MAIN_CAMERA_GAME_POSITION, MAIN_CAMERA_MOVE_DURATION, MAIN_CAMERA_MOVE_LIST } from "./constants";
import SceneContextInterface from "./SceneState/SceneContextInterface";
import SceneStateBase from "./SceneState/SceneStateBase";
import SceneStateTitle from "./SceneState/SceneStateTitle";
import PlayerScoreInterface from "./PlayerScoreInterface";
import { firebaseConfig } from "./firebase_constants";
import ElementSizeObserver from "./ElementSizeObserver";
// import BalloonMesh from "./BalloonMesh";
// import FootMesh from "./FootMesh";
import StarMesh from "./StarMesh";
import FloorMesh from "./FloorMesh";
import TitleAnimationGroup from "./TitleAnimationGroup";
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
  titleAnimationGroup: TitleAnimationGroup;
}

interface OriginalMeshes{
  starMesh:THREE.Mesh;
  footMesh:THREE.Mesh;
  balloonMesh:THREE.Mesh;
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

  originalMeshes?:OriginalMeshes;
  threeObjects?:ThreeObjects;

  elementSizeObserver:ElementSizeObserver;

  stats?:Stats;
  playerScoreList:PlayerScoreInterface[]=[];

  firebaseObjects?:FirebaseObjects;

  isDebug:boolean;
  cameraMoveTime:number;
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

    this.isDebug=true;
    this.cameraMoveTime=0;
    
    this.setupStats();
    if(!IS_DEBUG){
      this.toggleDebug();
    }
    this.setupFirebase();
    this.setupUI();

    this.loadMeshAsync().then(()=>{
      this.setupThree();
      this.setupEvents();
      this.setNextSceneState(new SceneStateTitle(this))
    })
  }
  async loadMeshAsync():Promise<void>{
    const loadGltfMeshAsync = async (path:string):Promise<THREE.Mesh> =>{
      const gltfLoader=new GLTFLoader();
      const gltf= await gltfLoader.loadAsync(path);
      const mesh = await new Promise<THREE.Mesh>((resolve,reject)=>{
        gltf.scene.traverse((object3D)=>{
          if(object3D instanceof THREE.Mesh){
            object3D.receiveShadow=true;
            object3D.castShadow=true;
            resolve(object3D);
          }
        });
        // すでにresolveが呼ばれた場合は無視される
        reject(new Error("mesh not found"));
      });
      return mesh;
    }
    const base="./models/";
    const weightMesh = await loadGltfMeshAsync(`${base}weight.glb`)
    const balloonMesh = await loadGltfMeshAsync(`${base}balloon.glb`)

    this.originalMeshes={
      starMesh:new StarMesh(),
      footMesh:weightMesh,
      balloonMesh:balloonMesh,
    };

  }
  setupFirebase():void{
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
  onKeyDown(event:KeyboardEvent):void{
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
  onKeyUp(event:KeyboardEvent):void{
    if(IS_DEBUG){
      console.log(event);
    }
    if(!this.currentSceneState){
      throw new Error("this.currentSceneState is null");
    }
    this.currentSceneState.onCodeUp(event.code);
  }
  setupStats():void{
    this.stats = new Stats();
    this.stats.dom.style.left="auto";
    this.stats.dom.style.right="0px";
    document.body.appendChild(this.stats.dom);

  }
  setupUI():void{
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
  setupThree():void{

    const size = this.elementSizeObserver.getSize();

    THREE.ColorManagement.enabled=true;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOVY, size.width / size.height, 0.1, 1000);
    camera.name="MainCamera";
    camera.position.copy(MAIN_CAMERA_GAME_POSITION);
    camera.lookAt(MAIN_CAMERA_GAME_LOOKAT);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    ambientLight.name="AmbientLight";
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-6, 10, 3);
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

    const floorMesh=new FloorMesh();
    floorMesh.receiveShadow=true;
    scene.add(floorMesh);

    const titleAnimationGroup=new TitleAnimationGroup(this.getOriginalBalloonMesh());
    scene.add(titleAnimationGroup);

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
      titleAnimationGroup,
    }

  }
  setupEvents():void{
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
    const {renderer,scene,camera,titleAnimationGroup}=this.threeObjects;
    titleAnimationGroup.update(dt);
    if(this.currentSceneState){
      if(this.currentSceneState.isGame()){
        camera.position.copy(MAIN_CAMERA_GAME_POSITION);
        camera.lookAt(MAIN_CAMERA_GAME_LOOKAT);
        titleAnimationGroup.visible=false;
      }else{
        camera.position.copy(MAIN_CAMERA_GAME_POSITION);
        titleAnimationGroup.visible=true;

        this.cameraMoveTime=(this.cameraMoveTime+dt)%MAIN_CAMERA_MOVE_DURATION;
        let totalDuration=0;
        for(let mainCameraMove of MAIN_CAMERA_MOVE_LIST){
          if(this.cameraMoveTime<totalDuration+mainCameraMove.duration){
            const r=(this.cameraMoveTime-totalDuration)/mainCameraMove.duration;
            camera.position.lerpVectors(mainCameraMove.from,mainCameraMove.to,r);
            break;
          }
          totalDuration+=mainCameraMove.duration;
        }
        camera.lookAt(MAIN_CAMERA_GAME_LOOKAT);
      }
    }

    renderer.render(scene, camera);

  }

  onResize():void{
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
  toggleDebug():void{
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
  toggleUI():void{
    this.uiViewElement.classList.toggle("p-ui-view--hidden");
  }
  toggleFullscreen():void{
    if (!document.fullscreenElement) {
      this.appElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }

  }
  //#region SceneContextInterface
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
  getOriginalStarMesh(): THREE.Mesh {
    if(!this.originalMeshes){
      throw new Error("this.originalMeshes is null");
    }
    return this.originalMeshes.starMesh;
  }
  getOriginalFootMesh(): THREE.Mesh {
    if(!this.originalMeshes){
      throw new Error("this.originalMeshes is null");
    }
    return this.originalMeshes.footMesh;
  }
  getOriginalBalloonMesh(): THREE.Mesh {
    if(!this.originalMeshes){
      throw new Error("this.originalMeshes is null");
    }
    return this.originalMeshes.balloonMesh;
  }
  //#endregion

}