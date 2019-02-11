import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';

export default class Ship extends Obj {
  constructor(manager, x, y, rotation, id, name) {
    super(manager, x, y, rotation, id)

    this.name = name;
    this.manager.ui.addToLog(name + ' joined the game.');

    this.loadMesh();
  }


  loadMesh() {
    var geometry = new CylinderBufferGeometry( 25, 25, 1, 32 );
    var material = this.material();
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }


  material() {
    return new MeshBasicMaterial( { map: new TextureLoader().load( '/static/textures/shipColor.jpg' ) } );
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
    this.manager.ui.addToLog(this.name + ' left.');
  }
}
