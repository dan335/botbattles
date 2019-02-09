import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  Math as tMath,
  DirectionalLight,
  AxesHelper
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
    this.renderer.setClearColor( 0x222222, 1 );

    this.camera.position.y = 100;
    this.camera.rotation.x = tMath.degToRad(-90);

    // var directionalLight = new DirectionalLight( 0xffffff, 1 );
    // this.scene.add( directionalLight );

    document.getElementById('game').appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this, false );

    this.ui.ws.send(JSON.stringify({t:'joinGame', gameId:this.gameId}));
  var axesHelper = new AxesHelper( 20 );
  this.scene.add( axesHelper );
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
