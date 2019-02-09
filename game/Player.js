import Ship from './Ship.js';

import {
  MeshBasicMaterial,
  TextureLoader,
  Vector3,
  Vector2,
  Raycaster,
  Plane
} from 'three';

import throttle from 'lodash/throttle';



export default class Player extends Ship {
  constructor(manager, x, y, rotation, id) {
    super(manager, x, y, rotation, id);

    this.isUpKeyDown = false;
    this.isDownKeyDown = false;
    this.isRightKeyDown = false;
    this.isLeftKeyDown = false;

    this.lastMousePosition = {x:null, y:null};

    this.throttledMouseUpdate = throttle((x, y) => {
      this.manager.ui.ws.send(JSON.stringify({t:'mousemove', x:x, y:y}));
    }, 100);

    window.addEventListener( 'keydown', this, false );
    window.addEventListener( 'keyup', this, false );
    window.addEventListener( 'mousemove', this, false );
  }


  material() {
    return new MeshBasicMaterial( { map: new TextureLoader().load( '/static/textures/playerColor.jpg' ) } );
  }


  tick() {
    super.tick();
  }




  handleEvent(event) {
    switch (event.type) {
      case 'mousemove':
        if (event.clientX != this.lastMousePosition.x || event.clientY != this.lastMousePosition.y) {
          // screen to world space transform of mouse position
          let worldPos = new Vector3();
          worldPos.set( (event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1, 0 );
          worldPos.unproject(this.manager.camera);
          this.throttledMouseUpdate(worldPos.x, worldPos.z);
          this.lastMousePosition = {x:event.clientX, y:event.clientY};
        }
        break;

      case 'keydown':
        switch (event.key) {
          case 'ArrowUp':
          case  'w':
            if (!this.isUpKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyDown', key:'up'}));
              this.isUpKeyDown = true;
            }
            break;
          case 'ArrowDown':
          case  's':
            if (!this.isDownKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyDown', key:'down'}));
              this.isDownKeyDown = true
            }
            break;
          case 'ArrowRight':
          case  'd':
            if (!this.isRightKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyDown', key:'right'}));
              this.isRightKeyDown = true;
            }
            break;
          case 'ArrowLeft':
          case  'a':
            if (!this.isLeftKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyDown', key:'left'}));
              this.isLeftKeyDown = true;
            }
            break;
        }
        break;
      case 'keyup':
        switch (event.key) {
          case 'ArrowUp':
          case  'w':
            if (this.isUpKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyUp', key:'up'}));
              this.isUpKeyDown = false;
            }
            break;
          case 'ArrowDown':
          case  's':
            if (this.isDownKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyUp', key:'down'}));
              this.isDownKeyDown = false;
            }
            break;
          case 'ArrowRight':
          case  'd':
            if (this.isRightKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyUp', key:'right'}));
              this.isRightKeyDown = false;
            }
            break;
          case 'ArrowLeft':
          case  'a':
            if (this.isLeftKeyDown) {
              this.manager.ui.ws.send(JSON.stringify({t:'keyUp', key:'left'}));
              this.isLeftKeyDown = false;
            }
            break;
        }
        break;
    }
  }
}
