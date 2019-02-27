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


  app.post('/api/saveSettings', (req, res) => {
    if (!req.session.userId) {
        return res.status(500).send('User not found.');
    }

    let name = req.body.name;
    name = name.replace(/[^0-9a-zA-Z_\s]/g, '').trim();

    if (!name || !name.length) {
      return res.status(500).send('Name too short.');
    }

    if (name.length >= 32) {
      return res.status(500).send('Name must be less than 32 characters.');
    }

    const nameQuery = '^' + name + '$';

    User.findOne({username:{ $regex : new RegExp(nameQuery, "i") }}).exec((error, result) => {
      if (result) {
        return res.status(500).send('A user by this name already exists.  Choose another.');
      } else {
        let data = {username:name};

        User.updateOne({_id:req.session.userId}, {$set:data}).exec((error, result) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.status(200).end();
          }
        })
      }
    })


  })
}
