const Abilities = require('../models/Abilities.js');
const Games = require('../models/Games.js');
const _s = require('../lib/settings.js');


module.exports = {
  Update: function() {

    Abilities.remove({}).exec((error, result) => {

      // create array
      let data = {};

      _s.abilityTypes.forEach((type) => {
        data[type.id] = {
          abilityId:type.id,
          name:type.name,
          description:type.description,
          uses:0,
          wins:0
        }
      });

      Games.find({}).exec((error, games) => {
        games.forEach((game) => {
          game.players.forEach((player) => {
            if (player.abilities) {
              player.abilities.forEach((ability) => {
                if (data[ability.id]) {
                  data[ability.id].uses = data[ability.id].uses + 1;

                  if (player.isWinner) {
                    data[ability.id].wins = data[ability.id].wins + 1;
                  }
                }
              })
            }
          })
        })

        // put into db
        _s.abilityTypes.forEach((type) => {
          Abilities.create(data[type.id]);
        })
      })

    })
  }
}
