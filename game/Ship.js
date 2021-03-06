import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader,
  Euler,
  Matrix4,
  PlaneBufferGeometry
} from 'three';
import HealthBars from './HealthBars.js';
const _s = require('../lib/settings.js');
import Particle from './fx/Particle.js';
import ShipName from './ShipName.js';



export default class Ship extends Obj {
  constructor(manager, x, y, rotation, radius, id, name) {
    super(manager, x, y, rotation, radius, id)

    this.name = name;
    this.manager.ui.addToLog(name + ' joined the game.');
    this.health = _s.maxHealth;
    this.shield = _s.maxShield;
    this.maxShield = _s.maxShield;

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
    this.shipName = new ShipName(manager, this);

    this.abilityObjects = [];
  }


  updateUiBars() {
  }


  updateMaxShield(newMax) {
    const increasedBy = newMax - this.maxShield;
    this.maxShield = newMax;
    this.healthBars.updateMaxShields(newMax);
    this.updateUiBars();
    this.manager.ui.addToLog(this.name + " got a kill.  Max shield increased by " + increasedBy + '.');
  }


  loadMesh() {
    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 15, 32 );
    this.material = this.material();
    this.mesh = new Mesh( geometry, this.material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);

    geometry = this.manager.planeBufferGeometry.clone();
    var material = new MeshBasicMaterial( {
      map: this.manager.textures.shipGunColor,
      transparent: true
    });
    this.gunMesh = new Mesh(geometry, material);
    this.gunMesh.position.set(this.position.x, 20, this.position.y);
    this.gunMesh.rotation.set(-Math.PI/2, 0, 0);
    this.gunMesh.scale.set(this.radius*2.5, this.radius*2.5, this.radius*2.5);
    this.manager.scene.add(this.gunMesh);
  }


  updateAttributes(json) {
    super.updateAttributes(json);
    const h = Number(json.health);
    const s = Number(json.shield);

    if (h != this.health) {
      this.health = h;
      this.healthBars.updateHealth(h);
    }

    if (s != this.shield) {
      this.shield = s;
      this.healthBars.updateShields(s);
    }

    this.engineDown = json.engineDown;
    this.engineUp = json.engineUp;
    this.engineLeft = json.engineLeft;
    this.engineRight = json.engineRight;
  }


  setPosition(x, y) {
    super.setPosition(x, y);
    this.gunMesh.position.set(x, 20, y);
    this.healthBars.updatePosition(x, y);
    this.shipName.updatePosition();
  }


  setRotation(r) {
    this.rotation = r;
    const gunOffset = 5;

    if (this.mesh) {
      let rotateX = 0;
      let rotateZ = 0;
      let transGunX = 0;
      let transGunZ = 0;
      if (this.engineLeft) {
        rotateZ += Math.PI/10;
        transGunX -= gunOffset;
      }
      if (this.engineRight) {
        rotateZ -= Math.PI/10;
        transGunX += gunOffset;
      }
      if (this.engineUp) {
        rotateX -= Math.PI/10;
        transGunZ -= gunOffset;
      }
      if (this.engineDown) {
        rotateX += Math.PI/10;
        transGunZ += gunOffset;
      }

      //this.mesh.rotation.set(0, r * -1, 0);   // why -1?

      let x = new Matrix4().makeRotationX(rotateX);
      //let y = new Matrix4().makeRotationY(r * -1);
      let z = new Matrix4().makeRotationZ(rotateZ);

      x.multiply(z);//.multiply(y);

      this.mesh.matrix = x;
      this.mesh.setRotationFromMatrix(x);

      this.gunMesh.position.set(this.mesh.position.x + transGunX, 20, this.mesh.position.z + transGunZ);
      this.gunMesh.rotation.set(-Math.PI/2, 0, r * -1);
    }
  }


  material() {
    return new MeshBasicMaterial( {
      map: this.manager.textures.shipColor
    });
  }


  tick(now) {
    super.tick(now);

    this.abilityObjects.forEach((obj) => {
      obj.tick(now);
    });

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
    this.shipName.destroy();

    if (this.gunMesh) {
      this.manager.scene.remove(this.gunMesh);
      this.gunMesh.geometry.dispose();
      this.gunMesh.material.dispose();
      this.gunMesh = undefined;
    }

    this.abilityObjects.forEach((obj) => {
      obj.destroy();
    });

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
    this.chargeEnd();
    this.chargeSoundId = this.manager.sounds.charging.play();
  }


  chargeEnd() {
    if (this.chargeSoundId) {
      this.manager.sounds.charging.stop(this.chargeSoundId);
      this.chargeSoundId = null;
    }
  }

  shieldRechargeStart() {
    this.shieldRechargeEnd();
    this.shieldRechargeSoundId = this.manager.sounds.shieldRecharge.play();
  }

  shieldRechargeEnd() {
    if (this.shieldRechargeSoundId) {
      this.manager.sounds.shieldRecharge.stop(this.shieldRechargeSoundId);
      this.shieldRechargeSoundId = null;
    }
  }


  stunnedStart() {
    this.stunnedEnd();
    this.stunnedSoundId = this.manager.sounds.stunned.play();
  }


  stunnedEnd() {
    if (this.stunnedSoundId) {
      this.manager.sounds.stunned.stop(this.stunnedSoundId);
      this.stunnedSoundId =  null;
    }
  }
}
