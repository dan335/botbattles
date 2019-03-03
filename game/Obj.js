import {
  Vector3,
} from 'three';
import Base from './Base.js';

// Obj is a Base that smoothly syncs attributes

export default class Obj extends Base {

  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);
    this.syncPositions = [];
  }


  tick() {
    const interpolationMs = Math.max(50, this.manager.ping/2);
    const now = Date.now();
    const playbackServerTime = now - interpolationMs - this.manager.serverTimeOffset;
    let to = null;
    let from = null;
    let lastNeededIndex;

    for (let n = 1; n < this.syncPositions.length; n++) {
      if (this.syncPositions[n].t < playbackServerTime && this.syncPositions[n-1].t >= playbackServerTime) {
        from = this.syncPositions[n];
        to = this.syncPositions[n-1];
        lastNeededIndex = n;
      }
    }

    if (!to || !from) return;

    const percentage = (playbackServerTime - from.t) / (to.t - from.t);

    this.setPosition(
      from.x + percentage * (to.x - from.x),
      from.y + percentage * (to.y - from.y)
    );

    // rotation
    var diff = Math.atan2(Math.sin(to.r-from.r), Math.cos(to.r-from.r));
    this.setRotation(from.r + diff * percentage);

    // how much delay should be used for things like spawning explosions
    this.manager.renderDelay = now - from.recieved + (to.recieved - from.recieved) * percentage;

    // get rid of un-needed sync positions
    this.syncPositions.length = lastNeededIndex + 1;
  }


  updateAttributes(json) {
    this.syncPositions.unshift({
      x: Number(json.x),
      y: Number(json.y),
      t: Number(json.time),
      r: Number(json.rotation),
      recieved: Date.now()
    });

    if (Boolean(json.teleport)) {
      for (let i = 0; i < this.syncPositions.length; i++) {
        this.syncPositions[i].x = Number(json.x);
        this.syncPositions[i].y = Number(json.y);
      }
    }

    this.syncPositions.sort(function(a, b) {
      return b.t - a.t;
    });
  }
}
