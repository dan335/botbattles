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
  }


  updateAttributes(json) {
    const size = Number(json.size);
    if (size) {
      if (this.size != size) {
        this.size = size;
        this.bg.updateScale(size);
      }
    }
  }


  tick() {
  }
}
