module.exports = {
  numAbilities: 3,
  maxShield: 100,
  maxHealth: 400,

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
    'ForceField'
  ],

  abilityTypes: [
    {
      name: 'Blasters',
      id: 'Blasters',
      description: 'Rapid fire blaster weapon.'
    },
    {
      name: 'Health Blasters',
      id: 'BlastersHealth',
      description: 'Rapid fire blaster weapon. Twice as much damage to health as regular blasters but a quarter as much damage to shields.'
    },
    {
      name: 'Shield Blasters',
      id: 'BlastersShield',
      description: 'Rapid fire blaster weapon.  Twice as much damage to shields as regular blasters but a quarter as much damage to health.'
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
      name: 'Force Field',
      id: 'ForceField',
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
      description: 'Turn into a weapon.  Damage someone when you smash into them.'
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
      description: 'Stun nearby players.'
    },
    {
      name: 'Mine Dropper',
      id: 'BombDropper',
      description: 'Drop a bomb behind your player. Bomb explodes if it contacts another player.'
    },
    {
      name: 'Invisibility',
      id: 'Invisibility',
      description: 'Install a cloaking device.  Being damaged or firing an ability causes you to lose invisibility.'
    },
    {
      name: 'Boost',
      id: 'Boost',
      description: 'Boost your engines.  Gain a speed boost for a short time.'
    },
    {
      name: 'EMP',
      id: 'Emp',
      description: 'Disable shields of nearby players.'
    },
    {
      name: 'Bullet Time',
      id: 'BulletTime',
      description: 'Slow down time.'
    },
    {
      name: 'Stun Gun',
      id: 'StunGun',
      description: 'Stun enemies from a distance.'
    },
    {
      name: 'Player Seeker',
      id: 'PlayerSeeker',
      description: 'Fires missles that seek players.'
    },
    {
      name: 'Vacuum',
      id: 'Vacuum',
      description: 'Suck players towards you.'
    },
    {
      name: 'Silencer',
      id: 'Silencer',
      description: 'Prevent players from using their abilities.'
    },
    {
      name: 'Freezer',
      id: 'Freezer',
      description: 'Prevent players from moving or turning.'
    },
    {
      name: 'Resurrection',
      id: 'Resurrection',
      description: 'Go back to max health when you die.'
    }
  ]
}
