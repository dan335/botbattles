import Particle from '../fx/Particle.js';
import Obj from '../Obj.js';


export default class DashEffect extends Obj {
  constructor(manager, ship) {
    super(manager, ship.position.x, ship.position.y, ship.rotation, ship.radius, Math.random());
    this.ship = ship;
    manager.sounds.boost.play();

    setTimeout(() => {
      this.destroy();
    }, 500);
  }


  tick() {
    super.tick();

    for (let i = 0; i < 2; i++) {
      new Particle(this.manager, {
        x: this.ship.position.x + Math.random() * 20 - 10,
        y: this.ship.position.y + Math.random() * 20 - 10,
        rotation: this.ship.rotation,
        scale: Math.random() * 15 + 15,
        speed: 0,
        drag: 0,
        lifespan: 200,
        color: 0x666666,
        fadeTime: 180
      });
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
