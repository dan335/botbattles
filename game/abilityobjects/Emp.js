import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class Emp extends Obj {
  constructor(manager, x, y, radius, id) {
    super(manager, x, y, 0, radius, id);
    this.radius = radius;

    setTimeout(() => {
      var geometry = new CylinderBufferGeometry( 1, 1, 0.5, 32 );
      var material = new MeshBasicMaterial( {color: 0x356ab5} );
      this.mesh = new Mesh( geometry, material );
      this.mesh.position.set(this.position.x, 0, this.position.y);
      this.manager.scene.add(this.mesh);

      this.manager.sounds.emp.play();
    }, this.manager.renderDelay);
  }


  tick() {
    if (this.mesh) {
      let scale = this.mesh.scale.x;
      scale += this.radius / 5;
      if (scale < this.radius) {
        this.mesh.scale.set(scale, 1, scale);
      } else {
        this.destroy();
      }
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
