import MainLayout from '../layouts/MainLayout.js';
import TopMenu from '../components/TopMenu.js';
import fetch from 'isomorphic-unfetch';
import * as Cookies from 'js-cookie';
import Abilities from '../components/Abilities.js';
var hri = require('human-readable-ids').hri;
import copy from 'copy-to-clipboard';
var moment = require('moment');


export default class PrivacyPolicy extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

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

    const serverResult = await fetch(process.env.API_URL + '/api/server', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({serverId:query.serverId})
    });

    let server = null;
    if (serverResult.status == 200) {
      server = await serverResult.json();
    }

    return {userId:userId, user:user, server:server, partyId:query.partyId};
  }



  constructor(props) {
    super(props);

    this.ws = null;

    this.state = {
      isWsOpen: false,
      memberId: null,
      members: [],
      chat: []
    }

    this.connectToServer = this.connectToServer.bind(this);
    this.setReady = this.setReady.bind(this);
    this.submitChat = this.submitChat.bind(this);
  }



  componentDidMount() {
    this.connectToServer();
    this.sendPings();
    this.scrollToBottomOfChat();
  }


  componentDidUpdate(prevProps) {
    this.scrollToBottomOfChat();
  }


  componentWillUnmount() {
    if (this.ws) {
      this.ws.close();
    }
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



  connectToServer() {
    if (this.props.server) {
      this.ws = new WebSocket(this.props.server.address);

      this.ws.onopen = (event) => {

        // name
        let name = Cookies.get('name');

        if (this.user) {
          name = this.user.username;
        }

        if (!name) {
          name = 'Noname_' + Math.round(Math.random()*1000);
        }

        this.setState({isWsOpen: true});

        this.setState({memberId: hri.random()});

        this.sendJson({
          t: 'joinParty',
          partyId: this.props.partyId,
          name: name,
          id: this.state.memberId
        });
      }

      this.ws.onmessage = (event) => {
        const json = JSON.parse(event.data);

        if (json) {
          switch (json.t) {
            case 'gameId':
              window.location.href = '/game/' + this.props.server._id + '/' + json.gameId + '/' + this.props.partyId;
              break;

            case 'partyMembers':
              this.setState({members: json.list});
              break;

            case 'partyChat':
              this.setState({chat: json.chat});
              break;
          }
        }
      };

      this.ws.onclose = (event) => {
        this.setState({isWsOpen:false});
      }
    }
  }


  sendJson(json) {
    if (this.ws && this.ws.readyState == 1) {
      this.ws.send(JSON.stringify(json));
    }
  }


  setReady(isReady) {
    let json = {
      t: 'setReady',
      isReady: isReady
    }

    this.sendJson({
      t: 'setReady',
      isReady: isReady,
      partyId: this.props.partyId
    });
  }


  renderReady(member) {
    if (member.id == this.state.memberId) {
      return (
        <div>
          <input type="checkbox" onClick={() => {this.setReady(!member.isReady)}}/>
          &nbsp;
          <span className={member.isReady ? 'green' : ''}>Ready</span>
          <style jsx>{`
            input {
              width: auto;
            }
            .green {
              color: #91df3e;
            }
          `}</style>
        </div>
      )
    } else {
      if (member.isReady) {
        return 'Ready';
      }
    }
  }



  submitChat() {
    const elm = document.getElementById('chatInput');
    if (!elm) return;
    const text = elm.value.trim();
    if (!text.length) return;

    this.sendJson({
      t: 'partyChatMessage',
      partyId: this.props.partyId,
      text: text
    });

    elm.value = '';
  }


  scrollToBottomOfChat() {
    const element = document.getElementById('chatsContainer');
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }



  renderMidBox() {
    if (this.state.isWsOpen) {
      return (
        <div id="midBox">
          <div id="instructions">
            Share this url to invite people.  The game starts when everyone checks "Ready".
          </div>
          <div>
            {this.state.members.map((member) => {
              return (
                <div key={member.id} className="member contentBox roboto">
                  <div className={member.id == this.state.memberId ? 'name self' : 'name'}>
                    {member.name}
                  </div>
                  <div className="ready">
                    {this.renderReady(member)}
                  </div>
                </div>
              )
            })}
          </div>
          <div></div>
          <div id="chat" className="contentBox roboto">
            <div id="chatTitle">Chat</div>
            <div id="chatsContainer">
              {this.state.chat.map((chat) => {
                return (
                  <div key={chat.id} className="chatMessage">
                    <span className="chatName">{chat.name}</span>: {chat.text} <span className="chatDate">{moment(chat.date).format('LT')}</span>
                  </div>
                )
              })}
            </div>
            <div id="chatInputContainer">
              <div><input type="text" id="chatInput" onKeyDown={(event) => {if (event.keyCode == 13) {this.submitChat();}}} /></div>
              <div></div>
              <div><button onClick={this.submitChat}>Submit</button></div>
            </div>
          </div>
          <div></div>
          <div>
            <Abilities />
          </div>
          <style jsx>{`
            #chat {
              padding: 10px;
            }
            #chatTitle {
              padding: 10px;
            }
            .chatName {
              color: #91df3e;
            }
            .chatDate {
              color: #666;
            }
            .chatMessage {
              margin-bottom: 8px;
            }
            #chatsContainer {
              max-height: 450px;
              overflow-y: auto;
              word-break: break-all;
              font-size: 80%;
              padding: 0px 10px;
            }
            input {
              padding: 6px 10px 6px 10px;
            }
            #chatInputContainer {
              display: grid;
              grid-template-columns: auto 5px auto;
              padding: 10px;
            }
            a {
              cursor: pointer;
            }
            #instructions {
              grid-column: 1 / span 5;
              margin-bottom: 20px;
              margin-top: 20px;
              border-radius: 3px;
              font-size: 120%;
              text-align: center;
            }
            .member {
              padding: 10px;
              display: grid;
              grid-template-columns: auto auto;
            }
            .self {
              color: #91df3e;
            }
            .ready {
              text-align: right;
            }
            #midBox {
              display: grid;
              grid-template-columns: auto 5px 350px 5px 450px;
            }
            @media only screen and (max-width:1200px) {
              #midBox {
                display: block;
              }
            }
          `}</style>
        </div>
      )
    } else {
      return (
        <div>
          Not connected to server.
          <br/><br/>
          <button onClick={this.connectToServer}>Retry</button>
          <style jsx>{`
            div {
              padding: 20px;
            }
          `}</style>
        </div>
      )
    }
  }



  render() {
    if (!this.props.server) {
      return (
        <div>Server not found.  Create a party by clicking on link on front page.</div>
      )
    }

    const url = 'https://botbattles.io/party/' + this.props.server._id + '/' + this.props.partyId;

    return (
      <div>
        <MainLayout>
        <TopMenu user={this.props.user} />
        <div className="contentContainer">
          <div className="contentBox">
            <h1>Party: <span className="green">{this.props.partyId}</span></h1>
            <div id="url">
              <span id="urlText">{url}</span>
              &nbsp;&nbsp;&nbsp;
              <a id="copyLink" onClick={() => { const isCopied = copy(url); if (isCopied) {document.getElementById('copyLink').innerHTML='copied';} }}>copy</a>
            </div>
          </div>
          {this.renderMidBox()}
        </div>
        </MainLayout>
        <style jsx>{`
          #top {
            background-color: hsl(203, 30%, 15%);
            margin-top: 20px;
            padding: 20px;
            border-radius: 3px;
            max-width: 1000px;
            margin-right: auto;
            margin-left: auto;
          }
          #url {
            text-align: center;
            font-family: 'Roboto', sans-serif;
          }
          #urlText {
            -webkit-user-select: all;
            -moz-user-select: all;
            -ms-user-select: all;
            user-select: all;
            color: #999;
          }
          a {
            cursor: pointer;
          }
          h1 {
            font-family: 'Audiowide', sans-serif;
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}
