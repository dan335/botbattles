import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class SilencerGfx extends Obj {
  constructor(manager, radius, id, ship) {
    super(manager, ship.position.x, ship.position.y, ship.rotation, radius, id);
    this.ship = ship;

    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: 0x666666} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(ship.position.x, 0, ship.position.y);
    this.manager.scene.add(this.mesh);

    setTimeout(() => {
      this.destroy();
    }, 200);

    this.manager.sounds.silencer.play();
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
