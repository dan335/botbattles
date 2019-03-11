import Obj from '../Obj.js';
import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class ShieldBubble extends Obj {
  constructor(manager, x, y, rotation, radius, id, ship) {
    super(manager, x, y, rotation, radius, id);
    this.ship = ship;

    var geometry = new PlaneBufferGeometry( this.radius * 4, this.radius * 4 );
    var material = new MeshBasicMaterial( {
      color: 0x356ab5,
      alphaMap: this.manager.textures.forceFieldAlpha,
      transparent: true
    });
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.ship.position.x, 0, this.ship.position.y);
    this.mesh.rotation.set(-Math.PI/2, 0, 0);
    this.manager.scene.add(this.mesh);

    this.manager.sounds.forceField.play();
  }


  tick(now) {
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
