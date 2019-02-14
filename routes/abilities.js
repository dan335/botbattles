const Abilities = require('../models/Abilities.js');



module.exports = function(app) {

  app.get('/api/abilities', (req, res) => {
    Abilities.find({}).sort({name:1}).exec((error, abilities) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(abilities).end();
      }
    });
  });


  app.post('/api/ability', (req, res) => {
    Abilities.findOne({_id:req.body.abilityId}).exec((error, ability) => {
      if (error || !replay) {
        res.status(500).end();
      } else {
        res.json(ability).end();
      }
    })
  });

  app.get('/api/abilitymaxuses', (req, res) => {
    Abilities.findOne().sort({uses:-1}).select({uses:1}).exec((error, ability) => {
      if (error) {
        res.status(500).end();
      } else {
        if (ability) {
          res.json({uses:ability.uses}).end();
        } else {
          res.json({uses:0}).end();
        }
      }
    })
  })

}
