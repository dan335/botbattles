import Obj from '../Obj.js';
import BlasterBullet from './BlasterBullet.js';



export default class StunGunBullet extends BlasterBullet {
  constructor(manager, x, y, rotation, radius, id, color) {
    super(manager, x, y, rotation, radius, id, color);

    this.manager.sounds.stunGun.play();
  }
}
