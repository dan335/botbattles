import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';
import HealthBars from './HealthBars.js';
const _s = require('../lib/settings.js');
import Particle from './fx/Particle.js';



export default class Ship extends Obj {
  constructor(manager, x, y, rotation, radius, id, name) {
    super(manager, x, y, rotation, radius, id)

    this.name = name;
    this.manager.ui.addToLog(name + ' joined the game.');
    this.health = _s.maxHealth;
    this.shield = _s.maxShield;

    this.engineDown = false;
    this.engineUp = false;
    this.engineLeft = false;
    this.engineRight = false;
    this.engineDownParticleCreated = 0;
    this.engineUpParticleCreated = 0;
    this.engineLeftParticleCreated = 0;
    this.engineRightParticleCreated = 0;
    this.particleCreateDelay = 60;

    this.loadMesh();
    this.healthBars = new HealthBars(x, y, 0, 1, -45, manager.scene);
  }


  loadMesh() {
    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 1, 32 );
    this.material = this.material();
    this.mesh = new Mesh( geometry, this.material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }


  updateAttributes(json) {
    super.updateAttributes(json);
    const h = Number(json.health);
    const s = Number(json.shield);

    if (h != this.health || s != this.shield) {
      this.health = h;
      this.shield = s;
      this.healthBars.updateHealth(h);
      this.healthBars.updateShields(s);
    }

    this.engineDown = json.engineDown;
    this.engineUp = json.engineUp;
    this.engineLeft = json.engineLeft;
    this.engineRight = json.engineRight;
  }


  setPosition(x, y) {
    super.setPosition(x, y);
    this.healthBars.updatePosition(x, y);
  }


  material() {
    return new MeshBasicMaterial( {
      map: new TextureLoader().load( '/static/textures/shipColor.jpg' )
    });
  }


  tick() {
    super.tick();

    if (this.engineLeft) {
      if (this.engineLeftParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x,
          y: this.position.y,
          rotation: 0 + (Math.random() * 0.4 - 0.2),
          scale: 20,
          speed: 0.5,
          drag: 0.8,
          lifespan: 150,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineLeftParticleCreated = this.manager.tickStartTime;
      }
    }
    if (this.engineUp) {
      if (this.engineUpParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x,
          y: this.position.y,
          rotation: Math.PI/2 + (Math.random() * 0.4 - 0.2),
          scale: 20,
          speed: 0.5,
          drag: 0.8,
          lifespan: 150,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineUpParticleCreated = this.manager.tickStartTime;
      }
    }
    if (this.engineRight) {
      if (this.engineRightParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x,
          y: this.position.y,
          rotation: Math.PI + (Math.random() * 0.4 - 0.2),
          scale: 20,
          speed: 0.5,
          drag: 0.8,
          lifespan: 150,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineRightParticleCreated = this.manager.tickStartTime;
      }
    }
    if ( this.engineDown) {
      if (this.engineDownParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x,
          y: this.position.y,
          rotation: -Math.PI/2 + (Math.random() * 0.4 - 0.2),
          scale: 20,
          speed: 0.5,
          drag: 0.8,
          lifespan: 150,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineDownParticleCreated = this.manager.tickStartTime;
      }
    }
  }


  destroy() {
    super.destroy();
    const index = this.manager.ships.indexOf(this);
    if (index != -1) {
      this.manager.ships.splice(index, 1);
    }
    this.manager.ui.addToLog(this.name + ' was destroyed.');
    this.healthBars.destroy();
  }


  goInvisible() {
    this.material.visible = false;
    this.healthBars.goInvisible();
  }


  goVisible() {
    this.material.visible = true;
    this.healthBars.goVisible();
  }
}
