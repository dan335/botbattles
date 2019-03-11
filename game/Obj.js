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
    const interpolationMs = Math.max(100, this.manager.ping / 2 + 50);
    const now = Date.now();
    const playbackServerTime = now - interpolationMs - this.manager.serverTimeOffset;
    let to = null;
    let from = null;
    let lastNeededIndex;
    let found = false;

    for (let n = 0; n < this.syncPositions.length; n++) {
      if (!found) {
        if (playbackServerTime - this.syncPositions[n].t < 400) {  // don't use old data
          if (this.syncPositions[n].t < playbackServerTime) {
            if (n == 0) {
              this.setPosition(this.syncPositions[0].x, this.syncPositions[0].y);
              this.setRotation(this.syncPositions[0].r);
              return;
            } else {
              from = this.syncPositions[n];
              to = this.syncPositions[n-1];
              lastNeededIndex = n;
              found = true;
            }
          }
        }
      }
    }

    if (!to || !from) {
      return;
    }


    // // find syncPositions surrounding playbackServerTime
    // for (let n = 1; n < this.syncPositions.length; n++) {
    //   if (this.syncPositions[n].t < playbackServerTime && this.syncPositions[n-1].t >= playbackServerTime) {
    //     from = this.syncPositions[n];
    //     to = this.syncPositions[n-1];
    //     lastNeededIndex = n;
    //   }
    // }
    //
    // if (!to || !from) {
    //   if (this.syncPositions.length >= 2) {
    //     if (playbackServerTime - this.syncPositions[0].t < 400) {
    //       from = this.syncPositions[1];
    //       to = this.syncPositions[0];
    //     } else {
    //       this.syncPositions = [];
    //       return;
    //     }
    //   } else if (this.syncPositions.length == 1) {
    //     if (playbackServerTime - this.syncPositions[0].t < 400) {
    //       this.setPosition(this.syncPositions[0].x, this.syncPositions[0].y);
    //       this.setRotation(this.syncPositions[0].r);
    //     } else {
    //       this.syncPositions = [];
    //     }
    //     return;
    //   } else {
    //     return;
    //   }
    // };

    const percentage = (playbackServerTime - from.t) / (to.t - from.t);

    this.setPosition(
      from.x + percentage * (to.x - from.x),
      from.y + percentage * (to.y - from.y)
    );

    // rotation
    var diff = Math.atan2(Math.sin(to.r-from.r), Math.cos(to.r-from.r));
    this.setRotation(from.r + diff * percentage);

    // how much delay should be used for things like spawning explosions
    this.manager.renderDelays.unshift(now - from.recieved - (to.recieved - from.recieved) * percentage);
    if (this.manager.renderDelays.length > 10) {
      this.manager.renderDelays.length = 10;
    }

    // get rid of un-needed sync positions
    if (lastNeededIndex) {
      this.syncPositions.length = lastNeededIndex + 1;
    }
  }


  updateAttributes(json) {
    const now = Date.now();

    // if syncPositions are old then erase them
    if (this.syncPositions.length && now - this.syncPositions[0].recieved > 400) {
      this.syncPositions = [];
    }

    this.syncPositions.unshift({
      x: Number(json.x),
      y: Number(json.y),
      t: Number(json.time),
      r: Number(json.rotation),
      recieved: now
    });

    if (Boolean(json.teleport)) {
      for (let i = 0; i < this.syncPositions.length; i++) {
        if (now - this.syncPositions[i].recieved <= this.manager.renderDelay()) {
          this.syncPositions[i].x = Number(json.x);
          this.syncPositions[i].y = Number(json.y);
          this.syncPositions[i].r = Number(json.rotation);
        }
      }
    }

    // this.syncPositions.sort(function(a, b) {
    //   return b.t - a.t;
    // });
  }
}
