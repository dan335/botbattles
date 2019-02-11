import ProgressBar from './ProgressBar.js';

export default class HealthBars {
  constructor(x, z, offsetX, offsetY, offsetZ, scene) {
    this.healthBarOffsetZ = -12;
    this.healthBar = new ProgressBar(100, 100, 50, 10, scene, x+offsetX, offsetY, z+offsetZ, 0x111111, 0x75b535);
    this.shieldBar = new ProgressBar(100, 100, 50, 10, scene, x+offsetX, offsetY, z+offsetZ+this.healthBarOffsetZ, 0x111111, 0x356ab5);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.offsetZ = offsetZ;
  }

  updateHealth(value) {
    this.healthBar.updateValue(value);
  }

  updateShields(value) {
    this.shieldBar.updateValue(value);
  }

  updatePosition(x, z) {
    this.healthBar.updatePosition(x + this.offsetX, z + this.offsetZ);
    this.shieldBar.updatePosition(x + this.offsetX, z + this.offsetZ + this.healthBarOffsetZ);
  }

  destroy() {
    this.healthBar.destroy();
    this.shieldBar.destroy();
  }
}