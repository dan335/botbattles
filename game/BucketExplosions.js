import Bucket from './Bucket.js';
import {
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Mesh
} from 'three';

export default class BucketExplosions extends Bucket {
  constructor(manager, numObjects) {
    super(manager, numObjects);
  }


  createObject() {
    var material = new MeshBasicMaterial({
      color: 0xffffff,
      alphaMap: this.manager.textures.particleAlpha,
      transparent: true,
      alphaTest: 0.1
    });
    let mesh = new Mesh( this.geometry(), material );
    mesh.rotation.set(-Math.PI/2, 0, 0);
    mesh.visible = false;
    this.manager.scene.add( mesh );

    return mesh;
  }
}
