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
    this.isAbilityDown = [];
    this.abilityKeys = [];

    for (let i = 0; i < _s.numAbilities; i++) {
      this.isAbilityDown[i] = false;
      this.abilityKeys[i] = Cookies.get('abilityKey' + i) || _s.abilityKeyDefaults[i];
    }

    this.lastMousePosition = {x:null, y:null};

    this.throttledMouseUpdate = throttle((x, y) => {
      if (!this.manager.replay) {
        this.manager.sendToServer({t:'mousemove', x:x, y:y});
      }
    }, 30);

    window.addEventListener( 'keydown', this, false );
    window.addEventListener( 'keyup', this, false );
    window.addEventListener( 'mousemove', this, false );
    window.addEventListener( 'mousedown', this, false );
    window.addEventListener( 'mouseup', this, false );
    window.addEventListener( 'contextmenu', this, false );

    this.manager.ui.setState({hasAShip:true});
  }


  material() {
    //return new MeshBasicMaterial( { map: new TextureLoader().load( '/static/textures/playerColor.jpg' ) } );
    return new MeshBasicMaterial( {
      map: this.manager.textures.playerColor,
      //alphaMap: new TextureLoader().load( '/static/textures/shipInvisibleAlpha.jpg' ),
      transparent: true,
      opacity: 1
    });
  }


  updateAttributes(json) {
    super.updateAttributes(json);

    const health = document.getElementById('health');
    if (health) {
      health.style.width = (this.health / _s.maxHealth * 100) + '%';
    }

    const shield = document.getElementById('shield');
    if (shield) {
      shield.style.width = (this.shield / _s.maxShield * 100) + '%';
    }
  }


  tick() {
    const interpolationMs = 100;
    const now = Date.now();
    const playbackServerTime = now - interpolationMs - this.manager.serverTimeOffset;
    let to = null;
    let from = null;
    let lastNeededIndex;

    // find syncPositions surrounding playbackServerTime
    for (let n = 1; n < this.syncPositions.length; n++) {
      if (this.syncPositions[n].t < playbackServerTime && this.syncPositions[n-1].t >= playbackServerTime) {
        from = this.syncPositions[n];
        to = this.syncPositions[n-1];
        lastNeededIndex = n;
      }
    }

    if (!to || !from) {
      console.log('aborting');
      return;
    };

    const percentage = (playbackServerTime - from.t) / (to.t - from.t);
console.log(percentage, from.t, playbackServerTime, to.t)
    this.setPosition(
      from.x + percentage * (to.x - from.x),
      from.y + percentage * (to.y - from.y)
    );

    // rotation
    var diff = Math.atan2(Math.sin(to.r-from.r), Math.cos(to.r-from.r));
    this.setRotation(from.r + diff * percentage);

    // how much delay should be used for things like spawning explosions
    this.manager.renderDelay = now - from.recieved + (to.recieved - from.recieved) * percentage;

    // get rid of un-needed sync positions
    this.syncPositions.length = lastNeededIndex + 1;
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
          if (!this.isAbilityDown[ability]) {
            this.manager.sendToServer({t:'abilityKeyDown', num:ability});
            this.isAbilityDown[ability] = true;
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
          if (this.isAbilityDown[ability]) {
            this.manager.sendToServer({t:'abilityKeyUp', num:ability});
            this.isAbilityDown[ability] = false;
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
          case 'w':
          case 'W':
            if (!this.isUpKeyDown) {
              this.manager.sendToServer({t:'keyDown', key:'up'});
              this.isUpKeyDown = true;
            }
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            if (!this.isDownKeyDown) {
              this.manager.sendToServer({t:'keyDown', key:'down'});
              this.isDownKeyDown = true;
            }
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            if (!this.isRightKeyDown) {
              this.manager.sendToServer({t:'keyDown', key:'right'});
              this.isRightKeyDown = true;
            }
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            if (!this.isLeftKeyDown) {
              this.manager.sendToServer({t:'keyDown', key:'left'});
              this.isLeftKeyDown = true;
            }
            break;
          default:
            for (let i = 0; i < this.abilityKeys.length; i++) {
              if (event.code == this.abilityKeys[i]) {
                if (!this.isAbilityDown[i]) {
                  this.manager.sendToServer({t:'abilityKeyDown', num:i});
                  this.isAbilityDown[i] = true;
                }
              }
            }
        }
        break;
      case 'keyup':
        switch (event.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            if (this.isUpKeyDown) {
              this.manager.sendToServer({t:'keyUp', key:'up'});
              this.isUpKeyDown = false;
            }
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            if (this.isDownKeyDown) {
              this.manager.sendToServer({t:'keyUp', key:'down'});
              this.isDownKeyDown = false;
            }
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            if (this.isRightKeyDown) {
              this.manager.sendToServer({t:'keyUp', key:'right'});
              this.isRightKeyDown = false;
            }
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            if (this.isLeftKeyDown) {
              this.manager.sendToServer({t:'keyUp', key:'left'});
              this.isLeftKeyDown = false;
            }
            break;
          default:
            for (let i = 0; i < this.abilityKeys.length; i++) {
              if (event.code == this.abilityKeys[i]) {
                if (this.isAbilityDown[i]) {
                  this.manager.sendToServer({t:'abilityKeyUp', num:i});
                  this.isAbilityDown[i] = false;
                }
              }
            }
        }
        break;
    }
  }

  goInvisible() {
    // this.mesh.material.transparent = true;
    // this.mesh.material.opacity = 0.5;
    // this.mesh.material.needsUpdate = true;
    this.mesh.material.visible = false;
  }

  goVisible() {
    //this.mesh.material.transparent = false;
    this.mesh.material.opacity = 1;
  }
}
