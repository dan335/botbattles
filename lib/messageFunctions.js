import Map from '../game/Map.js';
import Player from '../game/Player.js';
import Ship from '../game/Ship.js';
import Obstacle from '../game/Obstacle.js';
import Box from '../game/Box.js';
import BlasterBullet from '../game/BlasterBullet.js';
import ShieldBubble from '../game/ShieldBubble.js';


const messageFunctions =  {
  mass: function(json, manager, ws, ui) {
    for (let i = 0; i < json.m.length; i++) {
      //console.log(json.m[i].t);
      messageFunctions[json.m[i].t](json.m[i], manager, ws, ui);
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

  gameStarted: function(json, manager, ws, ui) {
    ui.addToLog('Game started.');
  },

  mapInitial: function(json, manager, ws, ui) {
    manager.map = new Map(manager, json);
  },

  mapUpdate: function(json, manager) {
    manager.map.updateAttributes(json);
  },

  playerInitial: function(json, manager) {
    const player = new Player(manager, Number(json.x), Number(json.y), Number(json.rotation), json.id, json.name);
    manager.player = player;
    manager.ships.push(player);
  },

  shipInitial: function(json, manager) {
    manager.ships.push(new Ship(manager, Number(json.x), Number(json.y), Number(json.rotation), json.id, json.name));
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
    manager.obstacles.push(new Obstacle(manager, Number(json.x), Number(json.y), Number(json.rotation), json.id, Number(json.radius)));
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
    manager.abilityObjects.push(new BlasterBullet(manager, Number(json.x), Number(json.y), Number(json.rotation), json.id));
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

  }
}


export default messageFunctions
