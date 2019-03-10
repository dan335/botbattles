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

    return {userId:userId, gameId:query.gameId, server:server, user:user, partyId:query.partyId};
  }



  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      abilityTypes: null,
      cooldowns: [],
      cooldownWidths: ['100%', '100%', '100%', '100%'],
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

    this.ws.onerror = (event) => {
      onerror(event);
    }

    this.updateCooldownsTimerHandle = setInterval(() => {
      this.updateCooldowns();
    }, 90);
  }


  addToLog(text) {
    const elm = document.getElementById('log');
    if (elm) {
      let node = document.createElement('div');
      node.innerHTML = text;
      elm.appendChild(node);
    }
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
    return (
      <div>
        Ping: <span id="ping">-</span> &nbsp;&nbsp;
        Server: <span id="serverTickTime">-</span> &nbsp;&nbsp;
        Client: <span id="clientTickTime">-</span> &nbsp;&nbsp;
        Render: <span id="renderTickTime">-</span>
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
    return (
      <div id="loading">
        Loading...
        <style jsx>{`
          div {
            position: fixed;
            width: 300px;
            height: 60px;
            top: 50%;
            left: 50%;
            margin-top: -30px;
            margin-left: -150px;
            color: #fff;
            display: true;
            text-align: center;
            padding: 20px;
            background-color: hsl(203, 30%, 10%);
            border-radius: 3px;
          }
        `}</style>
      </div>
    )
  }



  renderLog() {
    return (
      <div>
        <div id="log"></div>
        <style jsx>{`
          #log {
            line-height: 150%;
            border-radius: 3px;
            background-color: hsl(203, 30%, 10%);
            padding: 10px;
            font-family: 'Roboto', sans-serif;
            font-size: 90%;
          }
        `}</style>
      </div>
    )
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
            position: relative;
            left: 0px;
            top: 0px;
            background-color: hsl(203, 30%, 10%);
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 5px;
          }
          .bg {
            background-color: hsl(0, 0%, 40%);
            height: 30px;
            margin-bottom: 10px;
            border-radius: 3px;
          }
          .bar {
            height: 30px;
            background-color: hsl(0, 0%, 70%);
            border-radius: 3px;
          }
          label {
            margin-bottom: 8px;
            font-size: 80%;
          }
        `}</style>
      </div>
    )
  }


  renderHealthBars() {
    return (
      <div id="statsContainer">
        <label>Shield</label>
        <div id="shieldContainer" className="barContainer">
          <div id="shield" className="bar" style={{width:'100%'}}></div>
          <div id="shieldText" className="text"></div>
        </div>
        <label>Health</label>
        <div id="healthContainer" className="barContainer">
          <div id="health" className="bar" style={{width:'100%'}}></div>
          <div id="healthText" className="text"></div>
        </div>
        <style jsx>{`
          #statsContainer {
            background-color: hsl(203, 30%, 10%);
            padding: 10px;
            border-radius: 3px;
          }
          .barContainer {
            background-color: hsl(0, 0%, 40%);
            width: 200px;
            height: 30px;
            position: relative;
            border-radius: 3px;
            margin-bottom: 10px;
          }
          #healthContainer {
            left: 0px;
            top: 0px;
          }
          #shieldContainer {
            left: 0px;
            top: 0px;
          }
          .bar {
            height: 100%;
            border-radius: 3px;
          }
          .text {
            width: 200px;
            position: relative;
            top: -23px;
            text-align: center;
            vertical-align: middle;
            font-size: 150%;
            color: #fff;
          }
          #health {
            background-color: hsl(90, 60%, 60%);
          }
          #shield {
            background-color: hsl(215, 60%, 60%);
          }
          label
            margin-bottom: 8px;
            font-size: 80%;
          }
        `}</style>
      </div>
    )
  }


  playButton(event) {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify({t:'requestGame'}));
    }
  }


  renderWinner() {
    if (this.state.winner) {
      const url = '/party/' + this.props.server._id + '/' + this.props.partyId;

      return (
        <div id="container">
          <div id="winner">{this.state.winner} Wins!</div>
          <div>
            <button onClick={this.playButton}>Play Again</button>
            {this.props.partyId ? (<a href={url}><button>Back to Party</button></a>) : null}
          </div>
          <div id="discord">
            <a href="https://discord.gg/6R3jYyH">Chat about this game on <img src="/static/Discord-Logo+Wordmark-White.png" /></a>
          </div>
          <style jsx>{`
            #container {
              margin-top: 5px;
              background-color: hsl(203, 30%, 10%);
              border-radius: 3px;
              padding: 10px 20px;
              font-family: 'Roboto', sans-serif;
            }
            #winner {
              font-size: 150%;
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


  renderBackButton() {
    if (this.props.partyId) {
      const url = '/party/' + this.props.server._id + '/' + this.props.partyId;
      return (
        <div>
          <a href={url}>&lt; Back to Party</a>
          <br /><br />
          <a href="/">&lt; Back Home</a>
          <style jsx>{`
            a {
              margin-bottom: 10px;
            }
          `}</style>
        </div>
      )
    } else {
      return (
        <a href="/">&lt; Back Home</a>
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
          <div id="logContainer">
            {this.renderLog()}
            {this.renderWinner()}
          </div>
          <div id="rightUI">
            {this.renderCooldowns()}
            {this.renderHealthBars()}
          </div>
          <div id="backButton">
            {this.renderBackButton()}
          </div>
        </MainLayout>
        <style jsx global>{`
          #rightUI {
            position: absolute;
            right: 0px;
            bottom: 100px;
          }
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
            bottom: 100px;
            width: 300px;
          }
        `}</style>
      </div>
    )
  }
}
