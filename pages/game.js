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

    return {userId:userId, gameId:query.gameId, server:server};
  }



  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isLoadingReplay: false,
      hasAShip: false,
      ping: null,
      isLoading: false,
      log: [],
      health: 100,
      shield: 100,
      abilityTypes: null,
      cooldown1: null,
      cooldown2: null,
      cooldown3: null,
      cooldown4: null,
      cooldownWidths: [null, '100%', '100%', '100%', '100%'],
      serverTickTime: null,
      clientTickTime: null
    };
  }



  componentDidMount() {
    if (!this.props.server || !this.props.gameId) return;

    this.ws = new WebSocket(this.props.server.address);

    this.ws.onopen = (event) => {
      onopen(event, this.manager, this.ws, this);
      this.manager = new Manager(this.props.gameId, this, null, this.props.userId);
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
          <div id="lostConnectionModal">Lost connection to server. <a href="/">Return to main menu</a>.</div>
          <style jsx>{`
            #lostConnectionModal {
              position: fixed;
              left: 20px;
              top: 20px;
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
            color: #ccc;
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
            position: absolute;
            left: 10px;
            bottom: 40px;
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
    let widths = [];
    let hasChanged = false;

    for (let i = 1; i <= 4; i++) {
      if (this.state['cooldown'+i]) {
        widths[i] = Math.min(1, (Date.now() - this.state['cooldown'+i].lastFired) / this.state['cooldown'+i].interval) * 100 + '%';
        if (widths[i] != this.state.cooldownWidths[i]) {
          hasChanged = true;
        }
      } else {
        widths[i] = '100%';
        if (widths[i] != this.state.cooldownWidths[i]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.setState({cooldownWidths:widths});
    }
  }


  renderCooldowns() {
    if (!this.state.abilityTypes) return null;

    let data = [];

    for (let i = 1; i <= 4; i++) {
      data[i] = _s.abilityTypes.find((t) => {
        return t.id == this.state.abilityTypes[i];
      })
    }

    let i = 0;

    return (
      <div id="cooldownContainer">
        {data.map((d) => {
          i++
          return (
            <div key={i}>
              <label>{d.name}</label>
              <div className="bg">
                <div className="bar" style={{width:this.state.cooldownWidths[i]}}></div>
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
    const health = this.state.health + '%';
    const shield = this.state.shield + '%';

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



  render() {
    return (
      <div>
        <MainLayout>
          <div id="game"></div>
          {this.renderLostConnection()}
          {this.renderStats()}
          {this.renderLoading()}
          {this.renderLoadingReplay()}
          {this.renderLog()}
          {this.renderHealthBars()}
          {this.renderCooldowns()}
        </MainLayout>
        <style jsx global>{`
          #game {
          }
          #game canvas {
            position: fixed;
          }
        `}</style>
      </div>
    )
  }
}
