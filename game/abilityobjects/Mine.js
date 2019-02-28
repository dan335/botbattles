import Grenade from './Grenade.js';

export default class Mine extends Grenade {
  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);

    this.manager.sounds.mineDropper.play();
  }
}
