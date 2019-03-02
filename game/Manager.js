import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  Math as tMath,
  DirectionalLight,
  AxesHelper,
  TextureLoader,
  MeshBasicMaterial,
  Sprite,
  Color
} from 'three';

import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import messageFunctions from '../lib/messageFunctions.js';
import {Howl} from 'howler';




export default class Manager {

  constructor(gameId, ui, replay, userId, user) {
    this.gameId = gameId;
    this.userId = userId;
    this.ui = ui;
    this.replay = replay;
    this.map = null;
    this.ships = [];
    this.obstacles = [];
    this.boxes = [];
    this.abilityObjects = [];
    this.particles = [];
    this.player = null;
    this.ping = 50; // average ping round trip
    this.pings = [];  // raw pings
    this.serverTimeOffset = 0;
    this.renderDelay = 0;   // delay from when message is recieved from client to rendering
    this.lastPingCheck = null;
    this.timeBetweenSyncs = 0;
    this.clientTickSum = 0;
    this.clientTickNum = 0;
    this.gameStartTime = null;
    this.deltaTime = 0;
    this.tickStartTime = 0;
    this.user = user;
    this.textures = {};
    this.sounds = {};

    this.loadTextures();
    this.loadSounds();
    this.setup();
    this.createSprites();
    this.tick();
    this.render();
  }


  createSprites() {
    this.spriteBucket = [];

    for (let i = 0; i < _s.numBucketSprites; i++) {
      const spriteMaterial = new MeshBasicMaterial({
        color: new Color(0xaaaaaa),
        transparent: true,
        opacity: 0.1,
        alphaMap: this.textures.particleAlpha
      });

      const sprite = new Sprite( spriteMaterial );
      sprite.scale.set(1, 1, 1);
      sprite.position.set(10000, 0, 10000);
      sprite.rotation.set(-Math.PI/2, 0, 0);
      sprite.visible = false;
      this.scene.add( sprite );
      this.spriteBucket.push(sprite);
    }
  }


  loadTextures() {
    this.textures.obstacleAoAlpha = new TextureLoader().load('/static/textures/obstacleAoAlpha.jpg');
    this.textures.playerColor = new TextureLoader().load('/static/textures/playerColor.jpg');
    this.textures.shipColor = new TextureLoader().load('/static/textures/shipColor.jpg');
    this.textures.turretColor = new TextureLoader().load('/static/textures/turretColor.jpg');
    this.textures.particleAlpha = new TextureLoader().load( '/static/textures/particleAlpha.jpg' );
    this.textures.pillarColor = new TextureLoader().load('/static/textures/pillarColor.jpg');
    this.textures.bg = new TextureLoader().load('/static/textures/bg.jpg');
    this.textures.forceFieldAlpha = new TextureLoader().load('/static/textures/forceFieldAlpha.jpg');
  }


  loadSounds() {
    this.sounds.blaster = new Howl({
      src: ['/static/sounds/Blaster_02.wav'],
      volume: 0.4
    });

    this.sounds.boost = new Howl({
      src: ['/static/sounds/Boost.wav']
    });

    this.sounds.bulletTime = new Howl({
      src: ['/static/sounds/Bullet_Time.wav']
    });

    this.sounds.cannon = new Howl({
      src: ['/static/sounds/Cannon.wav'],
      volume: 0.3
    });

    this.sounds.charging = new Howl({
      src: ['/static/sounds/Charging_LOOP.wav'],
      loop: true
    });

    this.sounds.countdown = new Howl({
      src: ['/static/sounds/Countdown_Beep.wav'],
      volume: 0.7
    });

    this.sounds.emp = new Howl({
      src: ['/static/sounds/EMP.wav']
    });

    this.sounds.forceField = new Howl({
      src: ['/static/sounds/Force_Field.wav']
    });

    this.sounds.gameOver = new Howl({
      src: ['/static/sounds/Game_Over.wav']
    });

    this.sounds.gameStart = new Howl({
      src: ['/static/sounds/Game_Start.wav']
    });

    this.sounds.explosionLarge = new Howl({
      src: ['/static/sounds/Large_Explosion.wav']
    });

    this.sounds.mineDropper = new Howl({
      src: ['/static/sounds/Mine_Dropper.wav']
    });

    this.sounds.rage = new Howl({
      src: ['/static/sounds/Rage.wav']
    });

    this.sounds.shieldRecharge = new Howl({
      src: ['/static/sounds/Shield_Recharge_LOOP.wav'],
      loop: true,
      volume: 0.2
    });

    this.sounds.silencer = new Howl({
      src: ['/static/sounds/Silencer.wav']
    });

    this.sounds.slam = new Howl({
      src: ['/static/sounds/Slam.wav']
    });

    this.sounds.explosionSmall = new Howl({
      src: ['/static/sounds/Small_Explosion_02.wav'],
      volume: 0.6
    });

    this.sounds.smasher = new Howl({
      src: ['/static/sounds/Smasher.wav']
    });

    this.sounds.stunGun = new Howl({
      src: ['/static/sounds/Stun_Gun.wav']
    });

    this.sounds.teleport = new Howl({
      src: ['/static/sounds/Teleport.wav']
    });

    this.sounds.turret = new Howl({
      src: ['/static/sounds/Turret.wav']
    });

    this.sounds.vacuum = new Howl({
      src: ['/static/sounds/Vacuum_LOOP.wav'],
      loop: true
    });

    this.sounds.stunned = new Howl({
      src: ['/static/sounds/Stun_LOOP.wav'],
      loop: true
    })
  }


