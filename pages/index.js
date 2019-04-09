import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';
import BottomMenu from '../components/BottomMenu.js';
import functions from '../lib/functions.js';
import Abilities from '../components/Abilities.js';
var hri = require('human-readable-ids').hri;
var moment = require('moment');


export default class Index extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    let servers = [];
    const serverResult = await fetch(process.env.API_URL + '/api/servers', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (serverResult.status == 200) {
      servers = await serverResult.json();
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

    let chats = [];
    const chatResult = await fetch(process.env.API_URL + '/api/chats', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (chatResult.status == 200) {
      chats = await chatResult.json();
    }

    return {servers:servers, userId:userId, user:user, chats:chats};
  }



  constructor(props) {
    super(props);

    this.ws = null;

    this.state = {
      isWsOpen: false,
      server: null,
      serverInfo: [],
      namenumber: Math.round(Math.random()*1000),
      chats: props.chats
    }

    this.playButton = this.playButton.bind(this);
    this.connectToServer = this.connectToServer.bind(this);
    this.saveName = this.saveName.bind(this);
    this.connectToServerId = this.connectToServerId.bind(this);
    this.findServer = this.findServer.bind(this);
  }



  componentDidMount() {
    this.findServer();

    this.sendPings();

    this.getServerStats();

    setInterval(() => {
      this.getServerStats();
    }, 1000 * 5);

    if (!window.isDesktopApp) {
      aiptag.cmd.display.push(function() { aipDisplayTag.display('botbattles-io_970x90'); });
    }

    window.addEventListener( 'keydown', this, false );
  }


  componentDidUpdate(prevProps, prevState) {
    this.scrollChatToBottom();
  }


  componentWillUnmount() {
    this.ws.send(JSON.stringify({t:'leaveChat', roomId:'frontpage'}));
    this.ws.close();
    window.removeEventListener( 'keydown', this, false );
  }



  getServerStats() {
    let serverInfo = [];
    let promises = [];

    // promise.all can not handle rejections
    // so resolve if error
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
            resolve();
          }
        }
        xmlHttp.onerror = function() {
          resolve();
        }
        xmlHttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status != 200) {
            resolve();
          }
        }
        xmlHttp.send();
      }));
    });

    Promise.all(promises)
    .catch((error) => {

    })
    .then((result) => {
      serverInfo.forEach((server) => {
        server.games.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
      })

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




  // componentDidUpdate(prevProps, prevState) {
  //   // if we now have a server connect to it
  //   if (prevState.server != this.state.server) {
  //     this.connectToServer();
  //   }
  // }


  connectToServer() {
    if (this.state.server) {
      this.ws = new WebSocket(this.state.server.address);

      this.ws.onopen = (event) => {
        this.setState({isWsOpen: true});
        this.ws.send(JSON.stringify({t:'joinChat', roomId:'frontpage'}));
      }

      this.ws.onmessage = (event) => {
        const json = JSON.parse(event.data);
        if (json) {
          if (json.t == 'gameId') {
            window.location.href = '/game/' + this.state.server._id + '/' + json.gameId;
          } else if (json.t == 'chat') {
            this.setState({chats: [...this.state.chats, {
              msg: json.msg,
              name: json.name,
              time: Number(json.time)
            }]})
          }
        }
      };

      this.ws.onclose = (event) => {
        this.setState({isWsOpen:false});
      }
    }
  }



  findServer() {
    let promises = [];
    const now = Date.now();

    this.props.servers.forEach((server) => {
      promises.push(new Promise((resolve, reject) => {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.responseType = 'json';
        xmlHttp.open('GET', server.url + '/ping', true);
        xmlHttp.onload = function() {
          if (this.status == 200) {
            server.ping = Date.now() - now;
            resolve(server);
          } else {
            reject();
          }
        }
        xmlHttp.send();
      }))
    });

    // timeout
    promises.push(new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait);
        resolve(null);
      }, 5000);
    }))

    Promise.race(promises).then((server) => {
      if (server) {
        this.setState({server:server});
        this.connectToServer();
      }
    })
  }


  playButton(event) {
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      this.ws.send(JSON.stringify({t:'requestGame'}));
    }
  }


  saveName() {
    // name
    let name = document.getElementById('nameInput').value;
    if (name) {
      name = name.replace(/[^0-9a-zA-Z_\s]/g, '').trim();
    }
    if (!name || !name.length) {
      name = 'Noname_' + Math.round(Math.random()*1000);
    }
    name = name.substring(0, 32);
    Cookies.set('name', name);
  }


  renderPlayButton() {
    if (!this.state.isWsOpen || !this.state.server) {
      return (
        <div>
          <div>Connecting to server...</div>
          <br/>
          <div><button onClick={this.findServer}>Retry</button></div>
          <style jsx>{`
            button {
              margin-bottom: 30px;
            }
          `}</style>
        </div>
      )
    }

    return (
      <div>
        <button onClick={this.playButton}>
          Play
          <style jsx>{`
            button {
              font-size: 200%;
              padding: 10px 20px;
              margin-bottom: 20px;
            }
          `}</style>
        </button>
      </div>
    )
  }


  renderPartyButton() {
    if (this.state.server && this.state.isWsOpen) {
      const partyLink = '/party/' + this.state.server._id + '/' + hri.random();

      return (
        <div id="partyLink">
          or<br/>
          <a href={partyLink} onClick={this.saveName}>Create a party.</a>
        </div>
      )
    }
  }



  connectToServerId(serverId) {
    let server = this.props.servers.find((s) => {
      return s._id == serverId;
    })

    if (server) {
      this.setState({server:server});
      this.connectToServer();
    }
  }



  renderServerName(server) {
    if (server) {
      if (this.state.server && server.id == this.state.server._id && this.state.isWsOpen) {
        return (
          <span>
            {server.name}
            &nbsp;&nbsp;&nbsp;
            <span className="status">Connected</span>
            <style jsx>{`
              .status {
                color: #999;
              }
            `}</style>
          </span>
        )
      } else {
        return (
          <span>
            {server.name}
            &nbsp;&nbsp;&nbsp;
            <button onClick={() => {this.connectToServerId(server.id)}}>Connect</button>
          </span>
        )
      }
    }
  }


  scrollChatToBottom() {
    var elm = document.getElementById('chatTop');
    if (elm) {
      elm.scrollTop = elm.scrollHeight;
    }
  }


  handleEvent(event) {
    switch (event.type) {
      case 'keydown':
        if (event.keyCode == 13) {
          // enter
          const elm = document.getElementById('chatInput');
          if (elm) {
            if (elm == document.activeElement) {
              this.sendChat(elm.value);
              elm.value = '';
            } else {
              elm.focus();
            }
          }
        }
        break;
    }
  }


  sendChat(msg) {
    this.ws.send(JSON.stringify({
      t:'chat',
      msg: msg,
      roomId: 'frontpage',
      userId: this.props.userId
    }));
  }


  renderChatInput() {
    if (this.state.isWsOpen) {
      if (this.props.userId) {
        return (
          <input autoComplete="off" type="text" id="chatInput" placeholder="Press enter to chat." />
        )
      } else {
        return (
          <div>
            <a href="/login">Login</a> to chat.
          </div>
        )
      }
    } else {

    }
  }


  deleteChatMessage(chatId) {
    fetch('/api/deleteChat', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({chatId:chatId})
    }).then((result) => {
      if (result.status == 200) {
          window.location.href = '/';
        }
    })
  }


  renderModChatButton(chat) {
    if (this.props.user && this.props.user.isMod) {
      return (
        <span>
          &nbsp;&nbsp;
          <a onClick={() => {this.deleteChatMessage(chat._id)}}>x</a>
        </span>
      )
    }
  }


  render() {
    let name = 'Noname_' + this.state.namenumber;
    if (this.props.user) {
      name = this.props.user.username;
    } else if (Cookies.get('name')) {
      name = Cookies.get('name');
    }

    return (
      <div>
        <MainLayout bgColor="red">
          <TopMenu user={this.props.user} />

          <div className="contentContainer">
            <div id="logoContainer" className="contentBox">
              <h1 id="logo">
                Bot Battles
                {/*<img alt="Bot Battles" style={{verticalAlign:"text-bottom"}} src="/static/botbattlesLogo.png" />*/}
              </h1>
              <h2 id="tagline">
                MULTIPLAYER ONLINE ROBOTIC COMBAT ARENA
                {/*<img alt="MULTIPLAYER ONLINE ROBOTIC COMBAT ARENA" src="/static/botbattlesDesc.png" />*/}
              </h2>
            </div>

            <div id="midBox">
              <div>
                <div id="serverInfo">
                  {this.state.serverInfo.map((server) => {
                    return (
                      <div key={server.name} className="serverContainer">
                        <div className="serverTitle">
                          <div className="serverName">{this.renderServerName(server)}</div>
                          <div className="alignRight">{server.numPlayers} Players in {server.numGames} Games</div>
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

                <div id="chatContainer" className="contentBox">
                  <div id="chatSplitter">
                    <div id="chatTop">
                      {this.state.chats.map((chat) => {
                        return (
                          <div key={Math.random()} className="chatMsg">
                            <span className="green">{chat.name}</span>:
                            &nbsp;
                            {chat.msg}
                            &nbsp;&nbsp;
                            <span className="chatTime">{moment(chat.time).format('LTS')}</span>
                            {this.renderModChatButton(chat)}
                          </div>
                        )
                      })}
                    </div>
                    <div id="chatBottom">
                      {this.renderChatInput()}
                    </div>
                  </div>
                </div>
              </div>

              <div></div>

              <div id="leftBox">
                <div id="inputContainer" className="contentBox">
                  <label>Name</label>
                  <input type="text" defaultValue={name} id="nameInput" onChange={this.saveName}></input>
                </div>

                <div id="playButtonContainer">
                  {this.renderPlayButton()}
                  {this.renderPartyButton()}
                </div>
              </div>

              <div></div>

              <div>
                <Abilities />
              </div>

            </div>
          </div>
          <div id="adContainer">
            <div id='botbattles-io_970x90'></div>
          </div>
          <BottomMenu />
        </MainLayout>
        <style jsx>{`
          .contentContainer {
            margin-bottom: 20px;
          }
          #adContainer {
            text-align: center;
            margin-bottom: 80px;
          }
          #logoContainer {
            padding: 22px 0 18px 0;
            text-align: center;
            background-color: hsl(203, 30%, 20%);
          }
          #playButtonContainer {
            background-color: hsl(203, 30%, 20%);
            border-radius: 3px;
            padding: 20px;
            margin-bottom: 5px;
          }
          #serverInfo {
            font-family: 'Roboto', sans-serif;
            text-align: left;
            font-size: 90%;
            max-height: 225px;
            overflow-y: auto;
            margin-bottom: 10px;
          }
          .serverContainer {
            margin-bottom: 20px;
          }
          .serverTitle {
            display: grid;
            grid-template-columns: auto auto;
            background-color: hsl(203, 30%, 5%);
            padding: 10px;
            margin-bottom: 5px;
            border-radius: 3px;
          }
          .serverName {
          }
          .alignRight {
            text-align: right;
          }
          .gameInfo {
            display: grid;
            grid-template-columns: auto auto;
            background-color: hsl(203, 30%, 20%);
            padding: 10px;
            margin-bottom: 5px;
            border-radius: 3px;
          }
          #mainContainer {
            background-color: hsl(203, 30%, 20%);
          }
          #midBox {
            display: grid;
            grid-template-columns: 1fr 5px 250px 5px 1fr;
            border-radius: 6px;
          }

          @media only screen and (max-width:900px) {
            #midBox {
              display: block;
            }

            #serverInfo {
              display: none;
            }
          }

          @media only screen and (max-width:980px) {
            #adContainer {
              display: none;
            }
          }

          #leftBox {
            text-align: center;
          }

          #logo {
            margin: 0;
            margin-bottom: 0px;
            color: #91df3e;
            font-size: 300%;
          }
          #tagline {
            margin: 0;
            font-size: 90%;
          }
          label {
            display: block;
            margin-bottom: 10px;
            color: #91df3e;
          }
          #inputContainer {
            text-align: left;
          }

          #chatContainer {
            padding: 10px;
            border-radius: 3px;
            margin-bottom: 5px;
            font-family: 'Roboto', sans-serif;
          }
          #chatSplitter {
            display: grid;
            grid-template-rows: auto 31px;
            grid-row-gap: 5px;
          }
          #chatTop {
            overflow-y: auto;
            max-height: 225px;
            word-break: break-all;
            font-size: 90%;
          }
          #chatBottom {
            line-height: 31px;
          }
          .chatMsg {
            margin-bottom: 3px;
          }
          .chatTime {
            color: #777;
          }
        `}</style>
      </div>
    )
  }
}
