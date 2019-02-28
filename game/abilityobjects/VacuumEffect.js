import Particle from '../fx/Particle.js';
import Obj from '../Obj.js';
import {Howler} from 'howler';

const color = 0x356ab5;

export default class VacuumEffect extends Obj {
  constructor(manager, radius, id, ship) {
    super(manager, ship.position.x, ship.position.y, ship.rotation, radius, id);
    this.ship = ship;
    this.particles = [];
    this.soundId = this.manager.sounds.vacuum.play();
  }


  tick() {

    for (let i = 0; i < 5; i++) {
      const rotation = Math.random() * Math.PI*2;

      new Particle(this.manager, {
        x: this.ship.position.x + Math.cos(rotation) * this.radius,
        y: this.ship.position.y + Math.sin(rotation) * this.radius,
        rotation: rotation + Math.PI,
        scale: 10,
        speed: 2,
        drag: 0.8,
        lifespan: 100,
        color: color,
        fadeTime: 100
      });
    }
  }


  destroy() {
    this.manager.sounds.vacuum.stop(this.soundId);

    this.particles.forEach((particle) => {
      particle.destroy();
    })

    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
