module.exports = {
  abilityKeyDefaults: [
    'lmb',
    'rmb',
    'Space',
    'KeyE'
  ],

  abilityTypeDefaults: [
    'Blasters',
    'Blasters',
    'Blasters',
    'Blasters'
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
      description: 'Teleport a short distance in the direction you\'re facing. 5 second cooldown.'
    },
    {
      name: 'Shotgun',
      id: 'Shotgun',
      description: 'Burst fire blaster weapon.'
    },
    {
      name: 'Shield',
      id: 'Shield',
      description: 'Creates an impenetrable shield around player for a short time.'
    }
  ]
}