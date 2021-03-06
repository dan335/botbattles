import Particle from '../fx/Particle.js';
import Obj from '../Obj.js';
import {Howler} from 'howler';

const color = 0x356ab5;

export default class VacuumEffect extends Obj {
  constructor(manager, radius, id, ship, x, y) {
    super(manager, ship ? ship.position.x : x, ship ? ship.position.y : y, 0, radius, id);
    this.ship = ship;
    if (this.ship) {
      this.ship.abilityObjects.push(this);
    } else {
      this.manager.abilityObjects.push(this);
    }

    this.particles = [];
    this.soundId = this.manager.sounds.vacuum.play();
  }


  tick(now) {

    for (let i = 0; i < 5; i++) {
      const rotation = Math.random() * Math.PI*2;

      const x = this.ship ? this.ship.position.x : this.position.x;
      const y = this.ship ? this.ship.position.y : this.position.y;

      new Particle(this.manager, {
        x: x + Math.cos(rotation) * this.radius,
        y: y + Math.sin(rotation) * this.radius,
        rotation: rotation + Math.PI,
        scale: Math.random() * 10 + 16,
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

    if (this.ship) {
      const index = this.ship.abilityObjects.indexOf(this);
      if (index != -1) {
        this.ship.abilityObjects.splice(index, 1);
      }
    } else {
      const index = this.manager.abilityObjects.indexOf(this);
      if (index != -1) {
        this.manager.abilityObjects.splice(index, 1);
      }
    }

  }
}
