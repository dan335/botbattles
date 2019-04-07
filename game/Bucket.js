import {
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Mesh
} from 'three';


export default class Bucket {
  constructor(manager, numObjects) {
    this.manager = manager;
    this.objects = [];
    this.numObjects = numObjects

    this.createObjects();
  }


  createObjects() {
    for (let i = 0; i < this.numObjects; i++) {
      this.objects.push(this.createObject());
    }
  }


  createObject() {
  }


  geometry() {
    return this.manager.planeBufferGeometry.clone();
  }


  getObject() {
      let obj = this.objects.pop();
      if (!obj) {
        obj = createObject();
      }
      obj.visible = true;
      return obj;
  }


  returnObject(obj) {
    if (obj) {
      obj.visible = false;
      this.objects.push(obj);
    }
  }
}
