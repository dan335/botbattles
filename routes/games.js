const Games = require('../models/Games.js');
var request = require('request');



module.exports = function(app) {

  app.post('/api/gameFromReplay', (req, res) => {
    Games.findOne({replayId:req.body.replayId}).exec((error, game) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(game).end();
      }
    })
  });


  app.post('/api/games', (req, res) => {
    let sort = {endedAt: -1};
    let find = {};

    if (req.body.options) {
      switch (req.body.options) {
        case 'hasReplay':
          find.replayId = {$ne:null};
          break;
      }
    }

    switch (req.body.sort) {
      case 'quality':
        sort = {quality:-1};
        break;
      case 'date':
        sort = {endedAt:-1};
        break;
      default:
        sort = {endedAt:-1};
    }


    Games.find(find).sort(sort).limit(100).exec((error, games) => {
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
