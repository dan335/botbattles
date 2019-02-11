import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');


export default class Index extends React.Component {

  static async getInitialProps({req, query}) {
    const serverResult = await fetch(process.env.API_URL + '/api/servers', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (serverResult.status == 200) {
      const servers = await serverResult.json();
      return {servers:servers};
    } else {
      return {servers:[]};
    }
  }



  constructor(props) {
    super(props);

    this.ws = null;

    this.state = {
      isWsOpen: false,
      server: null,
      abilityType1: null,
      abilityType2: null,
      abilityType3: null,
      abilityType4: null,
    }

    this.playButton = this.playButton.bind(this);
  }


  componentDidMount() {
    this.findServer();

    // set ability type dropdowns
    for (let i = 1; i <= 4; i++) {
      let type = Cookies.get('abilityType'+i);

      const info = _s.abilityTypes.find((t) => {
        return t.id == type;
      })

      if (!info) {
        type = 'Blasters';
      }

      let obj = {};
      obj['abilityType'+i] = type;
      this.setState(obj);
    }
  }




  componentDidUpdate(prevProps, prevState) {
    // if we now have a server connect to it
    if (prevState.server != this.state.server) {
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
    Cookies.set('abilityKey1', document.getElementById('abilityKey1').value);
    Cookies.set('abilityKey2', document.getElementById('abilityKey2').value);
    Cookies.set('abilityKey3', document.getElementById('abilityKey3').value);
    Cookies.set('abilityKey4', document.getElementById('abilityKey4').value);

    Cookies.set('abilityType1', document.getElementById('abilityType1').value);
    Cookies.set('abilityType2', document.getElementById('abilityType2').value);
    Cookies.set('abilityType3', document.getElementById('abilityType3').value);
    Cookies.set('abilityType4', document.getElementById('abilityType4').value);

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
        <div>Connecting to server...</div>
      )
    }

    return (
      <button onClick={this.playButton}>
        Play
        <style jsx>{`
          button {
            font-size: 150%;
          }
        `}</style>
      </button>
    )
  }


  renderKeyOptions(slotNum) {
    var defaultValue = {
      slot1: Cookies.get('abilityKey1') || _s.abilityKeyDefaults[0],
      slot2: Cookies.get('abilityKey2') || _s.abilityKeyDefaults[1],
      slot3: Cookies.get('abilityKey3') || _s.abilityKeyDefaults[2],
      slot4: Cookies.get('abilityKey4') || _s.abilityKeyDefaults[3]
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
      value = 'Blasters';
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
      <div>{description}</div>
    )
  }


  render() {
    let name = Cookies.get("name");
    if (!name) {
      name = 'Noname';
    }

    return (
      <div>
        <MainLayout>
          <div id="center">
            <h1 id="logo">Astro Arena</h1>
            <div id="tagline">Multiplayer Online Spaceship Battle Arena</div>
            <br/><br/>
            {this.renderPlayButton()}
            <br/><br/><br/>
            <div id="inputContainer">
              <label>Name</label>
              <input type="text" defaultValue={name} id="nameInput"></input>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>Ability 1</label>
                    {this.renderKeyOptions(1)}
                    {this.renderAbilityTypes(1)}
                    <br/><br/>
                    {this.renderAbilityDescription(1)}

                    <label>Ability 2</label>
                    {this.renderKeyOptions(2)}
                    {this.renderAbilityTypes(2)}
                    <br/><br/>
                    {this.renderAbilityDescription(2)}
                  </td>
                  <td>
                    <label>Ability 3</label>
                    {this.renderKeyOptions(3)}
                    {this.renderAbilityTypes(3)}
                    <br/><br/>
                    {this.renderAbilityDescription(3)}

                    <label>Ability 4</label>
                    {this.renderKeyOptions(4)}
                    {this.renderAbilityTypes(4)}
                    <br/><br/>
                    {this.renderAbilityDescription(4)}
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
          <div id="bottomRight">
            <a href="/replays"><button>Replays</button></a>
            {/* <a href="https://discord.gg/6R3jYyH"><button>Discord</button></a> */}
          </div>
          {/* <div id="bottomLeft">
            <a href="http://bongo.games"><button>More io Games</button></a>
          </div> */}
        </MainLayout>

        <style jsx>{`
          table {
            width: 800px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 30px;
          }
          td {
            text-align: left;
            padding: 0;
            margin: 0;
            vertical-align: top;
          }
          #center {
            text-align: center;
          }

          #bottomRight {
            position: absolute;
            right: 20px;
            bottom: 20px;
          }
          #bottomLeft {
            position: absolute;
            left: 20px;
            bottom: 20px;
          }

          #logo {
            font-size: 300%;
            margin-bottom: 5px;
          }
          #tagline {
            color: #bbb;
          }
          #inputContainer {
            width: 400px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }
          label {
            display: block;
            margin-top: 40px;
            margin-bottom: 5px;
          }
        `}</style>
      </div>
    )
  }
}
