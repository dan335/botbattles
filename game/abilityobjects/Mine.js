import Grenade from './Grenade.js';
import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';



export default class Mine extends Grenade {
  constructor(manager, x, y, rotation, radius, id, color) {
    super(manager, x, y, rotation, radius/2, id, color);
    this.manager.sounds.mineDropper.play();
  }


  createMesh() {
    var geometry = new PlaneBufferGeometry( this.radius * 8, this.radius * 8 );
    var material = new MeshBasicMaterial({
      color: this.color,
      transparent: true,
      alphaMap: this.manager.textures.mineAlpha
    });
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, -0.5, this.position.y);
    this.mesh.rotation.set(-Math.PI/2, 0, this.rotation * -1);
    this.manager.scene.add(this.mesh);
  }
}
