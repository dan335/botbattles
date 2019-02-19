import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';
import GameBlock from '../components/GameBlock.js';




export default class Login extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    var player = null;
    const playerResult = await fetch(process.env.API_URL + '/api/user', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({userId:query.userId})
    })

    if (playerResult.status == 200) {
      player = await playerResult.json();
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

    let games = [];
    if (player) {
      const gamesResult = await fetch(process.env.API_URL + '/api/gamesWithUser', {
        method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        body: JSON.stringify({userId:player._id})
      });
      if (gamesResult.status == 200) {
        games = await gamesResult.json();
      }
    }


    const replaysResult = await fetch(process.env.API_URL + '/api/replays', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    let replays = [];
    if (replaysResult.status == 200) {
      try {
        replays = await replaysResult.json();
      } catch (error) {
        console.error(error);
      }
    }

    return {userId:userId, player:player, user:user, games:games, replays:replays};
  }

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    if (this.props.player) {

      const num = Math.min(5, this.props.games.length);

      let wins = 0;
      let plays = 0;
      let kills = 0;
      let damage = 0;

      for (let i = 0; i < num; i++) {
        const player = this.props.games[i].players.find((p) => {
          return p.userId == this.props.player._id;
        })

        if (player.isWinner) {
          wins++;
        }
        plays++;
        kills += player.kills;
        damage += player.damage;
      }

      return (
        <div>
          <MainLayout>
            <div>
              <div className="constrain">
                <div id="content">
                  <h1>{this.props.player.username}</h1>

                  <h2>{this.props.player.plays} Games</h2>
                  <div className="block">
                    <table>
                      <tbody>
                        <tr>
                          <td>Wins</td><td>{this.props.player.wins}</td><td>{(this.props.player.wins / this.props.player.plays * 100) + '%'}</td>
                        </tr>
                        <tr>
                          <td>Kills</td><td>{this.props.player.kills}</td><td>{this.props.player.kills / this.props.player.plays} Per Game</td>
                        </tr>
                        <tr>
                          <td>Damage Dealt</td><td>{this.props.player.damage}</td><td>{this.props.player.damage / this.props.player.plays} Per Game</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2>Last {num} Games</h2>
                  <div className="block">
                    <table>
                      <tbody>
                        <tr>
                          <td>Wins</td><td>{wins}</td><td>{(wins / plays * 100) + '%'}</td>
                        </tr>
                        <tr>
                          <td>Kills</td><td>{kills}</td><td>{kills / plays} Per Game</td>
                        </tr>
                        <tr>
                          <td>Damage Dealt</td><td>{damage}</td><td>{damage / plays} Per Game</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h2>Recent Games</h2>
                  {this.props.games.map((game) => {
                    const replay = this.props.replays.find((r) => {
                      return r.gameId == game._id;
                    })

                    return (<GameBlock game={game} replay={replay} key={game._id} />)
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
            .block {
              background-color: hsl(203, 20%, 10%);
              padding: 20px;
              border-radius: 3px;
            }
            td {
              padding: 5px 20px 5px 0px;
            }
            td:nth-child(2) {
              text-align: right;
            }
          `}</style>
        </div>
      )

    } else {
      return (
        <div>
          <MainLayout>
            <div className="constrain">
                User not found.
            </div>
            <TopMenu user={this.props.user} />
          </MainLayout>
          <style jsx>{`
            .constrain {
              padding: 10px;
              max-width: 900px;
              margin-right: auto;
              margin-left: auto;
            }
          `}</style>
        </div>
      )
    }

  }
}
