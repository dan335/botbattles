import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';
import Particle from '../fx/Particle.js';



export default class Explosion extends Obj {
  constructor(manager, x, y, rotation, radius, id, color) {
    super(manager, x, y, rotation, radius, id);
    this.radius = radius;
    var geometry = new CylinderBufferGeometry( 1, 1, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: parseInt(color)} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);

    if (this.radius > 30) {
      for (let i = 0; i < 10; i++) {
        new Particle(this.manager, {
          x: this.position.x,
          y: this.position.y,
          rotation: Math.random() * Math.PI*2,
          scale: 20,
          speed: 4,
          drag: 0.8,
          lifespan: 200,
          color: parseInt(color),
          fadeTime: 150
        });
      }
    }
  }


  tick() {
    let scale = this.mesh.scale.x;
    scale += this.radius / 5;
    if (scale <= this.radius) {
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
