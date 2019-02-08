import fetch from 'isomorphic-unfetch';
import { onmessage, onclose, onopen } from '../lib/websocket.js';
import Manager from '../game/Manager.js';
import MainLayout from '../layouts/MainLayout.js';



export default class Game extends React.Component {

  static async getInitialProps({req, query}) {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';

    const serverResult = await fetch(baseUrl + '/api/server', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({serverId:query.serverId})
    });

    let server = null;
    if (serverResult.status == 200) {
      server = await serverResult.json();
    }

    return {gameId:query.gameId, server:server};
  }



  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      ping: null
    };
  }



  componentDidMount() {
    if (!this.props.server || !this.props.gameId) return;

    this.ws = new WebSocket(this.props.server.address);

    this.ws.onopen = (event) => {
      onopen(event, this.manager, this.ws, this);
    }

    this.ws.onmessage = (event) => {
      onmessage(event, this.manager, this.ws, this);
    };

    this.ws.onclose = (event) => {
      onclose(event, this.manager, this.ws, this);
    }

    this.manager = new Manager(this.props.gameId, this);
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
        Ping: {ping}
        <style jsx>{`
          div {
            position: fixed;
            left: 10px;
            bottom: 10px;
            color: #fff;
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
          {this.renderLostConnection()}
          {this.renderStats()}
        </MainLayout>
        <style jsx global>{`
          #game canvas {
            position: fixed;
          }
        `}</style>
      </div>
    )
  }
}
