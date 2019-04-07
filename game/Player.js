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
  }


  material() {
    return new MeshBasicMaterial( {
      map: this.manager.textures.playerColor,
      //alphaMap: new TextureLoader().load( '/static/textures/shipInvisibleAlpha.jpg' ),
      //transparent: false
    });
  }


  updateAttributes(json) {
    super.updateAttributes(json);
    this.updateUiBars();
  }


  updateUiBars() {
    const health = document.getElementById('health');
    if (health) {
      health.style.width = (this.health / _s.maxHealth * 100) + '%';
    }

    const healthText = document.getElementById('healthText');
    if (healthText) {
      healthText.innerHTML = Math.round(this.health);
    }

    const shield = document.getElementById('shield');
    if (shield) {
      shield.style.width = (this.shield / this.maxShield * 100) + '%';
    }

    const shieldText = document.getElementById('shieldText');
    if (shieldText) {
      shieldText.innerHTML = Math.round(this.shield);
    }
  }


  destroy() {
    super.destroy();
  }


  stopAllInputs() {
    for (let i = 0; i < this.abilityKeys.length; i++) {
      if (this.isAbilityDown[i]) {
        this.manager.sendToServer({t:'abilityKeyUp', num:i});
        this.isAbilityDown[i] = false;
      }
    }

    if (this.isUpKeyDown) {
      this.manager.sendToServer({t:'keyUp', key:'up'});
      this.isUpKeyDown = false;
    }

    if (this.isDownKeyDown) {
      this.manager.sendToServer({t:'keyUp', key:'down'});
      this.isDownKeyDown = false;
    }

    if (this.isRightKeyDown) {
      this.manager.sendToServer({t:'keyUp', key:'right'});
      this.isRightKeyDown = false;
    }

    if (this.isLeftKeyDown) {
      this.manager.sendToServer({t:'keyUp', key:'left'});
      this.isLeftKeyDown = false;
    }
  }


  handleEvent(event) {
    const elm = document.getElementById('chatInput');
    if (elm) {
      if (elm == document.activeElement) {
        this.stopAllInputs();
        return;
      }
    }

    switch (event.type) {

      case 'contextmenu':
        event.preventDefault();
        return false;
        break;

      case 'mousedown':
        let abilities = [];
        for (let i = 0; i < this.abilityKeys.length; i++) {
          if (this.abilityKeys[i] == 'lmb' && event.which == 1) {
            abilities.push(i);
          } else if (this.abilityKeys[i] == 'mmb' && event.which == 2) {
            abilities.push(i);
          } else if (this.abilityKeys[i] == 'rmb' && event.which == 3) {
            abilities.push(i);
          }
        }

        abilities.forEach((ability) => {
          if (!this.isAbilityDown[ability]) {
            this.manager.sendToServer({t:'abilityKeyDown', num:ability});
            this.isAbilityDown[ability] = true;
          }
        })
        break;

      case 'mouseup':
        abilities = [];
        for (let i = 0; i < this.abilityKeys.length; i++) {
          if (this.abilityKeys[i] == 'lmb' && event.which == 1) {
            abilities.push(i);
          } else if (this.abilityKeys[i] == 'mmb' && event.which == 2) {
            abilities.push(i);
          } else if (this.abilityKeys[i] == 'rmb' && event.which == 3) {
            abilities.push(i);
          }
        }

        abilities.forEach((ability) => {
          if (this.isAbilityDown[ability]) {
            this.manager.sendToServer({t:'abilityKeyUp', num:ability});
            this.isAbilityDown[ability] = false;
          }
        })
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
