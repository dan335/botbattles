import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';
const _s = require('../lib/settings.js');


export default class Combos extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    let sort = 'alphabetical';
    if (query.sort) {
        sort = query.sort;
    }

    const result = await fetch(process.env.API_URL + '/api/combos', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({sort:sort, category:query.category})
    })

    var combos = await result.json();

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

    const maxResult = await fetch(process.env.API_URL + '/api/combosmasuses', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    })
    var usesResult = await maxResult.json();

    return {userId:userId, combos:combos, user:user, maxUses:usesResult.uses, query:query};
  }

  constructor(props) {
    super(props);
    this.state = {};
  }


  renderSorting() {
    const data = [
      {name:'Uses', id:'uses'},
      {name:'Wins', id:'wins'},
      {name:'Win Percentage', id:'winPercent'},
    ]

    return data.map((d) => {
      let url = '/combos/sort/' + d.id;

      if (this.props.query.category) {
        url += '/category/' + this.props.query.category;
      }

      let selected = false;

      if (this.props.query.sort == d.id) {
        selected = true;
      }

      if (d.id == 'winPercent' && !this.props.query.sort) {
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
            <h1 className="audiowide">Ability Combinations</h1>

            <div id="sortContainer">
              <div className="roboto">
                Sort: &nbsp;&nbsp;
                {this.renderSorting()}
              </div>
            </div>

            <div id="comboContainer">
              {this.props.combos.map((combo) => {

                let name = '';

                combo.abilityIds.forEach((id) => {
                  const info = _s.abilityTypes.find((t) => {
                    return t.id == id;
                  })
                  if (info) {
                    name += info.name + ', ';
                  }
                })

                return (
                  <div className="combo roboto" key={combo._id}>
                    <div className="comboTop">
                      <div className="name audiowide">{name}</div>
                    </div>

                    <div className="comboBottom">
                      <div className="info">
                        Uses: {combo.uses} ({Math.round(combo.uses / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Wins: {combo.wins} ({Math.round(combo.wins / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Win Percentage: {combo.winPercent ? Math.round(combo.winPercent * 10000) / 100 : 0}%
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
          #comboContainer {
            display: grid;
            grid-template-columns: auto auto;
            grid-column-gap: 10px;
            grid-row-gap: 10px;
          }
          .combo {
          }
          .comboTop {
            padding: 10px 20px 10px 20px;
            background-color: hsl(203, 30%, 20%);
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }
          .comboBottom {
            padding: 10px 20px 20px 20px;
            background-color: hsl(203, 30%, 15%);
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
          }
          .name {
            font-size: 125%;
            color: #91df3e;
          }
          .description {
            color: #ddd;
            margin-bottom: 15px;
            font-size: 110%;
          }
          .info {
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
