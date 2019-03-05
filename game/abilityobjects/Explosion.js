import Obj from '../Obj.js';
import {
  PlaneBufferGeometry,
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
    var geometry = new PlaneBufferGeometry(1, 1);
    var material = new MeshBasicMaterial({
      color: parseInt(color),
      alphaMap: this.manager.textures.particleAlpha,
      transparent: true,
      alphaTest: 0.1
    });
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.mesh.rotation.set(-Math.PI/2, 0, 0);
    this.manager.scene.add(this.mesh);

    if (this.radius > 30) {
      for (let i = 0; i < 10; i++) {
        new Particle(this.manager, {
          x: this.position.x,
          y: this.position.y,
          rotation: Math.random() * Math.PI*2,
          scale: 40,
          speed: this.radius / 60,
          drag: 0.8,
          lifespan: 200,
          color: parseInt(color),
          fadeTime: 150
        });
      }

      this.soundId = this.manager.sounds.explosionLarge.play();
      this.manager.sounds.explosionLarge.volume(Math.random() * 0.5 + 0.5, this.soundId);
    } else {
      this.soundId = this.manager.sounds.explosionSmall.play();
      this.manager.sounds.explosionSmall.volume(Math.random() * 0.4 + 0.2, this.soundId);
    }
  }

  setRotation(r) {
    this.rotation = r;

    if (this.mesh) {
      this.mesh.rotation.set(-Math.PI/2, 0, 0);   // why -1?
    }
  }


  tick() {
    let scale = this.mesh.scale.x;
    scale += this.radius * 6 / 5;
    if (scale <= this.radius * 6) { // * 6 is to account for texture and radius
      this.mesh.scale.set(scale, scale, scale);
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
