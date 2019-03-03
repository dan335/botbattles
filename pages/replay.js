import fetch from 'isomorphic-unfetch';
import Manager from '../game/Manager.js';
import MainLayout from '../layouts/MainLayout.js';
const Functions = require('../lib/functions.js');
import cloneDeep from 'lodash/cloneDeep';
import TopMenu from '../components/TopMenu.js';



export default class Replay extends React.Component {

  static async getInitialProps({req, query}) {
    const serverResult = await fetch(process.env.API_URL + '/api/replay', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({replayId:query.replayId})
    });

    const replay = await serverResult.json();

    const dataResult = await fetch(process.env.API_URL + '/api/replaydata', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({replayId:query.replayId})
    });

    const replaydata = await dataResult.json();

    return {replay:replay, replaydata:replaydata};
  }


  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      winner: null
    };
  }


  componentDidMount() {
    if (!this.props.replay) return;

    this.manager = new Manager(this.props.gameId, this, this.props.replaydata, null);
  }


  addToLog(text) {
    const elm = document.getElementById('log');
    console.log(elm);
    if (elm) {
      let node = document.createElement('div');
      node.innerHTML = text;
      elm.appendChild(node);
    }
  }



  renderLoading() {
    return (
      <div id="loading">
        Loading...
        <style jsx>{`
          div {
            position: fixed;
            left: 10px;
            bottom: 30px;
            color: #fff;
            display: true;
          }
        `}</style>
      </div>
    )
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


  renderLog() {
    return (
      <div>
        <div id="log"></div>
        <style jsx>{`
          div {
            line-height: 150%;
          }
        `}</style>
      </div>
    )
  }


  renderWinner() {
    if (this.state.winner) {
      return (
        <div id="container">
          <div id="winner">{this.state.winner} Wins!</div>
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


  render() {
    return (
      <div>
        <MainLayout>
          <div id="game"></div>
          {this.renderLoading()}
          <div id="logContainer">
            {this.renderLog()}
            {this.renderWinner()}
            {this.renderStats()}
          </div>
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
