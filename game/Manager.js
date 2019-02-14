import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  Math as tMath,
  DirectionalLight,
  AxesHelper
} from 'three';

import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import messageFunctions from '../lib/messageFunctions.js';




export default class Manager {

  constructor(gameId, ui, replay, userId) {
    this.gameId = gameId;
    this.userId = userId;
    this.ui = ui;
    this.replay = replay;
    this.map = null;
    this.ships = [];
    this.obstacles = [];
    this.boxes = [];
    this.abilityObjects = [];
    this.player = null;
    this.ping = 50; // average ping round trip
    this.pings = [];  // raw pings
    this.lastPingCheck = null;
    this.timeBetweenSyncs = 0;
    this.clientTickSum = 0;
    this.clientTickNum = 0;
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

    if (this.replay) {
      this.startReplay();
    } else {
      this.sendJoinGameMessage();
    }

    // var axesHelper = new AxesHelper( 20 );
    // this.scene.add( axesHelper );

    this.animate();
  }


  startReplay() {
    this.ui.setState({isLoadingReplay:true});
    this.replayJson = JSON.parse(this.replay.json);

    if (this.replayJson) {
      // sort json just in case
      this.replayJson.sort((a, b) => {
        return new Date(a.t) - new Date(b.t);
      })

      this.ui.setState({isLoadingReplay:false});
      this.playStart = Date.now();
      this.replayStart = new Date(this.replay.createdAt).getTime();
      this.replayNextEvent();
    }
  }


  replayNextEvent() {
    if (this.replayJson && this.replayJson.length) {
      var event = this.replayJson.shift();

      const timeElapsed = Date.now() - this.playStart;
      const eventTimeFromStart = new Date(event.t).getTime() - this.replayStart;

      const timeTilEvent = Math.max(0, eventTimeFromStart - timeElapsed);

      if (timeTilEvent) {
        this.replayTimeoutHandle = setTimeout(() => {

          messageFunctions[event.j.t](event.j, this, null, this.ui);
          this.replayNextEvent();

        }, timeTilEvent);
      } else {
        messageFunctions[event.j.t](event.j, this, null, this.ui);
        this.replayNextEvent();
      }

    } else {
      this.ui.addToLog('Replay ended.');
    }
  }


  sendJoinGameMessage() {

    // name
    let name = Cookies.get('name');
    if (!name) {
      name = 'Noname';
    }

    let uiState = [];

    var a = [];
    for (var i = 1; i <= 4; i++) {
      let name = Cookies.get('abilityType' + i);

      const info = _s.abilityTypes.find((t) => {
        return t.id == name;
      })

      if (!info) {
        name = _s.abilityTypeDefaults[i];
      }

      a[i] = name;
      uiState[i] = name;
    }

    this.ui.setState({abilityTypes:uiState});

    this.ui.ws.send(JSON.stringify({
      t:'joinGame',
      gameId:this.gameId,
      name:name,
      userId:this.userId,
      abilityType1:a[1],
      abilityType2:a[2],
      abilityType3:a[3],
      abilityType4:a[4]
    }));
  }


  animate() {
    this.checkPing();

    const tickStartTime = performance.now();

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

    for (let i = 0; i < this.abilityObjects.length; i++) {
      this.abilityObjects[i].tick();
    }

    requestAnimationFrame( this.animate.bind(this) );
	   this.renderer.render( this.scene, this.camera );

     this.clientTickSum += performance.now() - tickStartTime;
     this.clientTickNum++;

     if (this.clientTickNum > 100) {
       this.ui.setState({clientTickTime: this.clientTickSum / this.clientTickNum});
       this.clientTickSum = 0;
       this.clientTickNum = 0;
     }
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
