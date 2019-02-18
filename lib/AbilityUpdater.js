const Abilities = require('../models/Abilities.js');
const Games = require('../models/Games.js');
const _s = require('../lib/settings.js');
var moment = require('moment');



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
          wins:0,
          usedWith:[]
        }
      });

      let cutoff = moment().subtract(1, 'week').toDate();

      Games.find({endedAt: {$gte:cutoff}}).exec((error, games) => {
        games.forEach((game) => {
          game.players.forEach((player) => {
            if (player.abilities) {
              player.abilities.forEach((ability) => {
                if (data[ability.id]) {
                  data[ability.id].uses = data[ability.id].uses + 1;

                  if (player.isWinner) {
                    data[ability.id].wins = data[ability.id].wins + 1;
                  }

                  player.abilities.forEach((other) => {
                    if (other.id != ability.id) {
                      const found = data[ability.id].usedWith.find((a) => {
                        return a.id == other.id;
                      });

                      if (found) {
                        found.uses++;
                      } else {
                        data[ability.id].usedWith.push({id:other.id, uses:1})
                      }
                    }
                  })
                }
              })
            }
          })
        })

        _s.abilityTypes.forEach((type) => {
          data[type.id].winPercent = data[type.id].uses ? data[type.id].wins / data[type.id].uses : 0;
        });

        // put into db
        _s.abilityTypes.forEach((type) => {
          Abilities.create(data[type.id]);
        })
      })

    })
  }
}
