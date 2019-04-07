import Obj from '../Obj.js';
import {
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader,
  Color
} from 'three';



export default class SlamGfx extends Obj {
  constructor(manager, radius, x, y, id, ship) {
    super(manager, x, y, ship.rotation, radius, id);
    this.ship = ship;

    var geometry = this.manager.planeBufferGeometry.clone();
    var material = new MeshBasicMaterial({
      color: new Color(0x888888),
      alphaMap: this.manager.textures.forceFieldAlpha,
      transparent: true
    });
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(x, 0, y);
    this.mesh.rotation.set(-Math.PI/2, 0, 0);
    this.mesh.scale.set(20, 1, 20);
    this.manager.scene.add(this.mesh);

    this.manager.sounds.slam.play();
  }


  tick(now) {
    //this.mesh.position.set(this.ship.position.x, 0, this.ship.position.y);

    let scale = this.mesh.scale.x;
    scale += this.radius * 4 / 10;

    if (scale <= this.radius * 4) {
      this.mesh.scale.set(scale, scale, scale);
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
