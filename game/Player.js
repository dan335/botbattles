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
const _s = require('../lib/settings.js');
import * as Cookies from 'js-cookie';



export default class Player extends Ship {
  constructor(manager, x, y, rotation, radius, id, name) {
    super(manager, x, y, rotation, radius, id, name);

    this.isUpKeyDown = false;
    this.isDownKeyDown = false;
    this.isRightKeyDown = false;
    this.isLeftKeyDown = false;
    this.isAbilityKey1Down = false;
    this.isAbilityKey2Down = false;
    this.isAbilityKey3Down = false;
    this.isAbilityKey4Down = false;

    this.abilityKeys = [
      Cookies.get('abilityKey1') || _s.abilityKeyDefaults[0],
      Cookies.get('abilityKey2') || _s.abilityKeyDefaults[1],
      Cookies.get('abilityKey3') || _s.abilityKeyDefaults[2],
      Cookies.get('abilityKey4') || _s.abilityKeyDefaults[3]
    ];

    this.lastMousePosition = {x:null, y:null};

    this.throttledMouseUpdate = throttle((x, y) => {
      if (!this.manager.replay) {
        this.manager.ui.ws.send(JSON.stringify({t:'mousemove', x:x, y:y}));
      }
    }, 100);

    window.addEventListener( 'keydown', this, false );
    window.addEventListener( 'keyup', this, false );
    window.addEventListener( 'mousemove', this, false );
    window.addEventListener( 'mousedown', this, false );
    window.addEventListener( 'mouseup', this, false );
    window.addEventListener( 'contextmenu', this, false );

    this.manager.ui.setState({hasAShip:true});
  }


  material() {
    return new MeshBasicMaterial( { map: new TextureLoader().load( '/static/textures/playerColor.jpg' ) } );
  }


  updateAttributes(json) {
    super.updateAttributes(json);
    this.manager.ui.setState({
      health:this.health,
      shield:this.shield
    });
  }


  tick() {
    super.tick();
  }


  destroy() {
    super.destroy();
    this.manager.ui.setState({hasAShip:false});
  }


  handleEvent(event) {
    switch (event.type) {

      case 'contextmenu':
        event.preventDefault();
        return false;
        break;

      case 'mousedown':
        let ability = null;
        for (let i = 0; i < this.abilityKeys.length; i++) {
          if (this.abilityKeys[i] == 'lmb' && event.which == 1) {
            ability = i;
          } else if (this.abilityKeys[i] == 'mmb' && event.which == 2) {
            ability = i;
          } else if (this.abilityKeys[i] == 'rmb' && event.which == 3) {
            ability = i;
          }
        }

        if (ability != null) {
          if (!this['isAbilityKey'+ability+'Down']) {
            this.manager.ui.ws.send(JSON.stringify({t:'abilityKeyDown', num:ability}));
            this['isAbilityKey'+ability+'Down'] = true;
          }
        }
        break;

      case 'mouseup':
        ability = null;
        for (let i = 0; i < this.abilityKeys.length; i++) {
          if (this.abilityKeys[i] == 'lmb' && event.which == 1) {
            ability = i;
          } else if (this.abilityKeys[i] == 'mmb' && event.which == 2) {
            ability = i;
          } else if (this.abilityKeys[i] == 'rmb' && event.which == 3) {
            ability = i;
          }
        }

        if (ability != null) {
          if (this['isAbilityKey'+ability+'Down']) {
            this.manager.ui.ws.send(JSON.stringify({t:'abilityKeyUp', num:ability}));
            this['isAbilityKey'+ability+'Down'] = false;
          }
        }
        break;

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
              this.isDownKeyDown = true;
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
          default:
            for (let i = 0; i < this.abilityKeys.length; i++) {
              if (event.code == this.abilityKeys[i]) {
                if (!this['isAbilityKey'+i+'Down']) {
                  this.manager.ui.ws.send(JSON.stringify({t:'abilityKeyDown', num:i}));
                  this['isAbilityKey'+i+'Down'] = true;
                }
              }
            }
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
          default:
            for (let i = 0; i < this.abilityKeys.length; i++) {
              if (event.code == this.abilityKeys[i]) {
                if (this['isAbilityKey'+i+'Down']) {
                  this.manager.ui.ws.send(JSON.stringify({t:'abilityKeyUp', num:i}));
                  this['isAbilityKey'+i+'Down'] = false;
                }
              }
            }
        }
        break;
    }
  }
}
