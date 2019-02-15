module.exports = {
  abilityKeyDefaults: [
    'lmb',
    'rmb',
    'Space',
    'KeyE'
  ],

  abilityTypeDefaults: [
    'Blasters',
    'Shotgun',
    'GrenadeLauncher',
    'Shield'
  ],

  abilityTypes: [
    {
      name: 'Blasters',
      id: 'Blasters',
      description: 'Fast rate of fire.  Small damage.  Fires in a straight line.'
    },
    {
      name: 'Teleport',
      id: 'Teleport',
      description: 'Teleport a short distance in the direction you\'re facing.'
    },
    {
      name: 'Shotgun',
      id: 'Shotgun',
      description: 'Burst fire blaster weapon.'
    },
    {
      name: 'Shield',
      id: 'Shield',
      description: 'Creates a shield that stop projectiles around player for a short time.'
    },
    {
      name: 'Grenade Launcher',
      id: 'GrenadeLauncher',
      description: 'Launch a grenade that is detonated next time you fire the ability.  Grenades explode immediatly if they contact a player or wall.'
    },
    {
      name: 'Smasher',
      id: 'Smasher',
      description: 'Turn your ship into a weapon.  Damage someone when you smash into them.'
    },
    {
      name: 'Dash',
      id: 'Dash',
      description: 'Dash forward.'
    },
    {
      name: 'Cannon',
      id: 'Cannon',
      description: 'Charge then fire a big blaster bullet.'
    },
    {
      name: 'Slam',
      id: 'Slam',
      description: 'Stun nearby ships.'
    },
    {
      name: 'Bomb Dropper',
      id: 'BombDropper',
      description: 'Drop a bomb behind your ship. Bomb explodes if it contacts another player.'
    },
    {
      name: 'Invisibility',
      id: 'Invisibility',
      description: 'Install a cloaking device on your ship.  Being damaged or firing an ability causes you to lose invisibility.'
    },
    {
      name: 'Boost',
      id: 'Boost',
      description: 'Boost your engines.  Gain a speed boost for a short time.'
    },
    {
      name: 'EMP',
      id: 'Emp',
      description: 'Disable shields of nearby ships.'
    }
  ]
}
