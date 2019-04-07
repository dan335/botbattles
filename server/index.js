const AbilityUpdater = require('../lib/AbilityUpdater.js');
const Replays = require('../models/Replays.js');
const ReplayData = require('../models/ReplayData.js');
const Games = require('../models/Games.js');
var moment = require('moment');

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
  require('../routes/combos.js')(expressApp);
  require('../routes/contact.js')(expressApp);
  require('../routes/chat.js')(expressApp);

  expressApp.get('/games/sort/:sort/options/:options', (req, res) => {
    nextApp.render(req, res, '/games', {sort:req.params.sort, options:req.params.options});
  })

  expressApp.get('/games/options/:options', (req, res) => {
    nextApp.render(req, res, '/games', {options:req.params.options});
  })

  expressApp.get('/games/sort/:sort', (req, res) => {
    nextApp.render(req, res, '/games', {sort:req.params.sort});
  })

  expressApp.get('/replay/:replayId', (req, res) => {
    nextApp.render(req, res, '/replay', { replayId: req.params.replayId })
  })

  expressApp.get('/party/:serverId/:partyId', (req, res) => {
    nextApp.render(req, res, '/party', { serverId: req.params.serverId, partyId: req.params.partyId })
  })

  expressApp.get('/game/:serverId/:gameId', (req, res) => {
    nextApp.render(req, res, '/game', { serverId: req.params.serverId, gameId: req.params.gameId })
  })

  expressApp.get('/game/:serverId/:gameId/:partyId', (req, res) => {
    nextApp.render(req, res, '/game', { serverId: req.params.serverId, gameId: req.params.gameId, partyId: req.params.partyId })
  })

  expressApp.get('/player/:userId', (req, res) => {
    nextApp.render(req, res, '/player', { userId: req.params.userId })
  })

  expressApp.get('/ability/:abilityId', (req, res) => {
    nextApp.render(req, res, '/ability', { userId: req.params.abilityId })
  })

  expressApp.get('/abilities/sort/:sort', (req, res) => {
    nextApp.render(req, res, '/abilities', { sort: req.params.sort })
  })

  expressApp.get('/abilities/category/:category', (req, res) => {
    nextApp.render(req, res, '/abilities', { category: req.params.category })
  })

  expressApp.get('/abilities/sort/:sort/category/:category', (req, res) => {
    nextApp.render(req, res, '/abilities', { sort: req.params.sort, category: req.params.category })
  })

  expressApp.get('/combos/sort/:sort', (req, res) => {
    nextApp.render(req, res, '/combos', { sort: req.params.sort })
  })

  expressApp.get('/combos/category/:category', (req, res) => {
    nextApp.render(req, res, '/combos', { category: req.params.category })
  })

  expressApp.get('/combos/sort/:sort/category/:category', (req, res) => {
    nextApp.render(req, res, '/combos', { sort: req.params.sort, category: req.params.category })
  })

  expressApp.get('/leaderboard/:page', (req, res) => {
    nextApp.render(req, res, '/leaderboard', { page: req.params.page });
  })

  expressApp.get('/favicon.ico', (req, res) => (
    res.status(200).sendFile('favicon2.ico', {root: (__dirname + '/static/').replace('\\server', '').replace('/server', '')})
  ));

  expressApp.get('/ads.txt', (req, res) => (
    res.status(200).sendFile('ads.txt', {root: (__dirname + '/static/').replace('\\server', '').replace('/server', '')})
  ));

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

  setInterval(() => {
    let cutoff = moment().subtract(7, 'days').toDate();
    Replays.remove({createdAt: {$lt:cutoff}}).exec();
    ReplayData.remove({createdAt: {$lt:cutoff}}).exec();

    cutoff = moment().subtract(90, 'days').toDate();
    Games.remove({createdAt: {$lt:cutoff}}).exec();
  }, 1000 * 60 * 60);
})
