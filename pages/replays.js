import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
var moment = require('moment');


export default class Replays extends React.Component {

  static async getInitialProps({req, query}) {
    const serverResult = await fetch(process.env.API_URL + '/api/replays', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (serverResult.status == 200) {
      const replays = await serverResult.json();
      return {replays:replays};
    } else {
      return {replays:[]};
    }
  }


  constructor(props) {
    super(props);

    this.state = {};
  }

  renderReplays() {
    return this.props.replays.map((replay) => {
      return (
        <div key={replay._id}>
          <a href={'/replay/' + replay._id}>View</a> Ended: {moment(replay.endedAt).format('lll')}
        </div>
      )
    })
  }


  render() {
    return (
      <div>
        <MainLayout>
          <div id="page">
            <a href="/">Back to Game</a>
            <br/><br/>

            Replays exist until the server restarts.
            <br/><br/>
            <h1>Replays</h1>
            {this.renderReplays()}
          </div>
        </MainLayout>
        <style jsx>{`
          #page {
            padding: 20px;
          }
        `}</style>
      </div>
    )
  }
}
