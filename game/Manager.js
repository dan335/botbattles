import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  Math as tMath,
} from 'three';


export default class Manager {

  constructor(gameId, ui) {
    this.gameId = gameId;
    this.ui = ui;
    this.map = null;
    this.ships = [];
    this.obstacles = [];
    this.boxes = [];
    this.player = null;
    this.ping = 50; // average ping round trip
    this.pings = [];  // raw pings
    this.lastPingCheck = null;
    this.setup();
  }


  checkPing() {
    const now = Date.now();
    if (!this.lastPingCheck || now - this.lastPingCheck > 1000 * 5) {
      if (this.ui.ws && this.ui.ws.readyState == 1) {
        this.pingStart = now;
        this.ui.ws.send(JSON.stringify({t:'ping'}));
      }

      this.lastPingCheck = now;
    }
  }


  setup() {
    // camera scale
    let smallest = window.innerWidth;
    if (window.innerHeight < smallest) smallest = window.innerHeight;
    this.cameraZoom = smallest / 1000;

    this.scene = new Scene();
    this.camera = new OrthographicCamera( -window.innerWidth / this.cameraZoom, window.innerWidth / this.cameraZoom, window.innerHeight / this.cameraZoom, -window.innerHeight / this.cameraZoom, 1, 200 );
    this.renderer = new WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.camera.position.y = 100;
    this.camera.rotation.x = tMath.degToRad(-90);

    document.getElementById('game').appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this, false );
    window.addEventListener( 'keydown', this, false );
    window.addEventListener( 'keyup', this, false );

    this.animate();
  }


  animate() {
    this.checkPing();

    if (this.map) this.map.tick();

    for (let i = 0; i < this.ships.length; i++) {
      this.ships[i].tick();
    }

    for (let i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].tick();
    }

    for (let i = 0; i < this.boxes.length; i++) {
      this.boxes[i].tick();
    }

    requestAnimationFrame( this.animate.bind(this) );
	   this.renderer.render( this.scene, this.camera );
  }


  handleEvent(event) {
    switch (event.type) {
      case 'resize':
        this.onWindowResize();
        break;
      case 'keydown':
        switch (event.key) {
          case 'ArrowUp':
          case  'w':
            this.ui.ws.send(JSON.stringify({t:'keyDown', key:'up'}));
            break;
          case 'ArrowDown':
          case  's':
            this.ui.ws.send(JSON.stringify({t:'keyDown', key:'down'}));
            break;
          case 'ArrowRight':
          case  'd':
            this.ui.ws.send(JSON.stringify({t:'keyDown', key:'right'}));
            break;
          case 'ArrowLeft':
          case  'a':
            this.ui.ws.send(JSON.stringify({t:'keyDown', key:'left'}));
            break;
        }
        break;
      case 'keyup':
        switch (event.key) {
          case 'ArrowUp':
          case  'w':
            this.ui.ws.send(JSON.stringify({t:'keyUp', key:'up'}));
            break;
          case 'ArrowDown':
          case  's':
            this.ui.ws.send(JSON.stringify({t:'keyUp', key:'down'}));
            break;
          case 'ArrowRight':
          case  'd':
            this.ui.ws.send(JSON.stringify({t:'keyUp', key:'right'}));
            break;
          case 'ArrowLeft':
          case  'a':
            this.ui.ws.send(JSON.stringify({t:'keyUp', key:'left'}));
            break;
        }
        break;
    }
  }


  onWindowResize() {
    this.camera.left = -window.innerWidth / this.cameraZoom;
    this.camera.right = window.innerWidth / this.cameraZoom;
    this.camera.top = window.innerHeight / this.cameraZoom;
    this.camera.bottom = -window.innerHeight / this.cameraZoom;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }
}
