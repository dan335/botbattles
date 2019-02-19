module.exports = {
  numAbilities: 3,
  maxShield: 100,
  maxHealth: 400,

  abilityCategories: [
    {
      id: 'projectiles',
      name: 'Projectiles'
    },
    {
      id: 'mobility',
      name: 'Mobility'
    },
    {
      id: 'defense',
      name: 'Defense'
    },
    {
      id: 'melee',
      name: 'Melee'
    },
    {
      id: 'aoe',
      name: 'Area of Effect'
    },
    {
      id: 'control',
      name: 'Control'
    },
    {
      id: 'passive',
      name: 'Passive'
    }
  ],

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
      description: 'Rapid fire blaster weapon.',
      categories: ['projectiles']
    },
    {
      name: 'Health Blasters',
      id: 'BlastersHealth',
      description: 'Rapid fire blaster weapon. Twice as much damage to health as regular blasters but a quarter as much damage to shields.',
      categories: ['projectiles']
    },
    {
      name: 'Shield Blasters',
      id: 'BlastersShield',
      description: 'Rapid fire blaster weapon.  Twice as much damage to shields as regular blasters but a quarter as much damage to health.',
      categories: ['projectiles']
    },
    {
      name: 'Teleport',
      id: 'Teleport',
      description: 'Teleport a short distance in the direction you\'re facing.',
      categories: ['mobility']
    },
    {
      name: 'Shotgun',
      id: 'Shotgun',
      description: 'Burst fire blaster weapon.',
      categories: ['projectiles']
    },
    {
      name: 'Force Field',
      id: 'ForceField',
      description: 'Creates a shield that stop projectiles around player for a short time.',
      categories: ['defense']
    },
    {
      name: 'Grenade Launcher',
      id: 'GrenadeLauncher',
      description: 'Launch a grenade that is detonated next time you fire the ability.  Grenades explode immediatly if they contact a player or wall.',
      categories: ['projectiles']
    },
    {
      name: 'Smasher',
      id: 'Smasher',
      description: 'Turn into a weapon.  Damage someone when you smash into them.',
      categories: ['melee']
    },
    {
      name: 'Dash',
      id: 'Dash',
      description: 'Dash forward.',
      categories: ['mobility']
    },
    {
      name: 'Cannon',
      id: 'Cannon',
      description: 'Charge then fire a big blaster bullet.',
      categories: ['projectiles']
    },
    {
      name: 'Slam',
      id: 'Slam',
      description: 'Stun nearby players.',
      categories: ['aoe']
    },
    {
      name: 'Mine Dropper',
      id: 'BombDropper',
      description: 'Drop a bomb behind your player. Bomb explodes if it contacts another player.',
      categories: ['aoe']
    },
    {
      name: 'Invisibility',
      id: 'Invisibility',
      description: 'Install a cloaking device.  Being damaged or firing an ability causes you to lose invisibility.',
      categories: ['mobility']
    },
    {
      name: 'Boost',
      id: 'Boost',
      description: 'Boost your engines.  Gain a speed boost for a short time.',
      categories: ['mobility']
    },
    {
      name: 'EMP',
      id: 'Emp',
      description: 'Disable shields of nearby players.',
      categories: ['aoe']
    },
    {
      name: 'Bullet Time',
      id: 'BulletTime',
      description: 'Slow down time.',
      categories: ['control']

    },
    {
      name: 'Stun Gun',
      id: 'StunGun',
      description: 'Stun enemies from a distance.',
      categories: ['projectiles', 'control']
    },
    {
      name: 'Player Seeker',
      id: 'PlayerSeeker',
      description: 'Fires missles that seek players.',
      categories: ['projectiles']
    },
    {
      name: 'Vacuum',
      id: 'Vacuum',
      description: 'Suck players towards you.',
      categories: ['control', 'aoe']
    },
    {
      name: 'Silencer',
      id: 'Silencer',
      description: 'Prevent players from using their abilities.',
      categories: ['control', 'aoe']
    },
    {
      name: 'Freezer',
      id: 'Freezer',
      description: 'Prevent players from moving or turning.',
      categories: ['control', 'aoe']
    },
    {
      name: 'Resurrection',
      id: 'Resurrection',
      description: 'Go back to max health when you die.',
      categories: ['passive']
    },
    {
      name: 'Slicer',
      id: 'Slicer',
      description: 'Damage players when you are touching them.',
      categories: ['melee']
    },
    {
      name: 'Freeze Trap',
      id: 'FreezeTrap',
      description: 'Drop a mine.  Freezes players who trigger it.',
      categories: ['control']
    },
    {
      name: 'Vortex Launcher',
      id: 'VortexLauncher',
      description: 'Launch a vortex grenade in front of you.  When it goes off it sucks nearby players towards it and freezes them.',
      categories: ['aoe', 'projectiles', 'control']
    }
  ]
}
