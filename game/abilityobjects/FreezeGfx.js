import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';
import Particle from '../fx/Particle.js';

const color = 0x356ab5;

export default class FreezeGfx extends Obj {
  constructor(manager, radius, id, ship) {
    super(manager, ship.position.x, ship.position.y, ship.rotation, radius, id);
    this.ship = ship;

    var geometry = new CylinderBufferGeometry( 1, 1, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: color} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);

    for (let i = 0; i < 20; i++) {
      new Particle(this.manager, {
        x: this.position.x,
        y: this.position.y,
        rotation: Math.random() * Math.PI*2,
        scale: 20,
        speed: 2,
        drag: 0.8,
        lifespan: 150,
        color: color,
        fadeTime: 80
      });
    }

    this.manager.sounds.slam.play();
  }


  tick() {
    this.mesh.position.set(this.ship.position.x, 0, this.ship.position.y);

    let scale = this.mesh.scale.x;
    scale += this.radius / 6;
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
