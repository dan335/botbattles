import Obj from '../Obj.js';
import BlasterBullet from './BlasterBullet.js';
import Particle from '../fx/Particle.js';


export default class PlayerSeekingMissle extends BlasterBullet {
  constructor(manager, x, y, rotation, radius, id, color) {
    super(manager, x, y, rotation, radius, id, color);
    this.color = color;
     this.manager.sounds.blaster.play();
  }


  tick() {
    super.tick();

    new Particle(this.manager, {
      x: this.position.x,
      y: this.position.y,
      rotation: 0,
      scale: Math.random() * 15 + 10,
      speed: 0,
      drag: 0,
      lifespan: 100,
      color: this.color,
      fadeTime: 100
    });
  }
}
