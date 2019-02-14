import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';



export default class Login extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const playerResult = await fetch(process.env.API_URL + '/api/user', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({userId:req.body.userId})
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

    return {userId:userId, player:player, user:user, games:games};
  }

  constructor(props) {
    super(props);
    this.state = {};
  }


  logout() {
    fetch('/auth/logout', {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
  }


  render() {
    return (
      <div>
        <MainLayout>
          <div>
            <div className="constrain">
              <div id="content">
                Player
                <button onClick={this.logout}>Logout</button>
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
            max-width: 600px;
            margin-right: auto;
            margin-left: auto;
          }
        `}</style>
      </div>
    )
  }
}
