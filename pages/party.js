import MainLayout from '../layouts/MainLayout.js';
import TopMenu from '../components/TopMenu.js';
import fetch from 'isomorphic-unfetch';
import * as Cookies from 'js-cookie';
import Abilities from '../components/Abilities.js';
var hri = require('human-readable-ids').hri;
import copy from 'copy-to-clipboard';


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
      members: []
    }

    this.connectToServer = this.connectToServer.bind(this);
    this.setReady = this.setReady.bind(this);
  }



  componentDidMount() {
    this.connectToServer();
  }



  connectToServer() {
    if (this.props.server) {
      this.ws = new WebSocket(this.props.server.address);

      this.ws.onopen = (event) => {
        // name
        let name = Cookies.get('name');
        if (!name) {
          if (this.user) {
            name = this.user.username;
          } else {
            name = 'Noname_' + Math.round(Math.random()*1000);
          }
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
              window.location.href = '/game/' + this.props.server._id + '/' + json.gameId;
              break;

            case 'partyMembers':
              this.setState({members: json.list});
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



  renderMidBox() {
    const url = 'https://botbattles.io/party/' + this.props.server._id + '/' + this.props.partyId;

    if (this.state.isWsOpen) {
      return (
        <div id="midBox">
          <div id="instructions">
            Share this link to invite players.  Game starts when everyone clicks "Ready".
            <br/><br/>
            <div>
              {url}
              &nbsp;&nbsp;&nbsp;
              <a id="copyLink" onClick={() => { const isCopied = copy(url); if (isCopied) {document.getElementById('copyLink').innerHTML='copied';} }}>copy</a>
            </div>
          </div>
          <div>
            {this.state.members.map((member) => {
              return (
                <div key={member.id} className="member">
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
          <div>
            chat
          </div>
          <div></div>
          <div>
            <Abilities />
          </div>
          <style jsx>{`
            a {
              cursor: pointer;
            }
            #instructions {
              grid-column: 1 / span 5;
              background-color: hsl(203, 20%, 10%);
              margin-bottom: 10px;
              border-radius: 3px;
              padding: 10px;
            }
            .member {
              background-color: hsl(203, 20%, 10%);
              border-radius: 3px;
              padding: 10px;
              margin-bottom: 5px;
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
              grid-template-columns: 245px 10px 245px 10px auto;
              width: 1000px;
              margin-left: auto;
              margin-right: auto;
              padding: 20px;
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

    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />
          <h1>Party: <span className="green">{this.props.partyId}</span></h1>
          <div id="mainContainer">
            <div className="constrain">
              <div id="content">
                {this.renderMidBox()}
              </div>
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
          h1 {
            font-family: 'Audiowide', sans-serif;
            text-align: center;
          }
          .green {
            color: #91df3e;
          }
          #mainContainer {
            background-color: hsl(203, 20%, 20%);
          }

          #content {
            padding: 10px;
            font-family: 'Roboto', sans-serif;
          }
          .constrain {
            max-width: 900px;
            margin-right: auto;
            margin-left: auto;
          }
        `}</style>
      </div>
    )
  }
}
