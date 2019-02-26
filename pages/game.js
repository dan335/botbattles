import fetch from 'isomorphic-unfetch';
import { onmessage, onclose, onopen, onerror } from '../lib/websocket.js';
import Manager from '../game/Manager.js';
import MainLayout from '../layouts/MainLayout.js';
const Functions = require('../lib/functions.js');
import cloneDeep from 'lodash/cloneDeep';
const _s = require('../lib/settings.js');



export default class Game extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const serverResult = await fetch(process.env.API_URL + '/api/server', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({serverId:query.serverId})
    });

    let server = null;
    if (serverResult.status == 200) {
      server = await serverResult.json();
    }

    let user = null;
    if (userId) {
      const userResult = await fetch(process.env.API_URL + '/api/user', {
        method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        body: JSON.stringify({userId:userId})
      })

      if (userResult.status == 200) {
        user = await userResult.json();
      }
    }

    return {userId:userId, gameId:query.gameId, server:server, user:user};
  }



  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isLoadingReplay: false,
      hasAShip: false,
      ping: null,
      isLoading: true,
      log: [],
      health: _s.maxHealth,
      shield: _s.maxShield,
      abilityTypes: null,
      cooldowns: [],
      cooldownWidths: ['100%', '100%', '100%', '100%'],
      serverTickTime: null,
      clientTickTime: null,
      winner: null
    };

    this.cooldownData = [];

    for (let i = 0; i < _s.numAbilities; i++) {
      this.cooldownData[i] = { lastFired:0, cooldown:0 };
    }

    this.playButton = this.playButton.bind(this);
  }



  componentDidMount() {
    if (!this.props.server || !this.props.gameId) return;

    this.ws = new WebSocket(this.props.server.address);

    this.ws.onopen = (event) => {
      onopen(event, this.manager, this.ws, this);
      this.manager = new Manager(this.props.gameId, this, null, this.props.userId, this.props.user);
    }

    this.ws.onmessage = (event) => {
      onmessage(event, this.manager, this.ws, this);
    };

    this.ws.onclose = (event) => {
      onclose(event, this.manager, this.ws, this);
    }

    this.updateCooldownsTimerHandle = setInterval(() => {
      this.updateCooldowns();
    }, 90);
  }


  addToLog(text) {
    let log = cloneDeep(this.state.log);
    log.push({
      text: text,
      key: Functions.createId() // for react unique key
    });
    this.setState({log: log});
  }


  componentWillUnmount() {
    this.ws.close();
  }


  renderLostConnection() {
    if (!this.state.isConnected) {
      return (
        <div>
          <div id="lostConnectionModal">Lost connection to server.</div>
          <style jsx>{`
            #lostConnectionModal {
              position: fixed;
              left: 20px;
              top: 50px;
              color: #fff;
            }
          `}</style>
        </div>
      )
    }
  }


  renderStats() {
    let ping = '-';
    if (this.state.ping) {
      ping = Math.round(this.state.ping);
    }

    return (
      <div>
        Ping: {ping} &nbsp;&nbsp;
        Server Tick: {Math.round(this.state.serverTickTime * 100) / 100} &nbsp;&nbsp;
        Client Tick: {Math.round(this.state.clientTickTime * 100) / 100} &nbsp;&nbsp;
        <style jsx>{`
          div {
            position: fixed;
            left: 10px;
            bottom: 10px;
            color: #999;
            font-size: 50%;
          }
        `}</style>
      </div>
    )
  }


  renderLoading() {
    if (this.state.isLoading) {
      return (
        <div>
          Loading...
          <style jsx>{`
            div {
              position: fixed;
              left: 10px;
              bottom: 30px;
              color: #fff;
            }
          `}</style>
        </div>
      )
    }
  }


  renderLoadingReplay() {
    if (this.state.isLoadingReplay) {
      return (
        <div>
          Loading Replay...
          <style jsx>{`
            div {
              position: fixed;
              left: 10px;
              bottom: 30px;
              color: #fff;
            }
          `}</style>
        </div>
      )
    }
  }


  renderLog() {
    return (
      <div>
        {this.renderLogs()}
        <style jsx>{`
          div {
            line-height: 150%;
          }
        `}</style>
      </div>
    )
  }



  renderLogs() {
    return this.state.log.map((data) => {
      return (
        <div key={data.key}>{data.text}</div>
      )
    })
  }


  updateCooldowns() {
    for (let i = 0; i < _s.numAbilities; i++) {
      const bar = document.getElementById('cooldownBar' + i);
      if (bar) {
        bar.style.width = Math.min(1, (Date.now() - this.cooldownData[i].lastFired) / this.cooldownData[i].cooldown) * 100 + '%';
      }
    }
  }


  renderCooldowns() {
    if (!this.state.abilityTypes) return null;

    let data = [];

    for (let i = 0; i < _s.numAbilities; i++) {
      data[i] = _s.abilityTypes.find((t) => {
        return t.id == this.state.abilityTypes[i];
      })
    }

    let i = -1;

    return (
      <div id="cooldownContainer">
        {data.map((d) => {
          i++
          const barName = 'cooldownBar' + i;
          return (
            <div key={i}>
              <label>{d.name}</label>
              <div className="bg">
                <div className="bar" id={barName} style={{width:'100%'}}></div>
              </div>
            </div>
          )
        })}
        <style jsx>{`
          #cooldownContainer {
            position: absolute;
            right: 10px;
            bottom: 100px;
            width: 200px;
          }
          .bg {
            background-color: hsl(0, 0%, 40%);
            height: 20px;
            margin-bottom: 10px;
          }
          .bar {
            height: 20px;
            background-color: hsl(0, 0%, 70%);
          }
          label {
            margin-bottom: 8px;
          }
        `}</style>
      </div>
    )
  }


  renderHealthBars() {
    const health = (this.state.health / _s.maxHealth * 100) + '%';
    const shield = (this.state.shield / _s.maxShield * 100) + '%';

    return (
      <div id="healthContainer">
        <div id="shieldContainer" className="barContainer">
          <div id="shield" className="bar" style={{width:shield}}></div>
        </div>
        <div id="healthContainer" className="barContainer">
          <div id="health" className="bar" style={{width:health}}></div>
        </div>
        <style jsx>{`
          #healthContainer {

          }

          .barContainer {
            background-color: hsl(0, 0%, 40%);
            width: 200px;
            height: 30px;
            position: absolute;
          }
          #healthContainer {
            right: 10px;
            bottom: 20px;
          }

          #shieldContainer {
            right: 10px;
            bottom: 60px;
          }

          .bar {
            height: 100%;
          }
          #health {
            background-color: hsl(90, 60%, 60%);
          }
          #shield {
            background-color: hsl(215, 60%, 60%);
          }
        `}</style>
      </div>
    )
  }


  playButton(event) {
    this.ws.send(JSON.stringify({t:'requestGame'}));
  }


  renderWinner() {
    if (this.state.winner) {
      return (
        <div id="container">
          <div id="winner">{this.state.winner} Wins!</div>
          <div>
            <button onClick={this.playButton}>Play Again</button>
          </div>
          <div id="discord">
            <a href="https://discord.gg/6R3jYyH">Chat about this game on <img src="/static/Discord-Logo+Wordmark-White.png" /></a>
          </div>
          <style jsx>{`
            #container {
              margin-top: 40px;
            }
            #winner {
              font-size: 200%;
              margin-bottom: 20px;
            }
            img {
              width: 100px;
              vertical-align: middle;
            }
            #discord {
              margin-top: 10px;
            }
          `}</style>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <MainLayout>
          <div id="game"></div>
          {this.renderLostConnection()}
          {this.renderStats()}
          {this.renderLoading()}
          {this.renderLoadingReplay()}
          <div id="logContainer">
            {this.renderLog()}
            {this.renderWinner()}
          </div>
          {this.renderHealthBars()}
          {this.renderCooldowns()}
          <div id="backButton"><a href="/">&lt; Back Home</a></div>
        </MainLayout>
        <style jsx global>{`
          #game {
          }
          #game canvas {
            position: fixed;
          }
          #backButton {
            position: fixed;
            top: 20px;
            left: 10px;
          }
          #logContainer {
            position: absolute;
            left: 10px;
            bottom: 40px;
          }
        `}</style>
      </div>
    )
  }
}
