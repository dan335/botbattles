import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader,
  Euler,
  Matrix4
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
    this.particleCreateDelay = 80;

    this.loadMesh();
    this.healthBars = new HealthBars(x, y, 0, 1, -45, manager.scene);
  }


  loadMesh() {
    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 15, 32 );
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


  setRotation(r) {
    this.rotation = r;

    if (this.mesh) {
      let rotateX = 0;
      let rotateZ = 0;
      if (this.engineLeft) rotateZ += Math.PI/10;
      if (this.engineRight) rotateZ -= Math.PI/10;
      if (this.engineUp) rotateX -= Math.PI/10;
      if (this.engineDown) rotateX += Math.PI/10;

      //this.mesh.rotation.set(0, r * -1, 0);   // why -1?

      let x = new Matrix4().makeRotationX(rotateX);
      let y = new Matrix4().makeRotationY(r * -1);
      let z = new Matrix4().makeRotationZ(rotateZ);

      x.multiply(z).multiply(y);

      this.mesh.matrix = x;
      this.mesh.setRotationFromMatrix(x);
    }
  }


  material() {
    return new MeshBasicMaterial( {
      map: this.manager.textures.shipColor
    });
  }


  tick() {
    super.tick();

    if (this.engineLeft) {
      if (this.engineLeftParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x + Math.random() * 10 - 5,
          y: this.position.y + Math.random() * 10 - 5,
          rotation: 0 + (Math.random() * 0.4 - 0.2),
          scale: Math.random() * 30 + 30,
          speed: 0.4,
          drag: 0.8,
          lifespan: 120,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineLeftParticleCreated = this.manager.tickStartTime;
      }
    }
    if (this.engineUp) {
      if (this.engineUpParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x + Math.random() * 10 - 5,
          y: this.position.y + Math.random() * 10 - 5,
          rotation: Math.PI/2 + (Math.random() * 0.4 - 0.2),
          scale: Math.random() * 30 + 30,
          speed: 0.4,
          drag: 0.8,
          lifespan: 120,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineUpParticleCreated = this.manager.tickStartTime;
      }
    }
    if (this.engineRight) {
      if (this.engineRightParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x + Math.random() * 10 - 5,
          y: this.position.y + Math.random() * 10 - 5,
          rotation: Math.PI + (Math.random() * 0.4 - 0.2),
          scale: Math.random() * 30 + 30,
          speed: 0.4,
          drag: 0.8,
          lifespan: 120,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineRightParticleCreated = this.manager.tickStartTime;
      }
    }
    if ( this.engineDown) {
      if (this.engineDownParticleCreated + this.particleCreateDelay < this.manager.tickStartTime) {
        new Particle(this.manager, {
          x: this.position.x + Math.random() * 10 - 5,
          y: this.position.y + Math.random() * 10 - 5,
          rotation: -Math.PI/2 + (Math.random() * 0.4 - 0.2),
          scale: Math.random() * 30 + 30,
          speed: 0.4,
          drag: 0.8,
          lifespan: 120,
          color: 0x555555,
          fadeTime: 100
        });
        this.engineDownParticleCreated = this.manager.tickStartTime;
      }
    }
  }


  destroy(killer) {
    this.shieldRechargeEnd();
    this.chargeEnd();
    this.stunnedEnd();

    super.destroy();
    const index = this.manager.ships.indexOf(this);
    if (index != -1) {
      this.manager.ships.splice(index, 1);
    }
    if (killer) {
      this.manager.ui.addToLog(killer + ' destroyed ' + this.name + '\'s bot.');
    } else {
      this.manager.ui.addToLog(this.name + '\'s bot was destroyed.');
    }
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


  chargeStart() {
    this.chargeSoundId = this.manager.sounds.charging.play();
  }


  chargeEnd() {
    if (this.chargeSoundId) {
      this.manager.sounds.charging.stop(this.chargeSoundId);
      this.chargeSoundId = null;
    }
  }

  shieldRechargeStart() {
    this.shieldRechargeSoundId = this.manager.sounds.shieldRecharge.play();
  }

  shieldRechargeEnd() {
    if (this.shieldRechargeSoundId) {
      this.manager.sounds.shieldRecharge.stop(this.shieldRechargeSoundId);
      this.shieldRechargeSoundId = null;
    }
  }


  stunnedStart() {
    this.stunnedSoundId = this.manager.sounds.stunned.play();
  }


  stunnedEnd() {
    if (this.stunnedSoundId) {
      this.manager.sounds.stunned.stop(this.stunnedSoundId);
      this.stunnedSoundId =  null;
    }
  }
}
