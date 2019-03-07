import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';
import BottomMenu from '../components/BottomMenu.js';
import functions from '../lib/functions.js';
import Abilities from '../components/Abilities.js';
var hri = require('human-readable-ids').hri;



export default class Index extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const serverResult = await fetch(process.env.API_URL + '/api/servers', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

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

    if (serverResult.status == 200) {
      const servers = await serverResult.json();
      return {servers:servers, userId:userId, user:user};
    } else {
      return {servers:[], userId:userId, user:user};
    }
  }



  constructor(props) {
    super(props);

    this.ws = null;

    this.state = {
      isWsOpen: false,
      server: null,
      serverInfo: []
    }

    this.playButton = this.playButton.bind(this);
    this.connectToServer = this.connectToServer.bind(this);
    this.saveName = this.saveName.bind(this);
  }



  componentDidMount() {
    this.findServer();

    this.sendPings();

    this.getServerStats();

    setInterval(() => {
      this.getServerStats();
    }, 1000 * 5);
  }



  getServerStats() {
    let serverInfo = [];
    let promises = [];

    this.props.servers.forEach((server) => {
      promises.push(new Promise((resolve, reject) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = 'json';
        xmlHttp.open('GET', server.url + '/stats', true);
        xmlHttp.onload = function() {
          if (this.status == 200) {
            serverInfo.push(Object.assign({name:server.name, id:server._id}, this.response));
            resolve();
          } else {
            reject();
          }
        }
        xmlHttp.send();
      }));
    });

    Promise.all(promises).then(() => {
      this.setState({serverInfo:serverInfo});
    })
  }



  // to keep connection alive
  sendPings() {
    if (this.ws && this.ws.readyState == 1) {
      this.ws.send(JSON.stringify({t:'ping'}));
    }

    setTimeout(() => {
      this.sendPings();
    }, 1000 * 45);
  }




  componentDidUpdate(prevProps, prevState) {
    // if we now have a server connect to it
    if (prevState.server != this.state.server) {
      this.connectToServer();
    }
  }


  connectToServer() {
    if (this.state.server) {
      this.ws = new WebSocket(this.state.server.address);

      this.ws.onopen = (event) => {
        this.setState({isWsOpen: true});
      }

      this.ws.onmessage = (event) => {
        const json = JSON.parse(event.data);
        if (json && json.t == 'gameId') {
          window.location.href = '/game/' + this.state.server._id + '/' + json.gameId;
        }
      };

      this.ws.onclose = (event) => {
        this.setState({isWsOpen:false});
      }
    }
  }



  // in the future if there is more than one server ping all servers to find closest one
  findServer() {
    if (this.props.servers && this.props.servers.length) {
      this.setState({server:this.props.servers[0]});
    }
  }


  playButton(event) {
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      this.ws.send(JSON.stringify({t:'requestGame'}));
    }
  }


  saveName() {
    // name
    let name = document.getElementById('nameInput').value;
    if (!name) {
      name = 'Noname_' + Math.round(Math.random()*1000);
    }
    name = name.substring(0, 24);
    Cookies.set('name', name);
  }


  renderPlayButton() {
    if (!this.state.server) {
      return (
        <div>Finding a server...</div>
      )
    }

    if (!this.state.isWsOpen) {
      return (
        <div>
          <div>Connecting to server...</div>
          <br/>
          <div><button onClick={this.connectToServer}>Retry</button></div>
          <style jsx>{`
            button {
              margin-bottom: 30px;
            }
          `}</style>
        </div>
      )
    }

    return (
      <button onClick={this.playButton}>
        Play
        <style jsx>{`
          button {
            font-size: 200%;
            padding: 10px 20px;
            margin-bottom: 30px;
          }
        `}</style>
      </button>
    )
  }


  renderPartyButton() {
    if (this.state.server && this.state.isWsOpen) {
      const partyLink = '/party/' + this.state.server._id + '/' + hri.random();

      return (
        <div id="partyLink">
          <a href={partyLink} onClick={this.saveName}>Create a party.</a>
          <style jsx>{`
            #partyLink {
              margin-bottom: 10px;
            }
          `}</style>
        </div>
      )
    }
  }


  render() {
    let name = 'Noname_' + Math.round(Math.random()*1000);
    if (this.props.user) {
      name = this.props.user.username;
    } else if (Cookies.get('name')) {
      name = Cookies.get('name');
    }

    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />

          <div id="topBox">
            <h1 id="logo">Bot Battles</h1>
            <h2 id="tagline">MULTIPLAYER ONLINE ROBOTIC COMBAT ARENA</h2>
          </div>

          <div id="mainContainer">

            <div id="midBox">
              <div id="leftBox">
                <div id="inputContainer">
                  <label>Name</label>
                  <input type="text" defaultValue={name} id="nameInput" onChange={this.saveName}></input>
                </div>
                {this.renderPlayButton()}
                {this.renderPartyButton()}

                <div id="serverInfo">
                  {this.state.serverInfo.map((server) => {
                    return (
                      <div key={server.name} className="serverContainer">
                        <div className="serverTitle">
                          <div className="serverName">{server.name}</div>
                          <div className="alignRight">{server.numPlayers} Players, {server.numSpectators} Spectators in {server.numGames} Games</div>
                        </div>
                        {server.games.map((game) => {
                          return (
                            <div key={game.id} className="gameInfo">
                              <div>{game.numPlayers} Players, {game.numSpectators} Spectators</div>
                              <div className="alignRight">
                                {game.isStarted ? (<a href={'/game/'+server.id+'/'+game.id}>Spectate</a>) : (<a href={'/game/'+server.id+'/'+game.id}>Join</a>)}
                                {game.isEnded ? ' Ended' : ''}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div></div>

              <div>
                <Abilities />
              </div>
            </div>

          </div>
          <BottomMenu />
        </MainLayout>
        <style jsx>{`
          #serverInfo {
            font-family: 'Roboto', sans-serif;
            text-align: left;
            background-color: hsl(203, 20%, 10%);
            padding: 10px;
            border-radius: 3px;
            font-size: 90%;
            max-height: 300px;
            overflow-y: auto;
          }
          .serverContainer {
            margin-bottom: 20px;
          }
          .serverTitle {
            display: grid;
            grid-template-columns: auto auto;
            margin-bottom: 10px;
          }
          .serverName {
            font-weight: bold;
          }
          .alignRight {
            text-align: right;
          }
          .gameInfo {
            display: grid;
            grid-template-columns: auto auto;
          }
          #mainContainer {
            background-color: hsl(203, 20%, 20%);
          }

          #topBox {
            text-align: center;
            width: 100%;
            margin-bottom: 20px;
          }

          #midBox {
            display: grid;
            grid-template-columns: 420px 10px auto;
            width: 1000px;
            margin-left: auto;
            margin-right: auto;
            padding: 20px;
          }

          #leftBox {
            text-align: center;
          }

          #logo {
            color: #91df3e;
            font-size: 400%;
            margin-bottom: 5px;
            margin-top: 20px;
          }
          #tagline {
            font-size: 100%;
            margin-top: 0;
            margin-bottom: 10px;
          }
          label {
            display: block;
            margin-bottom: 10px;
            color: #91df3e;
          }
          #inputContainer {
            text-align: left;
            margin-bottom: 30px;
            background-color: hsl(203, 20%, 10%);
            padding: 20px;
            border-radius: 3px;
          }
        `}</style>
      </div>
    )
  }
}
