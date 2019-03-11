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
          <li key={info.id}>{info.name}</li>
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
          <div>
            <div className="constrain">
              <div id="content">
                <h1 className="audiowide">{this.props.abilities.length} Abilities</h1>

                <div>
                  Sort: &nbsp;&nbsp;
                  {this.renderSorting()}
                </div>
                <br/>

                <div>
                  Categories: &nbsp;&nbsp;
                  <a href={allCatUrl} key="all"><button className={!this.props.query.category ? 'selected': ''}>All</button></a>
                  {this.renderCategories()}
                </div>
                <br/>

                {this.props.abilities.map((ability) => {
                  const winPercent = ability.wins / ability.uses;
                  const info = _s.abilityTypes.find((t) => {
                    return t.id == ability.abilityId;
                  })

                  return (
                    <div className="ability" key={ability._id}>
                      <div className="name audiowide">{ability.name}</div>
                      <div className="description">{ability.description}</div>
                      <div className="categories">
                        Categories: &nbsp;&nbsp;
                        {info.categories.map((cat) => {
                          const catInfo = _s.abilityCategories.find((c) => {
                            return c.id == cat;
                          });
                          return <span className="category" key={cat}>{catInfo.name}</span>
                        })}
                      </div>
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
        </MainLayout>
        <style jsx>{`
          #content {
            font-family: 'Roboto', sans-serif;
            background-color: hsl(203, 30%, 15%);
            margin-top: 20px;
            padding: 20px;
            border-radius: 3px;
          }
          .audiowide {
              font-family: 'Audiowide', sans-serif;
          }
          .constrain {
            max-width: 900px;
            margin-right: auto;
            margin-left: auto;
          }
          .ability {
            margin-bottom: 15px;
            background-color: hsl(203, 30%, 10%);
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
          }
          .info {
            color: #aaa;
          }
          .usedWith {
            color: #aaa;
            margin-top: 10px;
          }
          ul {
            margin: 5px 0 0 0;
          }
          .categories {
            color: #aaa;
            margin-bottom: 10px;
          }
          .category {
            border: 1px solid hsl(203, 40%, 40%);
            border-radius: 2px;
            padding: 3px 10px;
            margin-right: 5px;
          }
        `}</style>
      </div>
    )
  }
}
