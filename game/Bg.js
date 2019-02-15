import Obj from './Obj.js';
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';


export default class Bg {
  constructor(manager, scale) {
    this.manager = manager;
    var geometry = new BoxBufferGeometry( 1, 1, 1 );
    var material = new MeshBasicMaterial( {color: 0x181c1f} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(0, -10, 0);
    this.mesh.scale.set(scale, 1, scale);
    this.manager.scene.add(this.mesh);
  }


  updateScale(scale) {
    this.mesh.scale.set(scale, 1, scale);
  }


  destroy() {
    if (this.mesh) {
      this.manager.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh = undefined;
    }
  }
}
