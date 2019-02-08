import Ship from './Ship.js';


export default class Player extends Ship {
  constructor(manager, x, y, rotation, id) {
    super(manager, x, y, rotation, id);
  }
}
