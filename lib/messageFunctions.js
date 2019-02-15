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

  pong: function(json, manager, ws, ui) {
    const ping = Date.now() - manager.pingStart;

    manager.pings.unshift(ping);
    if (manager.pings.length > 10) {
      manager.pings.pop();
    }

    manager.ping = manager.pings.reduce((a, b) => a + b, 0) / manager.pings.length;
    ui.setState({ping:manager.ping});
  },

  spectatorJoined: function(json, manager, ws, ui) {
    ui.addToLog(json.name + ' is watching.');
  },

  serverTickStats: function(json, manager, ws, ui) {
    ui.setState({serverTickTime: Number(json.serverTickTime)});
  },

  winner: function(json, manager, ws, ui) {
    ui.addToLog(json.name + ' wins.');
  },

  gameStarted: function(json, manager, ws, ui) {
    ui.addToLog('Game started.');
  },

  abilityCooldown: function(json, manager, ws, ui) {
    let obj = {};
    obj['cooldown' + json.num] = {lastFired:Number(json.lastFired), interval:Number(json.interval)};
    manager.ui.setState(obj);
  },

  mapInitial: function(json, manager, ws, ui) {
    manager.map = new Map(manager, json);
  },

  mapUpdate: function(json, manager) {
    manager.map.updateAttributes(json);
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
      }, manager.timeBetweenSyncs);
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

    setTimeout(() => {
      obstacle.destroy();
    }, manager.timeBetweenSyncs);
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
      box.destroy();
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
    manager.abilityObjects.push(new BlasterBullet(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id));
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
      }, manager.timeBetweenSyncs);
    }
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
      }, manager.timeBetweenSyncs);
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
      }, manager.timeBetweenSyncs);
    }
  },

  explosionInitial: function(json, manager) {
    setTimeout(() => {
      manager.abilityObjects.push(new Explosion(manager, Number(json.x), Number(json.y), Number(json.rotation), Number(json.radius), json.id));
    }, manager.timeBetweenSyncs);
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
      setTimeout(() => {
        obj.destroy();
      }, manager.timeBetweenSyncs);
    }
  },

  slamInitial: function(json, manager) {
    const ship = manager.ships.find((s) => {
      return s.id == json.shipId;
    });

    if (ship) {
      manager.abilityObjects.push(new SlamGfx(manager, Number(json.radius), json.id, ship));
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
      manager.abilityObjects.push(new Emp(manager, ship.position.x, ship.position.y, Number(json.radius), json.id));
    }
  }
}


export default messageFunctions
