import {
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line
} from 'three';


export default class Map {

  constructor(manager, json) {
    this.manager = manager;
    this.size = Number(json.size);
  }


  updateAttributes(json) {
    const size = Number(json.size);
    if (size) {
      if (this.size != size) {
        this.size = size;
      }
    }
  }


  tick() {
  }
}
