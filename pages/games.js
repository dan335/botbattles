import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
var moment = require('moment');
const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';



export default class Games extends React.Component {

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
      try {
        replays = await result.json();
      } catch (error) {
        console.error(error);
        console.log(result);
      }
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
          if (a.userId) {
            const url = '/player/' + a.userId;
            return (
              <div key={Math.random()}>
                <a href={url}>{a.name}</a>
                <style jsx>{`
                  div {
                    font-size: 70%;
                    margin-left: 20px;
                  }
                `}</style>
              </div>
            )
          } else {
            return (
              <div key={Math.random()}>
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
        }
      })
    }
  }


  render() {

    return (
      <div>
        <MainLayout>
          <div className="constrain">
            <div id="content">
              <h1>Game History</h1>
              {this.props.games.map((game) => {
                return (
                  <div key={game._id} className="gameInfo">
                    <div className="name">{game._id.substring(game._id.length - 6)}</div>
                    <div className="info">
                      Ended: {moment(game.endedAt).format('lll')} &nbsp;&nbsp;
                      Lasted: {Math.round(game.length / 1000)} sec &nbsp;&nbsp;
                      {this.renderReplay(game)}
                    </div>
                    {
                      game.players.map((player) => {
                        const playerUrl = '/player/' + player.userId;
                        return (
                          <div className="playerInfo" key={Math.random()}>
                            <div className="playerName">
                              {player.userId ? (<a href={playerUrl}>{player.name}</a>) : player.name} &nbsp;&nbsp;
                              <span className="winner">{player.isWinner ? 'Winner' : ''}</span>
                            </div>
                            <div className="abilities">
                              {this.renderAbilities(player)}
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })}
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
          .name {
            font-size: 175%;
            margin-bottom: 10px;
            color: #91df3e;
          }
          .gameInfo {
            margin-bottom: 15px;
            background-color: hsl(203, 20%, 10%);
            padding: 20px;
            border-radius: 3px;
          }
          .playerInfo {
            margin-left: 20px;
            font-family: 'Roboto', sans-serif;
            margin-bottom: 10px;
          }
          .info {
            color: #aaa;
            margin-bottom: 10px;
            font-family: 'Roboto', sans-serif;
          }
          .playerName {
            font-size: 120%;
            margin-bottom: 4px;
          }
          .winner {
            color: #91df3e;
          }
          .abilities {
            color: #aaa;
          }
        `}</style>
      </div>
    )
  }
}
