import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';
import BottomMenu from '../components/BottomMenu.js';



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
      abilityTypes: [],
      abilityKeys: [],
      serverInfo: []
    }

    this.playButton = this.playButton.bind(this);
    this.connectToServer = this.connectToServer.bind(this);
  }



  componentDidMount() {
    //document.getElementById('mainTable').style.height = window.innerHeight + 'px';

    this.findServer();

    // set ability type dropdowns
    let abilityTypes = [];
    for (let i = 0; i < _s.numAbilities; i++) {
      let type = Cookies.get('abilityType'+i);

      const info = _s.abilityTypes.find((t) => {
        return t.id == type;
      })

      if (!info) {
        type = _s.abilityTypeDefaults[i];
      }

      abilityTypes[i] = type;
    }

    this.setState({abilityTypes:abilityTypes});

    // ability keys
    let abilityKeys = [];
    for (let i = 0; i < _s.numAbilities; i++) {
      abilityKeys[i] = Cookies.get('abilityKey' + i) || _s.abilityKeyDefaults[i];
    }

    this.setState({abilityKeys:abilityKeys});

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
      console.log(serverInfo)
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

        // if (event.code == 1006) {
        //   setTimeout(() => {
        //     this.connectToServer();
        //   }, 500);
        // }
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
    // name
    let name = document.getElementById('nameInput').value;
    if (!name) {
      name = 'Noname_' + Math.round(Math.random()*1000);
    }
    name = name.substring(0, 24);
    Cookies.set('name', name);

    // abilities
    for (let i = 0; i < _s.numAbilities; i++) {
      Cookies.set('abilityKey' + i, document.getElementById('abilityKey' + i).value);
      Cookies.set('abilityType' + i, document.getElementById('abilityType' + i).value);
    }

    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      this.ws.send(JSON.stringify({t:'requestGame'}));
    }
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
          }
        `}</style>
      </button>
    )
  }


  renderKeyOptions(slotNum) {
    return (
      <select value={this.state.abilityKeys[slotNum]} id={'abilityKey' + slotNum} onChange={(event) => {this.changeAbilityKey(event, slotNum)}}>
        <option key="lmb" value="lmb">Left Mouse Button</option>
        <option key="mmb" value="mmb">Middle Mouse Button</option>
        <option key="rmb" value="rmb">Right Mouse Button</option>
        <option key="Space" value="Space">Spacebar</option>
        <option key="KeyQ" value="KeyQ">Q Key</option>
        <option key="KeyE" value="KeyE">E Key</option>
      </select>
    )
  }


  changeAbilityKey(event, slotNum) {
    const key = document.getElementById('abilityKey' + slotNum).value;
    let keys = this.state.abilityKeys;
    keys[slotNum] = key;
    this.setState({abilityKeys:keys});
  }


  renderAbilityTypes(slotNum) {
    let value = this.state.abilityTypes[slotNum];
    if (!value) {
      value = _s.abilityTypeDefaults[slotNum];
    }

    return (
      <select value={value} id={'abilityType' + slotNum} onChange={(event) => {this.abilityOptionsChanged(event, slotNum)}}>
        {this.renderAbilityOptions()}
      </select>

    )
  }

  renderAbilityOptions() {
    // clonse
    const types = _s.abilityTypes.slice(0);

    types.sort((a, b) => {
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });

    return types.map((t) => {
      return (
        <option key={t.id} value={t.id}>{t.name}</option>
      )
    })
  }

  abilityOptionsChanged(event, slotNum) {
    const type = document.getElementById('abilityType' + slotNum).value;

    let abilityTypes = this.state.abilityTypes;

    // don't allow duplicate abilities
    if (abilityTypes.includes(type)) {
      return;
    }

    abilityTypes[slotNum] = type;
    this.setState({abilityTypes:abilityTypes});
  }


  renderAbilityDescription(slotNum) {
    let description = '';

    const type = this.state.abilityTypes[slotNum];

    const info = _s.abilityTypes.find((a) => {
      return a.id == type;
    });

    if (info) {
      description = info.description;
    }

    return (
      <div>
        {description}
        <style jsx>{`
          div {
            font-family: 'Roboto', sans-serif;
          }
        `}</style>
      </div>
    )
  }


  renderAbilities() {
    let html = [];

    for (let i = 0; i < _s.numAbilities; i++) {
      html.push(
        <div className="ability" key={i}>
          <label>Ability {i+1}</label>
          <div className="abilityDropdowns">
            <div>{this.renderKeyOptions(i)}</div>
            <div></div>
            <div>{this.renderAbilityTypes(i)}</div>
          </div>
          {this.renderAbilityDescription(i)}
          <style jsx>{`
            .ability {
              background-color: hsl(203, 20%, 10%);
              padding: 20px;
              margin-bottom: 5px;
              border-radius: 3px;
            }
            label {
              display: block;
              margin-bottom: 10px;
              color: #91df3e;
            }
          `}</style>
          <style jsx global>{`
            .abilityDropdowns {
              display: grid;
              grid-template-columns: auto 10px auto;
              margin-bottom: 10px;
            }
            .abilityDropdowns select {
              width: 100%;
              padding: 5px;
              border-radius: 3px;
            }
          `}</style>
        </div>
      )
    }

    return html;
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
                  <input type="text" defaultValue={name} id="nameInput"></input>
                </div>
                {this.renderPlayButton()}

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
                {this.renderAbilities()}
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
            margin-top: 30px;
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
            grid-template-columns: 320px 10px auto;
            width: 900px;
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
