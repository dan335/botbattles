const Abilities = require('../models/Abilities.js');
const Combos = require('../models/Combos.js');
const Games = require('../models/Games.js');
const _s = require('../lib/settings.js');
var moment = require('moment');



module.exports = {
  Update: function() {

    Abilities.deleteMany({}).exec((error, result) => {
      Combos.deleteMany({}).exec((error, result) => {

        // create array
        let data = {};
        let combos = {};
        let comboIds = [];  // so we can do forEach

        _s.abilityTypes.forEach((type) => {
          data[type.id] = {
            abilityId:type.id,
            name:type.name,
            description:type.description,
            uses:0,
            wins:0,
            usedWith:[],
            categories:type.categories
          }
        });

        let cutoff = moment().subtract(1, 'week').toDate();

        Games.find({endedAt: {$gte:cutoff}}).exec((error, games) => {
          games.forEach((game) => {
            game.players.forEach((player) => {
              if (player.abilities) {
                if (player.abilities.length == 3) {
                  player.abilities.forEach((ability) => {
                    if (data[ability.id]) {
                      data[ability.id].uses = data[ability.id].uses + 1;

                      if (player.isWinner) {
                        data[ability.id].wins = data[ability.id].wins + 1;
                      }

                      this.AddAbilitiesToCombos(combos, comboIds,player.abilities[0].id, player.abilities[1].id, player.abilities[2].id, player.isWinner);

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

          comboIds.forEach((id) => {
            if (combos[id].uses >= 30) {
              combos[id].winPercent = combos[id].uses ? combos[id].wins / combos[id].uses : 0;
              Combos.create(combos[id], (error, c) => {
                if (error) {
                  console.log(error);
                  console.log(id, combos[id])
                }
              });
            }
          })
        })

      })
    })
  },


  AddAbilitiesToCombos: function(combos, comboIds, ab1, ab2, ab3, isWin) {
    if (!ab1 || !ab2 || !ab3) return;

    let abs = [ab1, ab2, ab3];
    abs.sort();
    const id = abs[0] + '-' + abs[1] + '-' + abs[2];

    if (id in combos) {
      combos[id].uses++;
      if (isWin) {
        combos[id].wins++;
      }
    } else {
      combos[id] = {
        uses: 1,
        wins: isWin ? 1 : 0,
        abilityIds: abs
      };

      comboIds.push(id);
    }
  }
}
