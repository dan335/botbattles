import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
var moment = require('moment');
const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';



export default class Replays extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const serverResult = await fetch(process.env.API_URL + '/api/games', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    let games = [];
    if (serverResult.status == 200) {
      games = await serverResult.json();
    }

    const result = await fetch(process.env.API_URL + '/api/replays', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    let replays = [];
    if (serverResult.status == 200) {
      replays = await result.json();
    }

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

    return {games:games, replays:replays, user:user};
  }


  constructor(props) {
    super(props);

    this.state = {};
  }



  renderReplay(game) {
    const replay = this.props.replays.find((r) => {
      return r.gameId == game._id;
    })

    if (replay) {
      const url = '/replay/' + replay._id;

      return (
        <a href={url}>View Replay</a>
      )
    }
  }


  renderAbilities(player) {
    if (player.abilities) {
      return player.abilities.map((ability) => {
        const a = _s.abilityTypes.find((t) => {
          return t.id == ability.id;
        })

        if (a) {
          return (
            <div>
              {a.name}
              <style jsx>{`
                div {
                  font-size: 70%;
                  margin-left: 20px;
                }
              `}</style>
            </div>
          )
        }
      })
    }
  }


  render() {

    return (
      <div>
        <MainLayout>
          <div id="page">
            Replays exist until the server restarts.  Only the first 5 minutes are recorded.
            <br/><br/>
            <h1>Games</h1>
            {this.props.games.map((game) => {
              return (
                <div key={game._id} className="gameInfo">
                  <div>
                    Ended: {moment(game.endedAt).format('lll')} &nbsp;&nbsp;
                    Lasted: {Math.round(game.length / 1000)} sec &nbsp;&nbsp;
                    {this.renderReplay(game)}
                  </div>
                  {
                    game.players.map((player) => {
                      const playerUrl = '/player/' + player.userId;
                      return (
                        <div className="playerInfo" key={Math.random()}>
                          <div>
                            {player.userId ? (<a href={playerUrl}>{player.name}</a>) : player.name} &nbsp;&nbsp;
                            {player.isWinner ? 'Winner' : ''}
                          </div>
                          {this.renderAbilities(player)}
                        </div>
                      )
                    })
                  }
                </div>
              )
            })}
          </div>
          <TopMenu user={this.props.user} />
        </MainLayout>
        <style jsx>{`
          #page {
            padding: 20px;
          }
          .gameInfo {
            margin-bottom: 20px;
          }
          .playerInfo {
            margin-left: 20px;
          }
        `}</style>
      </div>
    )
  }
}
