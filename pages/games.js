import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';

const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';
import GameBlock from '../components/GameBlock.js';



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









  render() {

    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />
          <div className="contentContainer">
            <h1>Game History</h1>
            <div className="contentBox">
              {this.props.games.map((game) => {
                const replay = this.props.replays.find((r) => {
                  return r.gameId == game._id;
                })

                return (
                  <GameBlock game={game} replay={replay} key={game._id} />
                )
              })}
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
          h1 {
            text-align: center;
          }
        `}</style>
      </div>
    )
  }
}
