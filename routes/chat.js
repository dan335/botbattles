const Chats = require('../models/Chats.js');


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

}
