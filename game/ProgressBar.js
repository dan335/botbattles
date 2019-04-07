import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3
} from 'three';

export default class ProgressBar {
  constructor(max, initial, width, height, scene, x, y, z, bgColor, color) {
    this.max = max;
    this.value = initial;
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.z = z;
    this.width = width;
    this.height = height;

    var geometry = new BoxBufferGeometry( 1, 1, 1 );
    this.bgMaterial = new MeshBasicMaterial( {color: bgColor} );
    this.bg = new Mesh( geometry, this.bgMaterial );
    this.bg.position.set(x, y, z);
    this.bg.scale.set(width, 1, height);
    this.scene.add(this.bg);

    var geometry = new BoxBufferGeometry( 1, 1, 1 );
    this.barMaterial = new MeshBasicMaterial( {color: color} );
    this.bar = new Mesh( geometry, this.barMaterial );
    this.bar.position.set(x, y, z);
    this.bar.scale.set(width, 1, height);
    this.scene.add(this.bar);
  }

  updateMax(value) {
    this.max = value;
    this.updateValue(this.value);
  }

  updateValue(value) {
    const width = value / this.max * this.width;
    this.bar.scale.set(width || 0.0001, 1, this.height);  // three.js bug, don't se scale to 0
  }

  updatePosition(x, z) {
    this.x = x;
    this.z = z;
    this.bg.position.set(x, this.y, z);
    this.bar.position.set(x, this.y, z);
  }

  destroy() {
    if (this.bg) {
      this.scene.remove(this.bg);
      if (this.bg.geometry) {
        this.bg.geometry.dispose();
        this.bg.material.dispose();
      }
      this.bg = undefined;
    }

    if (this.bar) {
      this.scene.remove(this.bar);
      if (this.bar.geometry) {
        this.bar.geometry.dispose();
        this.bar.material.dispose();
      }
      this.bar = undefined;
    }
  }

  goInvisible() {
    this.bgMaterial.visible = false;
    this.barMaterial.visible = false;
  }

  goVisible() {
    this.bgMaterial.visible = true;
    this.barMaterial.visible = true;
  }
}
