import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';


export default class Obstacle extends Obj {
  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);

    var geometry = new CylinderBufferGeometry( radius, radius, 1, 32 );
    var material = new MeshBasicMaterial( {color: 0x777777} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }


  destroy() {
    super.destroy();
    const index = this.manager.obstacles.indexOf(this);
    if (index != -1) {
      this.manager.obstacles.splice(index, 1);
    }
  }
}
