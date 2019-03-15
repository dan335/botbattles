module.exports = {
  maxShield: 100,
  maxHealth: 280,
  numAbilities: 3,
  numPlayersPerLeaderboardPage: 100,
  numBucketSprites: 200,
  tickIntervalMs: 16.666,

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
      description: 'Rapid fire blaster weapon. 15 damage. 250ms cooldown.',
      categories: ['projectiles']
    },
    {
      name: 'Health Blasters',
      id: 'BlastersHealth',
      description: 'Rapid fire blaster weapon. 1.5 times as much damage to health as regular blasters but a quarter as much damage to shields.',
      categories: ['projectiles']
    },
    {
      name: 'Shield Blasters',
      id: 'BlastersShield',
      description: '1.5 times as much damage to shields as regular blasters but a quarter as much damage to health.',
      categories: ['projectiles']
    },
    {
      name: 'Teleport',
      id: 'Teleport',
      description: 'Teleport towards the mouse cursor. 4 sec cooldown.',
      categories: ['mobility']
    },
    {
      name: 'Shotgun',
      id: 'Shotgun',
      description: 'Burst fire blaster weapon.  Fires 10 blaster bullets.  1.5 sec cooldown.',
      categories: ['projectiles']
    },
    {
      name: 'Force Field',
      id: 'ForceField',
      description: 'Creates a shield that causes bullets to ricochet off and can damage shooter.  2 sec duration.  6 sec cooldown.',
      categories: ['defense']
    },
    {
      name: 'Grenade Launcher',
      id: 'GrenadeLauncher',
      description: 'Launch a grenade that is detonated next time you fire the ability.  Grenades explode immediately if they contact a player or wall.  Does up to 90 damage based on how close the explosion is. 5 sec cooldown.',
      categories: ['projectiles']
    },
    {
      name: 'Smasher',
      id: 'Smasher',
      description: 'Turn your bot into a weapon.  Damage someone when you smash into them. 5 sec cooldown.',
      categories: ['melee']
    },
    {
      name: 'Dash',
      id: 'Dash',
      description: 'Dash forward.  1.5 sec cooldown.',
      categories: ['mobility']
    },
    {
      name: 'Cannon',
      id: 'Cannon',
      description: 'Charge for 1 sec then fire three big blaster bullets.  3.5 sec cooldown.  Bullets do 60 damage.',
      categories: ['projectiles']
    },
    {
      name: 'Slam',
      id: 'Slam',
      description: 'Stun nearby players.  120 radius.  1.25 sec stun duration.  5 sec cooldown.',
      categories: ['aoe']
    },
    {
      name: 'Mine Dropper',
      id: 'BombDropper',
      description: 'Drop a bomb behind your player. Bomb explodes if it contacts another player. 15 bombs max.  2.5 sec cooldown.',
      categories: ['aoe', 'defense']
    },
    // {
    //   name: 'Invisibility',
    //   id: 'Invisibility',
    //   description: 'Install a cloaking device.  Being damaged or firing an ability causes you to lose invisibility.',
    //   categories: ['mobility']
    // },
    // {
    //   name: 'Boost',
    //   id: 'Boost',
    //   description: 'Boost your engines.  Gain a speed boost for 2 sec.  7 sec cooldown.',
    //   categories: ['mobility']
    // },
    {
      name: 'EMP',
      id: 'Emp',
      description: 'Disable shields of nearby players.  275 radius.  8 sec cooldown',
      categories: ['aoe']
    },
    // {
    //   name: 'Bullet Time',
    //   id: 'BulletTime',
    //   description: 'Slow down time for 4 sec.  11 sec cooldown.',
    //   categories: ['control']
    //
    // },
    {
      name: 'Stun Gun',
      id: 'StunGun',
      description: 'Stun enemies from a distance.  1 sec stun duration.  2.5 sec cooldown.',
      categories: ['projectiles', 'control']
    },
    {
      name: 'Player Seeker',
      id: 'PlayerSeeker',
      description: 'Fires missles that seeks players.  30 damage.  1 sec cooldown.',
      categories: ['projectiles']
    },
    {
      name: 'Vacuum',
      id: 'Vacuum',
      description: 'Suck objects towards you. Damage you recieve for 2 sec is halved.  300 radius.  1 sec duration.  4 sec cooldown.',
      categories: ['control', 'aoe']
    },
    {
      name: 'Silencer',
      id: 'Silencer',
      description: 'Prevent players from using their abilities.  250 radius.  2.5 sec silence duration.  4 sec cooldown.',
      categories: ['control', 'aoe']
    },
    {
      name: 'Freeze',
      id: 'Freezer',
      description: 'Emit a freeze blast that prevents players from moving.  Does 40 damage.  2.5 sec freeze duration.  150 radius.  5 sec cooldown.',
      categories: ['control', 'aoe']
    },
    {
      name: 'Revive',
      id: 'Resurrection',
      description: 'Go back to max health when you die.  90 sec cooldown',
      categories: ['passive']
    },
    {
      name: 'Slicer',
      id: 'Slicer',
      description: 'Damage players when you are touching them.  5 sec cooldown. 2 sec duration.',
      categories: ['melee']
    },
    {
      name: 'Freeze Trap',
      id: 'FreezeTrap',
      description: 'Drop a mine.  Freezes players who trigger it.  15 traps max.  2 sec freeze duration.    250 radius.',
      categories: ['control']
    },
    {
      name: 'Vortex Launcher',
      id: 'VortexLauncher',
      description: 'Launch a vortex grenade in front of you.  When it goes off it sucks nearby objects towards it and stuns them.  1 sec stun duration.  250 radius.  5 sec cooldown.',
      categories: ['aoe', 'projectiles', 'control']
    },
    {
      name: 'Turret',
      id: 'Turret',
      description: 'Create a turret that fires at closest enemy.  12 sec cooldown.  Bullets do 8 damage.  100 Health.',
      categories: ['control', 'passive', 'defense']
    },
    {
      name: 'Mouse Seeker',
      id: 'MouseSeeker',
      description: 'Bullet follows mouse currsor.  45 damage.  1 sec cooldown.',
      categories: ['projectiles']
    },
    // {
    //   name: 'Charger',
    //   id: 'Charger',
    //   description: 'The longer you charge the weapon the more damage it does.  5 sec cooldown.',
    //   categories: ['projectiles']
    // },
    {
      name: 'Rage',
      id: 'Rage',
      description: 'All ability cooldowns are halved while raging.  When rage starts your other abilities become ready and when it ends their cooldowns are reset.  When rage is over player is stunned for 0.5 sec.  12 sec cooldown.',
      categories: ['passive']
    },
    {
      name: 'Heal',
      id: 'Heal',
      description: 'Heal ability stuns you for 3 sec then heals 100 health.  10 sec cooldown.',
      categories: ['control']
    }
  ]
}
