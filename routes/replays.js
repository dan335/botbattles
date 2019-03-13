const Replays = require('../models/Replays.js');
const ReplayData = require('../models/ReplayData.js');



module.exports = function(app) {

  app.post('/api/replay', (req, res) => {
    Replays.findOne({_id:req.body.replayId}).exec((error, replay) => {
      if (error) {
        res.status(500).end();
      } else {
        res.json(replay).end();
      }
    })
  });

  app.get('/api/replays', (req, res) => {
    Replays.find({}).sort({createdAt:-1}).limit(100).exec((error, replays) => {
      if (error) {
        console.error(error)
        res.status(500).end();
      } else {
        res.json(replays).end();
      }
    });
  });

  app.post('/api/replaydata', (req, res) => {
    ReplayData.findOne({_id:req.body.replayId}).exec((error, replay) => {
      if (error) {
        console.error(error)
        res.status(500).end();
      } else {
        res.json(replay).end();
      }
    })
  })

}
