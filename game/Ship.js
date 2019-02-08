import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';

export default class Ship extends Obj {
  constructor(manager, x, y, rotation, id) {
    super(manager, x, y, rotation, id)

    var geometry = new CylinderBufferGeometry( 25, 25, 1, 32 );
    var material = new MeshBasicMaterial( {color: 0xffff00} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }


  tick() {
    super.tick();
  }


  destroy() {
    super.destroy();
    const index = this.manager.ships.indexOf(this);
    if (index != -1) {
      this.manager.ships.splice(index, 1);
    }
  }
}
