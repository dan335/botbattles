import Particle from '../fx/Particle.js';


export default class Blast {
  constructor(manager, x, y, rotation, color) {

    for (let i = 0; i < 5; i++) {
      new Particle(manager, {
        x: x,
        y: y,
        rotation: rotation + (Math.random() * 0.5 - 0.25),
        scale: 30,
        speed: Math.random() * 2,
        drag: 0.8,
        lifespan: 200,
        color: parseInt(color),
        fadeTime: 150
      });

      manager.sounds.cannon.play();
    }

  }
}
