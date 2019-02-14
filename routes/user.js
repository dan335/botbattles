const User = require('../models/User.js');



module.exports = function(app) {

  app.post('/api/user', (req, res) => {
    User.findOne({_id:req.body.userId}).exec((error, user) => {
      if (error || !user) {
        res.status(500).end();
      } else {
        res.json(user).end();
      }
    })
  });

}
