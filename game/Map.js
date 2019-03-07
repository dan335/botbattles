import {
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line
} from 'three';
import Bg from './Bg.js';


export default class Map {

  constructor(manager, json) {
    this.manager = manager;
    this.size = Number(json.size);
    this.bg = new Bg(manager, this.size);
    this.updateUI();
  }


  updateAttributes(json) {
    const size = Number(json.size);
    if (size) {
      if (this.size != size) {
        this.size = size;
        this.bg.updateScale(size);
        this.updateUI();
      }
    }
  }


  updateUI() {
    var width = window.innerWidth, height = window.innerHeight;
    var widthHalf = width / 2, heightHalf = height / 2;
    var pos = new Vector3(this.size/2, 0, 0);
    pos.project(this.manager.camera);
    pos.x = ( pos.x * widthHalf ) + widthHalf;
    pos.y = - ( pos.y * heightHalf ) + heightHalf;

    const elm = document.getElementById('rightUI');
    if (elm) {
      elm.style.right = (width - pos.x - 200 - 40) + 'px';
    }
  }


  tick() {
  }
}
