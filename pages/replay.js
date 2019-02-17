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

    return {replay:replay};
  }


  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isLoading: false,
      log: [],
    };
  }


  componentDidMount() {
    if (!this.props.replay) return;

    this.manager = new Manager(this.props.gameId, this, this.props.replay, null);
  }


  addToLog(text) {
    let log = cloneDeep(this.state.log);
    log.push({
      text: text,
      key: Functions.createId() // for react unique key
    });
    this.setState({log: log});
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
            position: absolute;
            left: 10px;
            bottom: 40px;
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


  render() {
    return (
      <div>
        <MainLayout>
          <div id="game"></div>
          {this.renderLostConnection()}
          {this.renderLoading()}
          {this.renderLog()}
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
