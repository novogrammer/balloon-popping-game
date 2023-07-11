import * as THREE from "three";

export default class FootMesh extends THREE.Mesh{
  constructor(){
    const geometry = new THREE.BoxGeometry( 1, 1, 2 );
    geometry.translate(0,0.5,0);

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

