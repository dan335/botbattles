import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';
import HealthBars from './HealthBars.js';



export default class Ship extends Obj {
  constructor(manager, x, y, rotation, radius, id, name) {
    super(manager, x, y, rotation, radius, id)

    this.name = name;
    this.manager.ui.addToLog(name + ' joined the game.');
    this.health = 100;
    this.shield = 100;

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
  }


  setPosition(x, y) {
    super.setPosition(x, y);
    this.healthBars.updatePosition(x, y);
  }


  material() {
    return new MeshBasicMaterial( {
      map: new TextureLoader().load( '/static/textures/shipColor.jpg' ),
      alphaMap: new TextureLoader().load( '/static/textures/shipInvisibleAlpha.jpg' ),
      transparent: false
    });
  }


  tick() {
    super.tick();
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
    this.mesh.visible = false;
    this.healthBars.goInvisible();
  }


  goVisible() {
    this.mesh.visible = true;
    this.healthBars.goVisible();
  }
}
