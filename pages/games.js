import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';

const _s = require('../lib/settings.js');
import TopMenu from '../components/TopMenu.js';
import GameBlock from '../components/GameBlock.js';



export default class Games extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const serverResult = await fetch(process.env.API_URL + '/api/games', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({sort:query.sort, options:query.options})
    });

    let games = [];
    if (serverResult.status == 200) {
      games = await serverResult.json();
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

    return {games:games, user:user, sort:query.sort, options:query.options};
  }


  constructor(props) {
    super(props);

    this.state = {
      sort: this.props.sort ? this.props.sort : 'date',
      options: this.props.options ? [this.props.options] : []
    };
  }


  renderSortFilterButtons() {

    let dateSortUrl = '/games/sort/date';
    let qualitySortUrl = '/games/sort/quality';
    let withReplayUrl = '/games';
    let allUrl = '/games';

    if (this.state.sort) {
      withReplayUrl += '/sort/' + this.state.sort;
      allUrl += '/sort/' + this.state.sort;
    }

    if (this.state.options) {
      if (this.state.options.includes('hasReplay')) {
        dateSortUrl += '/options/hasReplay';
        qualitySortUrl += '/options/hasReplay';
      }
    }

    withReplayUrl += '/options/hasReplay';
    allUrl += '/options/all';

    return (
      <div>
        <a href={dateSortUrl}><button className={this.state.sort == 'date' || !this.state.sort ? 'selected' : ''}>Sort by Date</button></a>
        <a href={qualitySortUrl}><button className={this.state.sort == 'quality' ? 'selected' : ''}>Sort by Score</button></a>
        <a href={allUrl}><button className={!this.state.options.length || this.state.options.includes('all') ? 'selected': ''}>All</button></a>
        <a href={withReplayUrl}><button className={this.state.options.includes('hasReplay') ? 'selected' : ''}>With Replay</button></a>
      </div>
    )
  }



  render() {

    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />
          <div className="contentContainer">
            <div id="title">
              <div><h1>Game History</h1></div>
              <div id="right">
                {this.renderSortFilterButtons()}
              </div>
            </div>
            <div className="contentBox">
              {this.props.games.map((game) => {
                return (
                  <GameBlock game={game} key={game._id} />
                )
              })}
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
          h1 {
            padding-left: 20px;
          }
          #title {
            display: grid;
            grid-template-columns: auto auto;
          }
          #right {
            text-align: right;
          }
        `}</style>
      </div>
    )
  }
}
