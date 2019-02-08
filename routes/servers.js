const Server = require('../models/Server.js');



module.exports = function(app) {


  app.post('/api/deleteServer', (req, res) => {
    Server.deleteOne({_id:req.body.serverId}).exec();
  })

  // needs auth
  app.post('/api/addServer', (req, res) => {
    if (!req.body.name || !req.body.address) {
      return res.status(500).end();
    }

    Server.create({
      name:req.body.name,
      address:req.body.address
    }, (error) => {
      if (error) {
        console.log(error);
        res.status(500).end();
      } else {
        res.status(200).end();
      }
    })
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
      if (error || !servers) {
        res.status(500).end();
      } else {
        res.json(servers).end();
      }
    });
  });

}
