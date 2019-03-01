import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class SilencerGfx extends Obj {
  constructor(manager, x, y, radius, id, ship) {
    super(manager, x, y, ship.rotation, radius, id);
    this.ship = ship;

    var geometry = new CylinderBufferGeometry( 1, 1, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: 0x666666} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(ship.position.x, 0, ship.position.y);
    this.manager.scene.add(this.mesh);

    this.manager.sounds.silencer.play();
  }


  tick() {
    let scale = this.mesh.scale.x;
    scale += this.radius / 5;
    if (scale < this.radius) {
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
