
import * as THREE from "three";

import Stats from "stats.js";

import {gsap} from "gsap";
// import {ScrollTrigger} from "gsap/ScrollTrigger";
// import {ScrollToPlugin} from "gsap/ScrollToPlugin";

// gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default class App{
  constructor(){
    console.log(THREE);
    console.log(Stats);
    console.log(gsap);
  }
}