  sendToServer(str) {
    if (this.ui.ws && this.ui.ws.readyState === this.ui.ws.OPEN) {
      this.ui.ws.send(JSON.stringify(str));
    }
  }


  checkPing() {
    if (this.replay) return;

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
    this.renderer.setClearColor( 0x1f282d, 1 );

    this.camera.position.y = 100;
    this.camera.rotation.x = tMath.degToRad(-90);

    document.getElementById('game').appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this, false );

    if (this.replay) {
      this.startReplay();
    } else {
      this.sendJoinGameMessage();
    }
  }


  startReplay() {
    this.replayJson = JSON.parse(this.replay.json);

    if (this.replayJson) {
      // sort json just in case
      this.replayJson.sort((a, b) => {
        return new Date(a.t) - new Date(b.t);
      })

      this.ui.setState({isLoading:false});
      this.playStart = Date.now();
      this.replayStart = this.replayJson[0].t;
      this.replayNextEvent();
    }
  }


  replayNextEvent() {
    if (this.replayJson && this.replayJson.length) {
      var event = this.replayJson.shift();

      let skipAhead = false;
      if (this.skipReplayToGameStart && this.gameStartTime) {
        skipAhead = true;
        if (event.t >= this.gameStartTime) {
          this.skipReplayToGameStart = false;
          skipAhead = false;
        }
      }

      if (event.t >= this.gameStartTime) {
        this.ui.setState({hasPassedGameStart:true});
      }

      const timeElapsed = Date.now() - this.playStart;
      const eventTimeFromStart = event.t - this.replayStart;

      let timeTilEvent = Math.max(0, eventTimeFromStart - timeElapsed);

      if (skipAhead) {
        timeTilEvent = 0;
      }

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
      if (this.user) {
        name = this.user.username;
      } else {
        name = 'Noname_' + Math.round(Math.random()*1000);
      }
    }

    let uiState = [];

    var a = [];
    for (var i = 0; i <= _s.numAbilities; i++) {
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

    let msg = {
      t:'joinGame',
      gameId:this.gameId,
      name:name,
      userId:this.userId,
      abilityTypes:[]
    };

    for (let i = 0; i < _s.numAbilities; i++) {
      msg.abilityTypes[i] = a[i];
    }

    this.sendToServer(msg);

    this.ui.setState({isLoading: false});
  }


  tick() {
    this.checkPing();

    this.deltaTime = performance.now() - this.tickStartTime;

    this.tickStartTime = performance.now();

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

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].tick();
    }

    this.clientTickSum += performance.now() - this.tickStartTime;
    this.clientTickNum++;

    if (this.clientTickNum > 100) {
      const elm = document.getElementById('clientTickTime');
      if (elm) {
        elm.innerHTML = Math.round(this.clientTickSum / this.clientTickNum * 100) / 100
      }
      this.clientTickSum = 0;
      this.clientTickNum = 0;
    }

    setTimeout(() => {
      this.tick();
    }, 16.666)
  }


  render() {
    requestAnimationFrame( this.render.bind(this) );
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
