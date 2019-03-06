import Bucket from './Bucket.js';
import {
  MeshBasicMaterial,
  Sprite,
  Color
} from 'three';

export default class BucketParticles extends Bucket {
  constructor(manager, numObjects) {
    super(manager, numObjects);
  }


  createObject() {
    const spriteMaterial = new MeshBasicMaterial({
      color: new Color(0xaaaaaa),
      transparent: true,
      opacity: 0.1,
      alphaMap: this.manager.textures.particleAlpha,
      alphaTest: 0.1
    });

    const sprite = new Sprite( spriteMaterial );
    sprite.scale.set(1, 1, 1);
    sprite.position.set(10000, 0, 10000);
    sprite.rotation.set(-Math.PI/2, 0, 0);
    sprite.visible = false;
    this.manager.scene.add( sprite );
    return sprite;
  }
}
