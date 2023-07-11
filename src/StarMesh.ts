import * as THREE from "three";

export default class StarMesh extends THREE.Mesh{
  constructor(){

    const geometry=new THREE.PlaneGeometry(0.5,0.5);
    const base="./textures/effects/";
    const diff=new THREE.TextureLoader().load(`${base}star.png`);

    const material=new THREE.MeshBasicMaterial({
      map:diff,
      depthWrite:false,
      transparent:true,
    });


    super(geometry,material);
  }
}