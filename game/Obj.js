import {
  Vector3,
} from 'three';
import Base from './Base.js';

// Obj is a Base that smoothly syncs attributes

export default class Obj extends Base {

  constructor(manager, x, y, rotation, radius, id) {
    super(manager, x, y, rotation, radius, id);
    this.lastSyncPositions = [];
  }


  tick() {
    // if (this.lastSyncPositions.length) {
    //   this.setPosition(
    //     this.lastSyncPositions[0].x,
    //     this.lastSyncPositions[0].y,
    //   )
    //
    //   this.setRotation(this.lastSyncPositions[0].r)
    //
    //   this.lastSyncPositions.pop();
    // }


    // if (this.lastSyncPositions.length < 2) return;
    //
    // const now = Date.now();
    //
    // let sum = 0;
    // let count = 0;
    // let timeBetweenSyncs;
    // for (let n = 1; n < this.lastSyncPositions.length; n++) {
    //   sum += this.lastSyncPositions[n-1].recieved - this.lastSyncPositions[n].recieved;
    //   count++;
    // }
    // if (count) {
    //   timeBetweenSyncs = sum / count;
    // } else {
    //   return;
    // }
    //
    // const from = this.lastSyncPositions[1];
    // const to = this.lastSyncPositions[0];
    //
    // const percentage = Math.min(2, (now - from.recieved) / timeBetweenSyncs);
    //
    // this.setPosition(
    //   from.x + percentage * (to.x - from.x),
    //   from.y + percentage * (to.y - from.y)
    // );
    //
    // // rotation
    // var diff = Math.atan2(Math.sin(to.r-from.r), Math.cos(to.r-from.r));
    // this.setRotation(from.r + diff * Math.max(0, Math.min(percentage, 1)));
    //
    // this.manager.renderDelay = Math.min(100, now - to.recieved);
    //
    // if (this.lastSyncPositions.length > 6) {
    //   this.lastSyncPositions.pop();
    // }
  }


  updateAttributes(json) {
      this.setPosition(
        Number(json.x),
        Number(json.y)
      )

      this.setRotation(Number(json.rotation));


    // this.lastSyncPositions.unshift({
    //   x: Number(json.x),
    //   y: Number(json.y),
    //   t: Number(json.time),
    //   r: Number(json.rotation),
    //   recieved: Date.now()
    // });
    //
    // if (Boolean(json.teleport)) {
    //   for (let i = 0; i < this.lastSyncPositions.length; i++) {
    //     this.lastSyncPositions[i].x = Number(json.x);
    //     this.lastSyncPositions[i].y = Number(json.y);
    //   }
    // }
    //
    // this.lastSyncPositions.sort(function(a, b) {
    //   return b.t - a.t;
    // });
  }
}
