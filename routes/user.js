const User = require('../models/User.js');



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

}
