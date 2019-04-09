const Chats = require('../models/Chats.js');
const User = require('../models/User.js');


module.exports = function(app) {

  app.get('/api/chats', (req, res) => {
    Chats.find({}).sort({time:1}).exec((error, result) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(result).end();
      }
    });
  });


  app.post('/api/deleteChat', (req, res) => {
    User.findOne({_id:req.session.userId}).select({isMod:1, isAdmin:1}).exec((error, user) => {
      if (user) {
        if (user.isMod || user.isAdmin) {

          Chats.findByIdAndRemove(req.body.chatId).exec((error, result) => {
            if (error) {
              res.status(500).end();
            } else {
              res.send('success');
            }
          });

        } else {
          res.status(500).end();
        }
      } else {
        res.status(500).end();
      }

    })
  });

}
