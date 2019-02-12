import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class Explosion extends Obj {
  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);
    this.radius = radius;
    var geometry = new CylinderBufferGeometry( 1, 1, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: 0xff4444} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }


  tick() {
    let scale = this.mesh.scale.x;
    scale += this.radius / 4.1;
    if (scale < this.radius * 2) {
      this.mesh.scale.set(scale, 1, scale);
    } else {
      this.destroy();
    }
  }


  destroy() {
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
