const Server = require('../models/Server.js');
const User = require('../models/User.js');


module.exports = function(app) {


  app.post('/api/deleteServer', (req, res) => {
    User.findOne({_id:req.session.userId}).select({isAdmin:1}).exec((error, user) => {
      if (user && user.isAdmin) {
        Server.deleteOne({_id:req.body.serverId}).exec();
        res.status(200).end();
      } else {
        res.status(500).send('No access.');
      }
    });
  })

  // needs auth
  app.post('/api/addServer', (req, res) => {
    if (!req.body.name || !req.body.address) {
      return res.status(500).end();
    }

    User.findOne({_id:req.session.userId}).select({isAdmin:1}).exec((error, user) => {
      if (user && user.isAdmin) {

        Server.create({
          name:req.body.name,
          address:req.body.address,
          url: req.body.url
        }, (error) => {
          if (error) {
            console.log(error);
            res.status(500).end();
          } else {
            res.status(200).end();
          }
        })

      } else {
        res.status(500).send('No access.');
      }
    });
  })

  app.post('/api/server', (req, res) => {
    Server.findOne({_id:req.body.serverId}).exec((error, server) => {
      if (error || !server) {
        res.status(500).end();
      } else {
        res.json(server).end();
      }
    })
  });

  app.get('/api/servers', (req, res) => {
    Server.find({}).exec((error, servers) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(servers).end();
      }
    });
  });

}
