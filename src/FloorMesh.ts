import * as THREE from "three";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export default class FloorMesh extends THREE.Mesh{
  constructor(){

    const fromX=-15;
    const fromZ=-15;
    const toX=15;
    const toZ=15;
    const size=2;
    const planeGeometryList=[];
    for(let x=fromX;x<toX;x+=size){
      for(let z=fromZ;z<toZ;z+=size){
        const planeGeometry = new THREE.PlaneGeometry( size, size );
        planeGeometry.rotateX(-90*THREE.MathUtils.DEG2RAD);
        planeGeometry.translate(size*0.5,0,size*0.5);
        planeGeometry.translate(x,0,z);
        planeGeometryList.push(planeGeometry);
      }
    }
    const geometry=BufferGeometryUtils.mergeGeometries(planeGeometryList);


    const base="./textures/polyhaven/metal_plate_1k/";
    const prefix="metal_plate_";
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
    super(geometry,material);

  }
}