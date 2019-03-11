import Bucket from './Bucket.js';
import {
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Mesh
} from 'three';

export default class BucketBlasterBullets extends Bucket {
  constructor(manager, numObjects) {
    super(manager, numObjects);
  }

  createObject() {
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      alphaMap: this.manager.textures.blasterBulletAlpha,
      transparent: true,
      alphaTest: 0.1
    });
    let mesh = new Mesh( this.geometry(), material );
    mesh.visible = false;
    this.manager.scene.add( mesh );

    return mesh;
  }
}
