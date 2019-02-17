import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';


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
      abilityTypes: []
    }

    this.playButton = this.playButton.bind(this);
    this.connectToServer = this.connectToServer.bind(this);
  }


  componentDidMount() {
    //document.getElementById('mainTable').style.height = window.innerHeight + 'px';

    this.findServer();

    // set ability type dropdowns
    for (let i = 0; i <= _s.numAbilities; i++) {
      let type = Cookies.get('abilityType'+i);

      const info = _s.abilityTypes.find((t) => {
        return t.id == type;
      })

      if (!info) {
        type = _s.abilityTypeDefaults[i];
      }

      let obj = {};
      obj['abilityType'+i] = type;
      this.setState(obj);
    }
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
    // name
    let name = document.getElementById('nameInput').value;
    if (!name) {
      name = 'Noname';
    }
    name = name.substring(0, 24);
    Cookies.set('name', name);

    // abilities
    for (let i = 0; i < _s.numAbilities; i++) {
      Cookies.set('abilityKey' + i, document.getElementById('abilityKey' + i).value);
      Cookies.set('abilityType' + i, document.getElementById('abilityType' + i).value);
    }

    this.ws.send(JSON.stringify({t:'requestGame'}));
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
    let defaultValue = {};

    for (let i = 0; i < _s.numAbilities; i++) {
      defaultValue['slot' + i] = Cookies.get('abilityKey' + i) || _s.abilityKeyDefaults[i];
    }

    return (
      <select defaultValue={defaultValue['slot'+slotNum]} id={'abilityKey' + slotNum}>
        <option key="lmb" value="lmb">Left Mouse Button</option>
        <option key="mmb" value="mmb">Middle Mouse Button</option>
        <option key="rmb" value="rmb">Right Mouse Button</option>
        <option key="Space" value="Space">Spacebar</option>
        <option key="KeyQ" value="KeyQ">Q Key</option>
        <option key="KeyE" value="KeyE">E Key</option>
      </select>
    )
  }


  renderAbilityTypes(slotNum) {
    let value = this.state['abilityType' + slotNum];
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
    return _s.abilityTypes.map((t) => {
      return (
        <option key={t.id} value={t.id}>{t.name}</option>
      )
    })
  }

  abilityOptionsChanged(event, slotNum) {
    const type = document.getElementById('abilityType' + slotNum).value;
    let obj = {};
    obj['abilityType'+slotNum] = type;
    this.setState(obj);
  }


  renderAbilityDescription(slotNum) {
    let description = '';

    const type = this.state['abilityType' + slotNum];

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
          {this.renderKeyOptions(i)}
          {this.renderAbilityTypes(i)}
          <br/><br/>
          {this.renderAbilityDescription(i)}
          <style jsx>{`
            .ability {
              background-color: hsl(203, 20%, 10%);
              padding: 20px;
              margin-bottom: 5px;
            }
            label {
              display: block;
              margin-bottom: 10px;
              color: #91df3e;
            }
          `}</style>
        </div>
      )
    }

    return html;
  }


  render() {
    let name = Cookies.get("name");
    if (!name) {
      name = 'Noname';
    }

    return (
      <div>
        <MainLayout>
          <table id="mainTable">
            <tbody>
              <tr colSpan="2" id="topBox">
                <td colSpan="2">
                  <h1 id="logo">Astro Arena</h1>
                  <h2 id="tagline">Multiplayer Online Battle Arena</h2>
                </td>
              </tr>
              <tr>
                <td id="left">
                  <div id="inputContainer">
                    <label>Name</label>
                    <input type="text" defaultValue={name} id="nameInput"></input>
                  </div>
                  {this.renderPlayButton()}
                </td>
                <td id="right">
                  {this.renderAbilities()}
                </td>
              </tr>
            </tbody>
          </table>
          <div id="bottomLeft">
            <a href="http://bongo.games"><button>More io Games</button></a>
          </div>
          <TopMenu user={this.props.user} />
        </MainLayout>
        <style jsx>{`
          table {
            width: 900px;
            margin-left: auto;
            margin-right: auto;
          }
          #topBox {
            text-align: center;
            width: 100%;
          }
          td {
            vertical-align: top;
          }
          td#left {
            text-align:center;
            padding: 20px;
            width: 50%;
          }
          td#right {
            padding: 20px;
            width: 50%;
          }
          #logo {
            color: #91df3e;
            font-size: 400%;
            margin-bottom: 5px;
            margin-top: 40px;
          }
          #tagline {
            font-size: 100%;
            margin-top: 0;
          }
          label {
            display: block;
            margin-bottom: 10px;
            color: #91df3e;
          }
          #bottomLeft {
            position: absolute;
            left: 20px;
            bottom: 20px;
          }
          #inputContainer {
            text-align: left;
            margin-bottom: 40px;
          }
        `}</style>
      </div>
    )
  }
}
