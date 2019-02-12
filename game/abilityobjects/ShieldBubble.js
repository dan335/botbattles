import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class ShieldBubble extends Obj {
  constructor(manager, x, y, rotation, radius, id, ship) {
    super(manager, x, y, rotation, radius, id);
    this.ship = ship;

    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: 0x356ab5} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }


  tick() {
    this.mesh.position.set(this.ship.position.x, 0, this.ship.position.y);
  }


  destroy() {
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
