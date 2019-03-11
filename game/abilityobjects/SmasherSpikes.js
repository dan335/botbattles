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


    var material = new MeshBasicMaterial( {color: 0xbbbbbb} );
    this.mesh = new Mesh( this.manager.smasherSpikesGeometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.mesh.rotation.set(Math.PI/2, 0, this.ship.rotation);
    this.mesh.scale.set(radius, radius, radius); 
    this.manager.scene.add(this.mesh);

    this.manager.sounds.smasher.play();
  }


  tick(now) {
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
