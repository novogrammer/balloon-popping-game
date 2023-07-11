import * as THREE from "three";

export default class BalloonMesh extends THREE.Mesh{
  constructor(){
    const geometry = new THREE.IcosahedronGeometry( 1, 5 );
    geometry.translate(0,1,0);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xf02020,
      roughness:0.2,
      metalness:0,
      reflectivity:0.5,
      clearcoat:0.25,
      clearcoatRoughness:0.2,
    });
    super(geometry,material);
  }
}

