import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';
import Particle from '../fx/Particle.js';



export default class BlasterBullet extends Obj {
  constructor(manager, x, y, rotation, radius, id, color) {
    super(manager, x, y, rotation, radius, id);

    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 0.1, 12 );
    var material = new MeshBasicMaterial( {color: parseInt(color)} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, -0.5, this.position.y);
    this.mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), this.rotation * -1);
    this.manager.scene.add(this.mesh);

    new Particle(this.manager, {
      x: this.position.x,
      y: this.position.y,
      rotation: this.rotation,
      scale: 30,
      speed: 0.5,
      drag: 0.8,
      lifespan: 200,
      color: parseInt(color),
      fadeTime: 150
    });
  }


  destroy() {
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
