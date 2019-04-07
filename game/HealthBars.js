import ProgressBar from './ProgressBar.js';
const _s = require('../lib/settings.js');


export default class HealthBars {
  constructor(x, z, offsetX, offsetY, offsetZ, scene) {
    this.healthBarOffsetZ = -12;
    this.healthBar = new ProgressBar(_s.maxHealth, _s.maxHealth, 50, 10, scene, x+offsetX, offsetY, z+offsetZ, 0x111111, 0x75b535);
    this.shieldBar = new ProgressBar(_s.maxShield, _s.maxShield, 50, 10, scene, x+offsetX, offsetY, z+offsetZ+this.healthBarOffsetZ, 0x111111, 0x356ab5);
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

  updateMaxShields(value) {
    this.shieldBar.updateMax(value);
  }

  updatePosition(x, z) {
    this.healthBar.updatePosition(x + this.offsetX, z + this.offsetZ);
    this.shieldBar.updatePosition(x + this.offsetX, z + this.offsetZ + this.healthBarOffsetZ);
  }

  destroy() {
    this.healthBar.destroy();
    this.shieldBar.destroy();
  }

  goInvisible() {
    this.healthBar.goInvisible();
    this.shieldBar.goInvisible();
  }

  goVisible() {
    this.healthBar.goVisible();
    this.shieldBar.goVisible();
  }
}
