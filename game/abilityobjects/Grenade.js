import Obj from '../Obj.js';
import {
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';



export default class Grenade extends Obj {
  constructor(manager, x, y, rotation, radius, id, color) {
    super(manager, x, y, rotation, radius, id);
    this.color = color;
    this.createMesh();
  }


  createMesh() {
    var geometry = new PlaneBufferGeometry( this.radius * 2, this.radius * 2 );
    var material = new MeshBasicMaterial( {color: this.color} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, -0.5, this.position.y);
    this.mesh.rotation.set(-Math.PI/2, 0, this.rotation * -1);
    this.manager.scene.add(this.mesh);
  }


  setRotation(r) {
    this.rotation = r;

    if (this.mesh) {
      this.mesh.rotation.set(-Math.PI/2, 0, this.rotation * -1);   // why -1?
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
