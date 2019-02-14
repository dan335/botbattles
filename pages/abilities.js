import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';



export default class Abilities extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const result = await fetch(process.env.API_URL + '/api/abilities', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
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


  render() {
    return (
      <div>
        <MainLayout>
          <div>
            <div className="constrain">
              <div id="content">
                <h1>Abilities</h1>
                {this.props.abilities.map((ability) => {
                  return (
                    <div className="ability" key={ability._id}>
                      <div className="name">{ability.name}</div>
                      <div className="description">{ability.description}</div>
                      <div className="info">
                        Uses: {ability.uses} ({Math.round(ability.uses / this.props.maxUses * 10000) / 100}%) &nbsp;&nbsp;&nbsp;
                        Wins: {ability.wins} ({Math.round(ability.wins / this.props.maxUses * 10000) / 100}%)
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
            margin-bottom: 20px;
          }
          .name {
            font-size: 175%;
            margin-bottom: 10px;
          }
          .description {
            color: #aaa;
            margin-bottom: 10px;
          }
          .info {
            color: #aaa;
          }
        `}</style>
      </div>
    )
  }
}
