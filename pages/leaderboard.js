import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';
const _s = require('../lib/settings.js');



export default class Leaderboard extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

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

    let players = [];
    let page = 0;
    if (query.page) {
      page = query.page;
    }
    const playersResult = await fetch(process.env.API_URL + '/api/players', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({page:page})
    })
    if (playersResult.status == 200) {
      players = await playersResult.json();
    }

    return {userId:userId, user:user, players:players, page:query.page};
  }




  render() {
    const page = Number(this.props.page) || null;

    let prevPageUrl = '/leaderboard';
    if (page && page - 1 > 0) {
      prevPageUrl += '/' + (page - 1);
    }

    let nextPageUrl = '/leaderboard/';
    if (this.props.page) {
      nextPageUrl += page + 1;
    } else {
      nextPageUrl += 1;
    }

    let showPrev = true;
    if (!this.props.page || page == 0) {
      showPrev = false;
    }

    return (
      <div>
        <MainLayout>
          <div>
            <div className="constrain">
              <div id="content">
                <h1 className="audiowide">Leaderboard</h1>

                {this.props.players.map((player, index) => {
                  const playerUrl = '/player/' + player._id;
                  return (
                    <div key={player._id} className="player">
                      {index * (page+1) +1}. <a href={playerUrl}>{player.username}</a> &nbsp;&nbsp; {Math.round(player.rating)}
                    </div>
                  )
                })}

                <br/><br/>
                {showPrev ? (<a href={prevPageUrl}><button>Previous Page</button></a>) : ''}
                <a href={nextPageUrl}><button>Next Page</button></a>

              </div>
            </div>
          </div>
          <TopMenu user={this.props.user} />
        </MainLayout>
        <style jsx>{`
          #content {
            padding: 10px;
            font-family: 'Roboto', sans-serif;
          }
          .audiowide {
              font-family: 'Audiowide', sans-serif;
          }
          .constrain {
            max-width: 900px;
            margin-right: auto;
            margin-left: auto;
          }
          .player {
            background-color: hsl(203, 20%, 10%);
            padding: 10px 20px;
            margin-bottom: 3px;
            border-radius: 3px;
          }
        `}</style>
      </div>
    )
  }
}
