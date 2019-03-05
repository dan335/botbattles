import Particle from '../fx/Particle.js';
import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';
import Obj from '../Obj.js';




export default class TeleportEffect extends Obj {
  constructor(manager, x, y, radius) {
    super(manager, x, y, 0, radius, Math.random());

    var geometry = new PlaneBufferGeometry( this.radius * 4, this.radius * 4 );
    var material = new MeshBasicMaterial({
      color: 0x356ab5,
      alphaMap: this.manager.textures.particleAlpha,
      transparent: true,
      alphaTest: 0.1
    });
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.mesh.rotation.set(-Math.PI/2, 0, 0)
    this.manager.scene.add(this.mesh);

    this.manager.sounds.teleport.play();

    setTimeout(() => {
      this.destroy();
    }, 300);
  }


  destroy() {
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
