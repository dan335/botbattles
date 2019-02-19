import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';
import GameBlock from '../components/GameBlock.js';




export default class Login extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const playerResult = await fetch(process.env.API_URL + '/api/user', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({userId:query.userId})
    })

    if (playerResult.status == 200) {
      var player = await playerResult.json();
    } else {
      var player = null;
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

    const serverResult = await fetch(process.env.API_URL + '/api/gamesWithUser', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({userId:userId})
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

      const num = Math.min(3, this.props.games.length);

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

                  Games Played: {this.props.player.plays}<br/>
                  Wins: {this.props.player.wins}<br/>
                  Kills: {this.props.player.kills}<br/>
                  Damage Dealt: {this.props.player.damage}<br/>
                  Win Rate: {(this.props.player.wins / this.props.player.plays * 100) + '%'}<br/>
                  Kills Per Game: {this.props.player.kills / this.props.player.plays}<br/>
                  Damage Per Game: {this.props.player.damage / this.props.player.plays}<br/>

                  <h2>Last {num} Games</h2>
                  Wins: {wins}<br/>
                  Kills: {kills}<br/>
                  Damage Dealt: {damage}<br/>
                  Win Rate: {(wins / plays * 100) + '%'}<br/>
                  Kills Per Game: {kills / plays}<br/>
                  Damage Per Game: {damage / plays}<br/>

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
