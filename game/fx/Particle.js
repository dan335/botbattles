import {
  MeshBasicMaterial,
  Sprite,
  Color
} from 'three';


export default class Particle {

  constructor(manager, options) {
    this.manager = manager;
    this.position = {x:options.x, y:options.y};
    this.rotation = options.rotation || 0;

    if (options.speed == null || options.speed == undefined) {
      options.speed = 0.5;
    }

    this.velocity = {
      x: Math.cos(this.rotation) * options.speed,
      y: Math.sin(this.rotation) * options.speed
    };
    this.drag = options.drag || 1; // 1 = no drag, lower = more drag
    this.scale = options.scale || 5;
    this.lifespan = options.lifespan || 100;
    this.createdAt = performance.now();
    this.opacity = options.opacity || 1;
    this.fadeTime = Math.min(this.lifespan, options.fadeTime || 50);

    this.sprite = this.manager.particleBucket.getObject();

    this.sprite.material.color = new Color(parseInt(options.color) || 0xaaaaaa);
    this.sprite.material.opacity = this.opacity;

    this.sprite.scale.set(options.scale, options.scale, options.scale);
    this.sprite.position.set(options.x, -20, options.y);
    this.sprite.rotation.set(-Math.PI/2, 0, this.rotation * -1);

    this.manager.particles.push(this);
  }


  tick(now) {
    if (this.createdAt + this.lifespan <= this.manager.tickStartTime) {
      this.destroy();
      return;
    }

    this.velocity.x = this.velocity.x * this.drag;
    this.velocity.y = this.velocity.y * this.drag;
    this.position.x += this.velocity.x * this.manager.deltaTime;
    this.position.y += this.velocity.y * this.manager.deltaTime;
    this.sprite.position.set(this.position.x, -20, this.position.y);

    if (this.createdAt + this.lifespan - this.fadeTime < this.manager.tickStartTime) {
      this.sprite.material.opacity = Math.max(0, 1 - ((this.manager.tickStartTime - (this.createdAt + this.lifespan - this.fadeTime)) / this.fadeTime));
    }
  }


  destroy() {
    const index = this.manager.particles.indexOf(this);
    if (index != -1) {
      this.manager.particles.splice(index, 1);
    }

    if (this.sprite) {
      this.manager.particleBucket.returnObject(this.sprite);
      this.sprite = undefined;
    }
  }

}
