import Obj from './Obj.js';
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';



export default class BlasterBullet extends Obj {
  constructor(manager, x, y, rotation, id) {
    super(manager, x, y, rotation, id);

    var geometry = new BoxBufferGeometry( 15, 0.1, 15 );
    var material = new MeshBasicMaterial( {color: 0xff4444} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, -0.5, this.position.y);
    this.mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), this.rotation * -1);
    this.manager.scene.add(this.mesh);
  }


  destroy() {
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
