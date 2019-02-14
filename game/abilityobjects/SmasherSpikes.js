import Obj from '../Obj.js';
import {
  ShapeBufferGeometry,
  ExtrudeBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  TextureLoader,
  Shape
} from 'three';



export default class SmasherSpikes extends Obj {
  constructor(manager, radius, id, ship) {
    super(manager, ship.position.x, ship.position.y, ship.rotation, radius, id);
    this.ship = ship;

    var shape = new Shape();
    var num = 20;
    var angle = Math.PI * 2 / num;
    var inside = false
    var a = angle * 0;
    var first = true;

    for (let i = 0; i < num; i++) {
      a = angle * i;
      if (inside) {
        shape.lineTo(
          Math.cos(a) * radius * 0.5,
          Math.sin(a) * radius * 0.5
        );
      } else {
        if (first) {
          shape.moveTo(
            Math.cos(a) * radius,
            Math.sin(a) * radius
          );
        } else {
          shape.lineTo(
            Math.cos(a) * radius,
            Math.sin(a) * radius
          );
        }
      }
      inside = !inside;
    }

    var extrudeSettings = {
    	steps: 1,
    	depth: 0.1,
    	bevelEnabled: false
    };

    var geometry = new ExtrudeBufferGeometry( shape, extrudeSettings );
    var material = new MeshBasicMaterial( {color: 0xbbbbbb} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.mesh.rotation.set(Math.PI/2, 0, this.ship.rotation);
    this.manager.scene.add(this.mesh);
  }


  tick() {
    this.mesh.position.set(this.ship.position.x, 0, this.ship.position.y);
    this.mesh.rotation.set(Math.PI/2, 0, this.ship.rotation);
  }


  destroy() {
    super.destroy();
    const index = this.manager.abilityObjects.indexOf(this);
    if (index != -1) {
      this.manager.abilityObjects.splice(index, 1);
    }
  }
}
