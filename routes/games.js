const Games = require('../models/Games.js');



module.exports = function(app) {

  app.get('/api/games', (req, res) => {
    Games.find({}).sort({endedAt:-1}).limit(100).exec((error, games) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(games).end();
      }
    });
  });


  app.post('/api/gamesWithUser', (req, res) => {
    Games.find({'players.userId':req.body.userId}).sort({endedAt:-1}).limit(30).exec((error, games) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(games).end();
      }
    })
  })

}
