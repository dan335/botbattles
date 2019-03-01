import Obj from './Obj.js';
import {
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  PlaneBufferGeometry
} from 'three';


export default class Obstacle extends Obj {
  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);

    var geometry = new CylinderBufferGeometry( radius, radius, 1, 32 );
    var material = new MeshBasicMaterial( {color: 0x6a6f73, map:this.manager.textures.pillarColor} );
    this.mesh = new Mesh( geometry, material );
    this.mesh.position.set(this.position.x, 0, this.position.y);
    this.manager.scene.add(this.mesh);

    var aoGeometry = new PlaneBufferGeometry( radius * 5, radius * 5, 1 );
    var aoMaterial = new MeshBasicMaterial({
      color: 0x000000,
      alphaMap: this.manager.textures.obstacleAoAlpha,
      transparent: true
    });
    this.aoMesh = new Mesh( aoGeometry, aoMaterial );
    this.aoMesh.position.set(this.position.x, -45, this.position.y);
    this.aoMesh.rotation.set(-Math.PI/2, 0, 0);
    this.manager.scene.add(this.aoMesh);
  }


  setPosition(x, y) {
    super.setPosition(x, y);

    this.aoMesh.position.set(x, -45, y);
  }


  destroy() {
    if (this.aoMesh) {
      this.manager.scene.remove(this.aoMesh);
      this.aoMesh.geometry.dispose();
      this.aoMesh.material.dispose();
      this.aoMesh = undefined;
    }

    super.destroy();
    const index = this.manager.obstacles.indexOf(this);
    if (index != -1) {
      this.manager.obstacles.splice(index, 1);
    }
  }
}
