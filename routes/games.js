const Games = require('../models/Games.js');
var request = require('request');



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


  app.post('/api/requestPlayersFromDiscord', (req, res) => {
    request({
      url: process.env.PARTY_HOOK,
      body: JSON.stringify({
        username: 'Party Bot',
        content: 'Bot Battles party in need of players.  ['+req.body.url+']('+req.body.url+')'
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, function(error, response) {
      console.log(error, response)
    })
  })

}
