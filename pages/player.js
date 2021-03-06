import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';
import GameBlock from '../components/GameBlock.js';
const _s = require('../lib/settings.js');




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
    this.state = {
      settingsError: null
    };
  }


  saveSettings(event) {
    let name = document.getElementById('nameInput').value;

    const settings = {name:name};

    fetch('/api/saveSettings', {
      method: 'post',
      headers: {'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify(settings)
    }).then((res) => {
      if (res.status == 200) {
        location.reload();
      } else {
        res.text().then((error) => {
          this.setState({settingsError:error});
        })
      }
    })
  }



  renderSettings() {
    if (this.props.userId && this.props.userId == this.props.player._id) {
      return (
        <div>
          <h2>Settings</h2>
          <div className="block roboto">
            {this.state.settingsError ? (<div id="settingsError">{this.state.settingsError}</div>) : ''}
            <label>Name</label>
            <input type="text" defaultValue={this.props.user.username} id="nameInput" />
            <button onClick={this.saveSettings.bind(this)}>Save</button>
          </div>
          <style jsx>{`
            #settingsError {
              background-color: hsl(0, 60%, 50%);
              color: #fff;
              padding: 10px;
              border-radius: 3px;
              margin-bottom: 20px;
            }
            .roboto {
              font-family: 'Roboto', sans-serif;
            }
            .block {
              background-color: hsl(203, 30%, 10%);
              padding: 20px;
              border-radius: 3px;
            }
            h2 {
              margin-bottom: 10px;
              margin-top: 40px;
            }
            button {
              margin-top: 20px;
            }
            label {
              margin-bottom: 15px;
              display: block;
            }
            input {
              max-width: 400px;
              display: block;
            }
          `}</style>
        </div>
      )
    }
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

      let abilities = [];

      this.props.games.forEach((game) => {
        game.players.forEach((player) => {
          if (player.userId == this.props.player._id) {
            player.abilities.forEach((ability) => {
              var data = abilities.find((a) => {
                return a.id == ability.id;
              })

              if (!data) {
                data = {
                  id: ability.id,
                  wins: 0,
                  uses: 0,
                  kills: 0,
                  damage: 0
                }
                abilities.push(data);
              }

              data.uses++;
              if (player.isWinner) {
                data.wins++;
              }
              data.kills += player.kills;
              data.damage += player.damage;
            })
          }
        })
      })

      abilities = abilities.map((ability) => {
        const a = _s.abilityTypes.find((ab) => {
          return ab.id == ability.id;
        })
        if (a) {
          ability.name = a.name;
        }
        return ability;
      })

      abilities.sort((a,b) => {
        return b.uses - a.uses;
      })

      return (
        <div>
          <MainLayout>
            <TopMenu user={this.props.user} />
            <div className="contentContainer">
              <h1>{this.props.player.username}</h1>
              <div className="contentBox">
                {this.renderSettings()}

                <h2>Rating</h2>
                <div className="block" style={{textAlign:'center', fontSize:'300%'}}>
                  Rating: {Math.round(this.props.player.rating)}<br/>
                </div>


                <div id="games">
                  <div>
                    <h2>{this.props.player.plays} Games</h2>
                    <div className="block roboto">
                      <table>
                        <tbody>
                          <tr>
                            <td>Wins</td><td>{this.props.player.wins || 0}</td><td>{Math.round((this.props.player.wins || 0) / (this.props.player.plays || 0) * 10000)/100 + '%'}</td>
                          </tr>
                          <tr>
                            <td>Kills</td><td>{this.props.player.kills || 0}</td><td>{Math.round((this.props.player.kills || 0) / (this.props.player.plays || 0) *100)/100} Per Game</td>
                          </tr>
                          <tr>
                            <td>Damage</td><td>{Math.round((this.props.player.damage || 0))}</td><td>{Math.round(this.props.player.damage / (this.props.player.plays || 0))} Per Game</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div></div>

                  <div>
                    <h2>Last {num} Games</h2>
                    <div className="block roboto">
                      <table>
                        <tbody>
                          <tr>
                            <td>Wins</td><td>{wins}</td><td>{Math.round(wins / (plays || 0) * 10000)/100 + '%'}</td>
                          </tr>
                          <tr>
                            <td>Kills</td><td>{kills}</td><td>{Math.round(kills / (plays || 0) *100)/100} Per Game</td>
                          </tr>
                          <tr>
                            <td>Damage</td><td>{Math.round(damage)}</td><td>{Math.round(damage / (plays || 0) )} Per Game</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>





                <h2>Abilities</h2>
                <div className="block roboto">
                  <table>
                    <thead>
                      <tr>
                        <td></td>
                        <td>Uses</td>
                        <td>Wins</td>
                        <td>Kills</td>
                        <td>Damage</td>
                      </tr>
                    </thead>
                    <tbody>
                      {abilities.map((ability) => {
                        return (
                          <tr key={ability.id}>
                            <td>{ability.name}</td>
                            <td>{ability.uses}</td>
                            <td>{ability.wins} &nbsp; ({Math.round(ability.wins / ability.uses * 100)}%)</td>
                            <td>{ability.kills} &nbsp; ({Math.round(ability.kills / ability.uses * 100)/100} Per Use)</td>
                            <td>{Math.round(ability.damage)} &nbsp; ({Math.round(ability.damage / ability.uses)} Per Use)</td>
                          </tr>
                        )
                      })}
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
          </MainLayout>
          <style jsx>{`
            #games {
              display: grid;
              grid-template-columns: 1fr 20px 1fr;
            }
            .block {
              background-color: hsl(203, 30%, 10%);
              padding: 20px;
              border-radius: 3px;
            }
            h1 {
              color: #91df3e;
              font-size: 300%;
              margin-bottom: 20px;
              text-align: center;
            }
            h2 {
              margin-bottom: 10px;
              margin-top: 40px;
            }
            td {
              padding: 5px 20px 5px 0px;
            }
            td:nth-child(2) {
              text-align: right;
            }
            .roboto {
              font-family: 'Roboto', sans-serif;
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
