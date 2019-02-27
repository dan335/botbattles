import {
  SpriteMaterial,
  Sprite,
} from 'three';


export default class Particle {

  constructor(manager, options) {
    this.manager = manager;
    this.position = {x:options.x, y:options.y};
    this.rotation = options.rotation || 0;
    this.velocity = {
      x: Math.cos(this.rotation) * (options.speed || 1),
      y: Math.sin(this.rotation) * (options.speed || 1)
    };
    this.drag = options.drag || 1; // 1 = no drag, lower = more drag
    this.scale = options.scale || 5;
    this.lifespan = options.lifespan || 100;
    this.createdAt = performance.now();
    this.opacity = options.opacity || 1;
    this.fadeTime = Math.min(this.lifespan, options.fadeTime || 50);

    //var spriteMap = new THREE.TextureLoader().load( "sprite.png" );
    this.material = new SpriteMaterial( { color:options.color || 0xaaaaaa, transparent:true, opacity:this.opacity,  map:this.manager.textures.particleAlpha } );
    this.sprite = new Sprite( this.material );
    this.sprite.scale.set(options.scale, options.scale, options.scale);
    this.sprite.position.set(options.x, -20, options.y);
    this.sprite.rotation.set(0, this.rotation * -1, 0);
    this.manager.scene.add( this.sprite );

    this.manager.particles.push(this);
  }


  tick() {
    if (this.createdAt + this.lifespan < this.manager.tickStartTime) {
      this.destroy();
      return;
    }

    this.velocity.x = this.velocity.x * this.drag;
    this.velocity.y = this.velocity.y * this.drag;
    this.position.x += this.velocity.x * this.manager.deltaTime;
    this.position.y += this.velocity.y * this.manager.deltaTime;
    this.sprite.position.set(this.position.x, -20, this.position.y);

    if (this.createdAt + this.lifespan - this.fadeTime < this.manager.tickStartTime) {
      this.material.opacity = 1 - ((this.manager.tickStartTime - (this.createdAt + this.lifespan - this.fadeTime)) / this.fadeTime);
    }
  }


  destroy() {
    const index = this.manager.particles.indexOf(this);
    if (index != -1) {
      this.manager.particles.splice(index, 1);
    }

    if (this.sprite) {
      this.manager.scene.remove(this.sprite);
      this.sprite.geometry.dispose();
      this.sprite.material.dispose();
      this.sprite = undefined;
    }
  }

}
