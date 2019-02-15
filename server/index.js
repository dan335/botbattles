const AbilityUpdater = require('../lib/AbilityUpdater.js');

const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production'; //true false
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, (error) => {
  if (error) {
    console.log('Unable to connect to mongodb.');
  }
});

const sessionParser = session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
});

nextApp.prepare().then(() => {

  const expressApp = express();

  expressApp.use(bodyParser.json({limit: '20mb', extended: true}));
  expressApp.use(bodyParser.urlencoded({limit: '20mb', extended: true}));
  expressApp.use(sessionParser);

  require('../routes/servers.js')(expressApp);
  require('../routes/replays.js')(expressApp);
  require('../routes/games.js')(expressApp);
  require('../routes/auth.js')(expressApp);
  require('../routes/user.js')(expressApp);
  require('../routes/abilities.js')(expressApp);

  expressApp.get('/replay/:replayId', (req, res) => {
    nextApp.render(req, res, '/replay', { replayId: req.params.replayId })
  })

  expressApp.get('/game/:serverId/:gameId', (req, res) => {
    nextApp.render(req, res, '/game', { serverId: req.params.serverId, gameId: req.params.gameId })
  })

  expressApp.get('/player/:userId', (req, res) => {
    nextApp.render(req, res, '/player', { userId: req.params.userId })
  })

  expressApp.get('/ability/:abilityId', (req, res) => {
    nextApp.render(req, res, '/ability', { userId: req.params.abilityId })
  })

  expressApp.get('*', (req,res) => {
    return handle(req,res);
  })

  expressApp.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`)
  })

  AbilityUpdater.Update();

  setInterval(() => {
    AbilityUpdater.Update();
  }, 1000 * 60 * 30);
})
