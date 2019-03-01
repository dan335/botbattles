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
      isLoading: true,
      log: [],
      winner: null
    };
  }


  componentDidMount() {
    if (!this.props.replay) return;

    this.manager = new Manager(this.props.gameId, this, this.props.replaydata, null);
  }


  addToLog(text) {
    let log = cloneDeep(this.state.log);
    log.push({
      text: text,
      key: Functions.createId() // for react unique key
    });
    this.setState({log: log});
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


  render() {
    return (
      <div>
        <MainLayout>
          <div id="game"></div>
          {this.renderLoading()}
          <div id="logContainer">
            {this.renderLog()}
            {this.renderWinner()}
            {this.renderState()}
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
