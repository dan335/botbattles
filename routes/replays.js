const Replays = require('../models/Replays.js');



module.exports = function(app) {

  app.post('/api/replay', (req, res) => {
    Replays.findOne({_id:req.body.replayId}).exec((error, replay) => {
      if (error || !replay) {
        res.status(500).end();
      } else {
        res.json(replay).end();
      }
    })
  });

  app.get('/api/replays', (req, res) => {
    Replays.find({}).select({json:0}).sort({endedAt:-1}).limit(100).exec((error, replays) => {
      if (error || !replays) {
        res.status(500).end();
      } else {
        res.json(replays).end();
      }
    });
  });

}
