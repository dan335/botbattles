import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';
import ProgressBar from '../ProgressBar.js';



export default class TurretObject extends Obj {
  constructor(manager, x, y, rotation, radius, id, health) {
    super(manager, x, y, rotation, radius, id);
    this.health = health;
    this.maxHealth = health;

    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 0.1, 12 );
    var material = new MeshBasicMaterial( {color: 0xffbb44} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), this.rotation * -1);
    this.manager.scene.add(this.mesh);

    this.offsetX = 0;
    this.offsetY = 0;
    this.offsetZ = -35;

    this.healthBar = new ProgressBar(this.maxHealth, this.maxHealth, 50, 10, manager.scene, x+this.offsetX, this.offsetY, y+this.offsetZ, 0x111111, 0x75b535);
  }


  updateAttributes(json) {
    super.updateAttributes(json);
    this.health = Number(json.health);
    this.healthBar.updateValue(this.health);
  }


  setPosition(x, y) {
    super.setPosition(x, y);
    this.healthBar.updatePosition(x+this.offsetX, y+this.offsetZ);
  }


  destroy() {
    this.healthBar.destroy();
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
