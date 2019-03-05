import Map from '../game/Map.js';
import Player from '../game/Player.js';
import Ship from '../game/Ship.js';
import Obstacle from '../game/Obstacle.js';
import Box from '../game/Box.js';
import BlasterBullet from '../game/abilityObjects/BlasterBullet.js';
import ShieldBubble from '../game/abilityObjects/ShieldBubble.js';
import Grenade from '../game/abilityObjects/Grenade.js';
import Explosion from '../game/abilityObjects/Explosion.js';
import SmasherSpikes from '../game/abilityObjects/SmasherSpikes.js';
import SlamGfx from '../game/abilityObjects/SlamGfx.js';
import Emp from '../game/abilityObjects/Emp.js';
import StunGunBullet from '../game/abilityObjects/StunGunBullet.js';
import PlayerSeekingMissle from '../game/abilityObjects/PlayerSeekingMissle.js';
import TurretObject from '../game/abilityObjects/TurretObject.js';
import FreezeGfx from '../game/abilityObjects/FreezeGfx.js';
import Blast from '../game/abilityObjects/Blast.js';
import VacuumEffect from '../game/abilityObjects/VacuumEffect.js';
import Mine from '../game/abilityObjects/Mine.js';
import SilencerGfx from '../game/abilityObjects/SilencerGfx.js';
import VortexGrenade from '../game/abilityObjects/VortexGrenade.js';
import TeleportEffect from '../game/abilityObjects/TeleportEffect.js';
import SlicerSpikes from '../game/abilityObjects/SlicerSpikes.js';
import DashEffect from '../game/abilityObjects/DashEffect.js';
import BoostEffect from '../game/abilityObjects/BoostEffect.js';


