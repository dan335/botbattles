import Obj from '../Obj.js';
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';
import VacuumEffect from './VacuumEffect.js';
import Explosion from './Explosion.js';



export default class VortexGrenade extends Obj {
  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);

    setTimeout(() => {
      var geometry = new BoxBufferGeometry( this.radius * 2, 0.1, this.radius * 2 );
      var material = new MeshBasicMaterial( {color: 0xffbb44} );
      this.mesh = new Mesh( geometry, material );
      this.mesh.position.set(this.position.x, -0.5, this.position.y);
      this.mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), this.rotation * -1);
      this.manager.scene.add(this.mesh);

      this.soundId = manager.sounds.cannon.play();
    }, this.manager.renderDelay);
  }


  destroy(radius, x, y) {

    new Explosion(this.manager, x, y, 0, 50, Math.random(), 0xffbb44);

    this.vacuumEffect = new VacuumEffect(this.manager, radius, Math.random(), null, x, y);

    this.manager.abilityObjects.push(this.vacuumEffect);

    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }

    setTimeout(() => {
      this.vacuumEffect.destroy();

    }, 300);
  }
}
