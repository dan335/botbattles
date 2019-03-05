import Obj from '../Obj.js';
import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Color
} from 'three';
import Particle from '../fx/Particle.js';



export default class BlasterBullet extends Obj {
  constructor(manager, x, y, rotation, radius, id, color, playSound) {
    super(manager, x, y, rotation, radius, id);

    setTimeout(() => {
      var geometry = new PlaneBufferGeometry( this.radius*6, this.radius*6 );
      var material = new MeshBasicMaterial({
        color: new Color(parseInt(color)),
        alphaMap: this.manager.textures.blasterBulletAlpha,
        transparent: true,
        alphaTest: 0.1
      });
      this.mesh = new Mesh( geometry, material );
      this.mesh.position.set(this.position.x, -0.5, this.position.y);
      this.mesh.rotation.set(-Math.PI/2, 0, this.rotation * -1);
      this.manager.scene.add(this.mesh);

      new Particle(this.manager, {
        x: this.position.x,
        y: this.position.y,
        rotation: this.rotation,
        scale: 80,
        speed: 0.25,
        drag: 0,
        lifespan: 100,
        color: parseInt(color),
        fadeTime: 80
      });

      if (playSound) {
        this.soundId = this.manager.sounds.blaster.play();
        this.manager.sounds.blaster.volume(Math.random() * 0.4 + 0.1, this.soundId);
      }
    }, this.manager.renderDelay);
  }


  setRotation(r) {
    this.rotation = r;

    if (this.mesh) {
      this.mesh.rotation.set(-Math.PI/2, 0, r * -1);   // why -1?
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
