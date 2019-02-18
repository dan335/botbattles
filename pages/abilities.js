import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';
const _s = require('../lib/settings.js');



export default class Abilities extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    let sort = 'alphabetical';
    if (query.sort) {
        sort = query.sort;
    }

    const result = await fetch(process.env.API_URL + '/api/abilities', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({sort:sort})
    })

    var abilities = await result.json();

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

    const maxResult = await fetch(process.env.API_URL + '/api/abilitymaxuses', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    })
    var usesResult = await maxResult.json();

    return {userId:userId, abilities:abilities, user:user, maxUses:usesResult.uses};
  }

  constructor(props) {
    super(props);
    this.state = {};
  }



  renderUsedWith(ability) {
    if (!ability.usedWith) return;

    ability.usedWith.sort((a, b) => {
      return b.uses - a.uses;
    })

    const num = Math.min(ability.usedWith.length, 6);

    let html = [];

    for (let i = 0; i < num; i++) {
      const info = _s.abilityTypes.find((a) => {
        return a.id == ability.usedWith[i].id;
      })

      if (info) {
        html.push(
          <li key={info.id}>{info.name}</li>
        )
      }
    }

    return html;
  }




  render() {
    return (
      <div>
        <MainLayout>
          <div>
            <div className="constrain">
              <div id="content">
                <h1>{this.props.abilities.length} Abilities</h1>

                <div>
                  Sort: &nbsp;&nbsp;
                  <a href="/abilities/sort/alphabetical"><button>Alphabetical</button></a>
                  <a href="/abilities/sort/uses"><button>Uses</button></a>
                  <a href="/abilities/sort/wins"><button>Wins</button></a>
                  <a href="/abilities/sort/winPercent"><button>Win Percentage When Used</button></a>
                </div>
                <br/>

                {this.props.abilities.map((ability) => {
                  const winPercent = ability.wins / ability.uses;
                  return (
                    <div className="ability" key={ability._id}>
                      <div className="name">{ability.name}</div>
                      <div className="description">{ability.description}</div>
                      <div className="info">
                        Uses: {ability.uses} ({Math.round(ability.uses / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Wins: {ability.wins} ({Math.round(ability.wins / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Win percentage when used: {winPercent ? Math.round(winPercent * 10000) / 100 : 0}%
                      </div>
                      <div className="usedWith">
                        Most often used with:
                        <ul>
                          {this.renderUsedWith(ability)}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <TopMenu user={this.props.user} />
        </MainLayout>
        <style jsx>{`
          #content {
            padding: 10px;
          }
          .constrain {
            max-width: 900px;
            margin-right: auto;
            margin-left: auto;
          }
          .ability {
            margin-bottom: 15px;
            background-color: hsl(203, 20%, 10%);
            padding: 20px;
            border-radius: 3px;
          }
          .name {
            font-size: 175%;
            margin-bottom: 10px;
            color: #91df3e;
          }
          .description {
            color: #ddd;
            margin-bottom: 10px;
            font-family: 'Roboto', sans-serif;
          }
          .info {
            color: #aaa;
            font-family: 'Roboto', sans-serif;
          }
          .usedWith {
            color: #aaa;
            font-family: 'Roboto', sans-serif;
            margin-top: 10px;
          }
          ul {
            margin: 5px 0 0 0;
          }
        `}</style>
      </div>
    )
  }
}