const messageFunctions =  {
  mass: function(json, manager, ws, ui) {
    for (let i = 0; i < json.m.length; i++) {
      try {
        messageFunctions[json.m[i].t](json.m[i], manager, ws, ui);
      } catch (error) {
        console.log(json.m[i].t);
        console.error(error);
      }
    }
  },

  gameId: function(json, manager, ws, ui) {
    window.location.href = '/game/' + ui.props.server._id + '/' + json.gameId;
  },

  pong: function(json, manager, ws, ui) {
    const now = Date.now();

    const ping = now - manager.pingStart;

    manager.pings.unshift(ping);
    if (manager.pings.length > 10) {
      manager.pings.pop();
    }

    manager.ping = manager.pings.reduce((a, b) => a + b, 0) / manager.pings.length;

    manager.serverTimeOffset = now - Number(json.time) - ping / 2;

    const elm = document.getElementById('ping');
    if (elm) {
      elm.innerHTML = Math.round(manager.ping);
    }
  },

  spectatorJoined: function(json, manager, ws, ui) {
    ui.addToLog(json.name + ' is spectating.');
  },

  serverTickStats: function(json, manager, ws, ui) {
    const elm = document.getElementById('serverTickTime');
    if (elm) {
      elm.innerHTML = Math.round(Number(json.serverTickTime)*100)/100;
    };
  },

  winner: function(json, manager, ws, ui) {
    ui.setState({winner:json.name});
    manager.sounds.gameOver.play();
  },

  text: function(json, manager, ws, ui) {
    ui.addToLog(json.m);
    manager.sounds.countdown.play();
  },

  gameStarted: function(json, manager, ws, ui) {
    ui.addToLog('Game started.');
    manager.sounds.gameStart.play();
  },

  abilityCooldown: function(json, manager, ws, ui) {
    ui.cooldownData[Number(json.num)] = {
      lastFired: Date.now(),
      cooldown: Number(json.cooldown)
    };
  },

  mapInitial: function(json, manager, ws, ui) {
    manager.map = new Map(manager, json);
  },

  mapUpdate: function(json, manager) {
    manager.map.updateAttributes(json);
  },

  clientDisconnected: function(json, manager, ws, ui) {
    ui.addToLog(json.name + ' disconnected.');
  },

  playerInitial: function(json, manager) {
    const player = new Player(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, json.name);
    manager.player = player;
    manager.ships.push(player);
  },

  shipInitial: function(json, manager) {
    manager.ships.push(new Ship(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, json.name));
  },

  shipDestroy: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.id;
    });

    if (ship) {
      setTimeout(() => {
        ship.destroy();
      }, manager.renderDelay());
    }
  },

  shipUpdate: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.id;
    });

    if (ship) {
      ship.updateAttributes(json);
    }
  },

  obstacleInitial: function(json, manager) {
    manager.obstacles.push(new Obstacle(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id));
  },

  obstacleDestroy: function(json, manager) {
    const obstacle = manager.obstacles.find((o) => {
      return o.id == json.id;
    })

    if (obstacle) {
      setTimeout(() => {
        obstacle.destroy();
      }, manager.renderDelay());
    }
  },

  obstacleUpdate: function(json, manager) {
    const obstacle = manager.obstacles.find((o) => {
      return o.id == json.id;
    })

    if (obstacle) {
      obstacle.updateAttributes(json);
    }
  },

  boxInitial: function(json, manager) {
    manager.boxes.push(new Box(manager, Number(json.x), Number(json.y), json.id, Number(json.scaleX), Number(json.scaleY)));
  },

  boxDestroy: function(json, manager) {
    const box = manager.boxes.find((o) => {
      return o.id == json.id;
    })

    if (box) {
      setTimeout(() => {
        box.destroy();
      }, manager.renderDelay());
    }
  },

  boxUpdate: function(json, manager) {
    const box = manager.boxes.find((o) => {
      return o.id == json.id;
    })

    if (box) {
      box.updateAttributes(json);
    }
  },

  blasterBulletInitial: function(json, manager) {
    manager.abilityObjects.push(new BlasterBullet(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, json.color, json.playSound));
  },

  blasterBulletUpdate: function(json, manager) {
    const projectile = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (projectile) {
      projectile.updateAttributes(json);
    }
  },

  blasterBulletDestroy: function(json, manager) {
    const projectile = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (projectile) {
      setTimeout(() => {
        projectile.destroy();
      }, manager.renderDelay());
    }
  },

  blast: function(json, manager) {
    new Blast(manager, Number(json.x), Number(json.y), Number(json.rotation), json.color);
  },

  shieldBubbleInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      manager.abilityObjects.push(new ShieldBubble(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, ship));
    }
  },

  shieldBubbleUpdate: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      obj.updateAttributes(json);
    }
  },

  shieldBubbleDestroy: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  grenadeInitial: function(json, manager) {
    manager.abilityObjects.push(new Grenade(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id));
  },

  grenadeUpdate: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      obj.updateAttributes(json);
    }
  },

  grenadeDestroy: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  vortexGrenadeInitial: function(json, manager) {
    manager.abilityObjects.push(new VortexGrenade(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id));
  },

  vortexGrenadeUpdate: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      obj.updateAttributes(json);
    }
  },

  vortexGrenadeDestroy: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy(Number(json.radius), Number(json.x), Number(json.y));
      }, manager.renderDelay());
    }
  },

  mineInitial: function(json, manager) {
    manager.abilityObjects.push(new Mine(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id));
  },

  mineUpdate: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      obj.updateAttributes(json);
    }
  },

  mineDestroy: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  explosionInitial: function(json, manager) {
    setTimeout(() => {
      manager.abilityObjects.push(new Explosion(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, json.color));
    }, manager.renderDelay());
  },

  explosionUpdate: function() {
    // do nothing
  },

  explosionDestroy: function(json, manager) {
    // it destroys itself
  },

  smasherSpikesInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      manager.abilityObjects.push(new SmasherSpikes(manager, Number(json.radius), json.id, ship));
    }
  },

  smasherSpikesDestroyed: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      obj.destroy();
    }
  },

  slicerSpikesInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      manager.abilityObjects.push(new SlicerSpikes(manager, Number(json.radius), json.id, ship));
    }
  },

  slicerSpikesDestroyed: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  slamInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        manager.abilityObjects.push(new SlamGfx(manager, Number(json.radius), Number(json.x), Number(json.y), json.id, ship));
      }, manager.renderDelay());
    }
  },

  silencerInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        manager.abilityObjects.push(new SilencerGfx(manager, Number(json.x), Number(json.y), Number(json.radius), json.id, ship));
      }, manager.renderDelay());
    }
  },

  freezeInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        manager.abilityObjects.push(new FreezeGfx(manager, Number(json.radius), json.id, ship));
      }, manager.renderDelay());
    }
  },

  goInvisible: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      ship.goInvisible();
    }
  },

  goVisible: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      ship.goVisible();
    }
  },

  empInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        manager.abilityObjects.push(new Emp(manager, Number(json.x), Number(json.y), Number(json.radius), json.id));
      }, manager.renderDelay());
    }
  },

  stunGunBulletInitial: function(json, manager) {
    manager.abilityObjects.push(new StunGunBullet(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, json.color));
  },

  stunGunBulletUpdate: function(json, manager) {
    const projectile = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (projectile) {
      projectile.updateAttributes(json);
    }
  },

  stunGunBulletDestroy: function(json, manager) {
    const projectile = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (projectile) {
      setTimeout(() => {
        projectile.destroy();
      }, manager.renderDelay());
    }
  },

  playerSeekingMissleInitial: function(json, manager) {
    manager.abilityObjects.push(new PlayerSeekingMissle(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, json.color));
  },

  playerSeekingMissleUpdate: function(json, manager) {
    const projectile = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (projectile) {
      projectile.updateAttributes(json);
    }
  },

  playerSeekingMissleDestroy: function(json, manager) {
    const projectile = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (projectile) {
      setTimeout(() => {
        projectile.destroy();
      }, manager.renderDelay());
    }
  },

  turretInitial: function(json, manager) {
    manager.abilityObjects.push(new TurretObject(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id, Number(json.health)));
  },

  turretUpdate: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      obj.updateAttributes(json);
    }
  },

  turretDestroy: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  vacuumStart: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      manager.abilityObjects.push(new VacuumEffect(manager, Number(json.radius), json.id, ship))
    }
  },

  vacuumEnd: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  boostStart: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      manager.abilityObjects.push(new BoostEffect(manager, ship, json.id));
    }
  },

  boostEnd: function(json, manager) {
    const obj = manager.abilityObjects.find((o) => {
      return o.id == json.id;
    })

    if (obj) {
      setTimeout(() => {
        obj.destroy();
      }, manager.renderDelay());
    }
  },

  dashInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        manager.abilityObjects.push(new DashEffect(manager, ship));
      }, manager.renderDelay());
    }
  },

  bulletTimeInitial: function(json, manager) {
    setTimeout(() => {
      manager.sounds.bulletTime.play();
    }, manager.renderDelay());
  },

  rageStart: function(json, manager) {
    setTimeout(() => {
      manager.sounds.rage.play();
    }, manager.renderDelay());
  },

  chargeStart: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        ship.chargeStart();
      }, manager.renderDelay());
    }
  },

  chargeEnd: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        ship.chargeEnd();
      }, manager.renderDelay());
    }
  },

  shieldRechargeStart: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        ship.shieldRechargeStart();
      }, manager.renderDelay());
    }
  },

  shieldRechargeEnd: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        ship.shieldRechargeEnd();
      }, manager.renderDelay());
    }
  },

  stunnedStart: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        ship.stunnedStart();
      }, manager.renderDelay());
    }
  },

  stunnedEnd: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      setTimeout(() => {
        ship.stunnedEnd();
      }, manager.renderDelay());
    }
  },

  reviveInitial: function(json, manager) {
    setTimeout(() => {
      manager.sounds.teleport.play();
    }, manager.renderDelay());
  },

  teleportInitial: function(json, manager) {
    manager.abilityObjects.push(new TeleportEffect(manager, Number(json.x), Number(json.y), Number(json.radius)));
  }
}


export default messageFunctions
