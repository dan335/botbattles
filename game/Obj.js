import {
  Vector3,
} from 'three';


export default class Obj {

  constructor(manager, x, y, rotation, id) {
    this.manager = manager;
    this.position = {x:x, y:y};
    this.rotation = rotation;
    this.id = id;
    this.lastSyncPositions = [];
  }


  destroy() {
    if (this.mesh) {
      this.manager.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      this.mesh = undefined;
    }
  }


  tick() {
    let sum = 0;
    let count = 0;
    for (let n = 1; n < this.lastSyncPositions.length; n++) {
      sum += this.lastSyncPositions[n-1].recieved - this.lastSyncPositions[n].recieved;
      count++;
    }
    if (!count) return;
    const timeBetweenSyncs = sum / count;

    const from = this.lastSyncPositions[1];
    const to = this.lastSyncPositions[0];
    const percentage = Math.max(0, Math.min(1, (Date.now() - to.recieved) / timeBetweenSyncs));

    this.position = {
      x: from.x + percentage * (to.x - from.x),
      y: from.y + percentage * (to.y - from.y)
    };

    // rotation
    var diff = Math.atan2(Math.sin(to.r-from.r), Math.cos(to.r-from.r));
    this.rotation = from.r + diff * Math.max(0, Math.min(percentage, 1));

    if (this.mesh) {
      this.mesh.position.set(this.position.x, 0, this.position.y);
      this.mesh.setRotationFromAxisAngle(new Vector3(0, 1, 0), this.rotation * -1); // why -1?
    }
  }


  updateAttributes(json) {
    this.lastSyncPositions.unshift({
      x: Number(json.x),
      y: Number(json.y),
      t: Number(json.time),
      r: Number(json.rotation),
      recieved: Date.now()
    });

    if (this.lastSyncPositions.length > 4) {
      this.lastSyncPositions.pop();
    }

    this.lastSyncPositions.sort(function(a, b) {
      return b.t - a.t;
    });
  }
}
