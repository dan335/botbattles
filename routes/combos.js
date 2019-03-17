const Combos = require('../models/Combos.js');



module.exports = function(app) {

  app.post('/api/combos', (req, res) => {
    let sort = {};

    switch (req.body.sort) {
      case 'uses':
        sort['uses'] = -1;
        break;
      case 'wins':
        sort['wins'] = -1;
        break;
      case 'winPercent':
        sort['winPercent'] = -1
        break;
      default:
        sort['winPercent'] = -1;
        break;
    }

    let find = {};

    if (req.body.category) {
      find.categories = req.body.category;
    }

    Combos.find(find).sort(sort).exec((error, abilities) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(abilities).end();
      }
    });
  });


  app.get('/api/combosmasuses', (req, res) => {
    Combos.findOne().sort({uses:-1}).select({uses:1}).exec((error, ability) => {
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
