import * as Cookies from 'js-cookie';
const _s = require('../lib/settings.js');
import functions from '../lib/functions.js';



export default class Abilities extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      abilityTypes: [],
      abilityKeys: []
    }
  }


  componentDidMount() {
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
  }


  saveAbilities() {
    // abilities
    for (let i = 0; i < _s.numAbilities; i++) {
      Cookies.set('abilityKey' + i, document.getElementById('abilityKey' + i).value);
      Cookies.set('abilityType' + i, document.getElementById('abilityType' + i).value);
    }
  }


  changeAbilityKey(event, slotNum) {
    const key = document.getElementById('abilityKey' + slotNum).value;
    let keys = this.state.abilityKeys;
    keys[slotNum] = key;
    this.setState({abilityKeys:keys});
    this.saveAbilities();
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
    this.saveAbilities();
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
            font-size: 85%;
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
              background-color: hsl(203, 30%, 10%);
              padding: 20px;
              margin-bottom: 5px;
              border-radius: 3px;
              text-align: left;
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
    return (
      <div>
        {this.renderAbilities()}
      </div>
    )
  }
}
