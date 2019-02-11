export default class Base {

  constructor(manager, x, y, rotation, radius, id) {
    this.manager = manager;
    this.position = {x:x, y:y};
    this.rotation = rotation;
    this.radius = radius;
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
  }


  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }


  updateAttributes(json) {
    this.setPosition(Number(json.x), Number(json.y));
    this.rotation = Number(json.rotation);
  }
}
