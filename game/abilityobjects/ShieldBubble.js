import Obj from '../Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader
} from 'three';



export default class ShieldBubble extends Obj {
  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);

    var geometry = new CylinderBufferGeometry( this.radius, this.radius, 0.1, 32 );
    var material = new MeshBasicMaterial( {color: 0x356ab5} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);
  }
}
