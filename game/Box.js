import Obj from './Obj.js';
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';


export default class Box extends Obj {
  constructor(manager, x, y, id, scaleX, scaleY) {
    super(manager, x, y, 0, 0, id);
    this.scale = {x:scaleX, y:scaleY};

    var geometry = new BoxBufferGeometry( 1, 1, 1 );
    var material = new MeshBasicMaterial( {color: 0x595f67} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.mesh.scale.set(scaleX, 100, scaleY);
    this.manager.scene.add(this.mesh);
  }


  tick(now) {
    super.tick(now);
  }


  destroy() {
    super.destroy();
    const index = this.manager.boxes.indexOf(this);
    if (index != -1) {
      this.manager.boxes.splice(index, 1);
    }
  }


  updateAttributes(json) {
    super.updateAttributes(json);

    const scaleX = Number(json.scaleX);
    const scaleY = Number(json.scaleY);

    if (this.scale.x != scaleX || this.scale.y != scaleY) {
      this.scale.x = scaleX;
      this.scale.y = scaleY;

      if (this.mesh) {
        this.mesh.scale.set(scaleX, 1, scaleY);
      }
    }
  }
}
