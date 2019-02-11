const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production'; //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, (error) => {
  if (error) {
    console.log('Unable to connect to mongodb.');
  }
});

nextApp.prepare().then(() => {

  const expressApp = express();

  expressApp.use(bodyParser.json({limit: '20mb', extended: true}));
  expressApp.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

  require('../routes/servers.js')(expressApp);
  require('../routes/replays.js')(expressApp);

  expressApp.get('/replay/:replayId', (req, res) => {
    nextApp.render(req, res, '/replay', { replayId: req.params.replayId })
  })

  expressApp.get('/game/:serverId/:gameId', (req, res) => {
    nextApp.render(req, res, '/game', { serverId: req.params.serverId, gameId: req.params.gameId })
  })

  expressApp.get('*', (req,res) => {
    return handle(req,res);
  })

  expressApp.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`)
  })
})
