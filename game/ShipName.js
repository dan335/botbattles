import {
  CanvasTexture,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  Mesh
} from 'three';


export default class ShipName {
  constructor(manager, ship) {
    this.manager = manager;
    this.ship = ship;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 512;
    this.canvas.height = 32;
    let ctx = this.canvas.getContext('2d');
    ctx.font = 'bold 20pt Roboto';
    ctx.fillStyle = '#eee';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.ship.name, this.canvas.width/2, this.canvas.height/2);

    const texture = new CanvasTexture(this.canvas);
    const material = new MeshBasicMaterial({
      //color: 0xeeeeee,
      map: texture,
      alphaTest: 0.2
    });
    const geometry = new PlaneBufferGeometry( 400, 25 );
    this.mesh = new Mesh( geometry, material );
    this.mesh.frustumCulled = false;
    this.mesh.rotation.x = -Math.PI/2;
    this.manager.scene.add(this.mesh);

    this.updatePosition();

    // var elm = document.getElementById('testName');
    // if (elm) {
    //   elm.appendChild(this.canvas);
    // }
  }


  updatePosition() {
    this.mesh.position.set(this.ship.position.x, 2, this.ship.position.y -80);
  }


  destroy() {
    if (this.mesh) {
      this.manager.scene.remove(this.mesh);

      if (this.mesh.geometry) {
        this.mesh.geometry.dispose();
      }
      if (this.mesh.material) {
        this.mesh.material.dispose();
      }
      this.mesh = undefined;
    }

    this.canvas = null;
  }
}
