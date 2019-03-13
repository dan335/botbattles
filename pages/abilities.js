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
      body: JSON.stringify({sort:sort, category:query.category})
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

    return {userId:userId, abilities:abilities, user:user, maxUses:usesResult.uses, query:query};
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
          <span key={info.id}>{info.name},&nbsp;</span>
        )
      }
    }

    return html;
  }



  renderCategories() {
    return _s.abilityCategories.map((cat) => {

      let url = '/abilities';
      if (this.props.query.sort) {
        url += '/sort/' + this.props.query.sort;
      }

      url += '/category/' + cat.id;

      return (
        <a href={url} key={cat.id}><button className={this.props.query.category == cat.id ? 'selected' : ''}>{cat.name}</button></a>
      )
    })
  }


  renderSorting() {
    const data = [
      {name:'Alphabetical', id:'alphabetical'},
      {name:'Uses', id:'uses'},
      {name:'Wins', id:'wins'},
      {name:'Win Percentage When Used', id:'winPercent'},
    ]

    return data.map((d) => {
      let url = '/abilities/sort/' + d.id;

      if (this.props.query.category) {
        url += '/category/' + this.props.query.category;
      }

      let selected = false;

      if (this.props.query.sort == d.id) {
        selected = true;
      }

      if (d.id == 'alphabetical' && !this.props.query.sort) {
        selected = true;
      }


      return (
        <a href={url} key={d.id}><button className={selected ? 'selected' : ''}>{d.name}</button></a>
      )
    })
  }




  render() {
    let allCatUrl = '/abilities';
    if (this.props.query.sort) {
      allCatUrl += '/sort/' + this.props.query.sort;
    }

    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />
          <div className="contentContainer">
            <h1 className="audiowide">{this.props.abilities.length} Abilities</h1>

            <div id="sortContainer">
              <div className="roboto">
                Sort: &nbsp;&nbsp;
                {this.renderSorting()}
              </div>
              <br/>

              <div className="roboto">
                Categories: &nbsp;&nbsp;
                <a href={allCatUrl} key="all"><button className={!this.props.query.category ? 'selected': ''}>All</button></a>
                {this.renderCategories()}
              </div>
            </div>

            <div id="abilityContainer">
              {this.props.abilities.map((ability) => {
                const winPercent = ability.wins / ability.uses;
                const info = _s.abilityTypes.find((t) => {
                  return t.id == ability.abilityId;
                })

                return (
                  <div className="ability roboto" key={ability._id}>
                    <div className="abilityTop">
                      <div className="name audiowide">{ability.name}</div>
                    </div>

                    <div className="abilityBottom">

                      <div className="description">{ability.description}</div>

                      <div className="info">
                        Uses: {ability.uses} ({Math.round(ability.uses / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Wins: {ability.wins} ({Math.round(ability.wins / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Win Percentage: {winPercent ? Math.round(winPercent * 10000) / 100 : 0}%
                      </div>
                      <div className="usedWith">
                        Most often used with &nbsp;
                        {this.renderUsedWith(ability)}
                      </div>

                      <div className="categories">
                        {info.categories.map((cat) => {
                          const catInfo = _s.abilityCategories.find((c) => {
                            return c.id == cat;
                          });
                          return <span className="category" key={cat}>{catInfo.name}</span>
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
          h1 {
            text-align: center;
          }
          #sortContainer {
            padding: 20px;
            background-color: hsl(203, 30%, 15%);
            margin-bottom: 10px;
            border-radius: 3px;
          }
          #abilityContainer {
            display: grid;
            grid-template-columns: auto auto;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
          }
          .ability {
          }
          .abilityTop {
            padding: 10px 20px 10px 20px;
            background-color: hsl(203, 30%, 20%);
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }
          .abilityBottom {
            padding: 10px 20px 20px 20px;
            background-color: hsl(203, 30%, 15%);
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
          }
          .name {
            font-size: 175%;
            color: #91df3e;
          }
          .description {
            color: #ddd;
            margin-bottom: 15px;
            font-size: 110%;
          }
          .info {
            font-size: 80%;
            color: hsl(203, 0%, 75%);
          }
          .usedWith {
            margin-top: 15px;
            font-size: 80%;
            color: hsl(203, 0%, 75%);
          }
          ul {
            margin: 5px 0 0 0;
          }
          .categories {
            margin-top: 15px;
          }
          .category {
            border: 1px solid hsl(203, 40%, 40%);
            border-radius: 2px;
            padding: 3px 10px;
            margin-right: 5px;
            font-size: 80%;
          }
        `}</style>
      </div>
    )
  }
}
