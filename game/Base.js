import {
  Matrix4
} from 'three';



export default class Base {

  constructor(manager, x, y, rotation, radius, id) {
    this.manager = manager;
    this.position = {x:x, y:y};
    this.rotation = rotation;
    this.radius = radius;
    this.id = id;
    this.syncPositions = [];
  }


  destroy() {
    if (this.mesh) {
      this.manager.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh = undefined;
    }
  }


  tick(now) {
  }


  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;

    if (this.mesh) {
      this.mesh.position.set(x, 0, y);
    }
  }


  setRotation(r) {
    this.rotation = r;

    if (this.mesh) {
      this.mesh.rotation.set(0, r * -1, 0);   // why -1?
    }
  }


  updateAttributes(json) {
    this.setPosition(Number(json.x), Number(json.y));
    this.setRotation(Number(json.rotation));
  }


  // not used
  rotateAroundWorldAxis(obj, axis, radians) {
    let rotWorldMatrix = new Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(obj.matrix);  // pre-multiply
    obj.matrix = rotWorldMatrix;
    obj.setRotationFromMatrix(obj.matrix);
  }
}
