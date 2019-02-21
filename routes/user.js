const User = require('../models/User.js');
const _s = require('../lib/settings.js');


const playersPerPage = 1;


module.exports = function(app) {

  app.post('/api/user', (req, res) => {
    User.findOne({_id:req.body.userId}).select({email:0, password:0, token:0}).exec((error, user) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(user).end();
      }
    })
  });


  // for leaderboard
  app.post('/api/players', (req, res) => {
    User.find({rating:{$exists:true}}).sort({rating:-1}).limit(_s.numPlayersPerLeaderboardPage).skip(_s.numPlayersPerLeaderboardPage * req.body.page).exec((error, users) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(users).end();
      }
    })
  })

}
