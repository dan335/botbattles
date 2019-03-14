import MainLayout from '../layouts/MainLayout.js';
import TopMenu from '../components/TopMenu.js';
import fetch from 'isomorphic-unfetch';


export default class Press extends React.Component {

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

    return {userId:userId, user:user};
  }


  render() {
    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />
          <div className="contentContainer">
            <div className="contentBox roboto">
              <h1>Press Page</h1>
              <br/>
              <label>Thumbnail</label>
              <img src="/static/botbattlesThumb.jpg" />

              <label>Banner</label>
              <img src="/static/botbattlesBanner.jpg" />

              <label>Logo</label>
              <img src="/static/botbattlesLogo.png" />

              <label>Description</label>
              <p>Bot Battles is a multiplayer online robotic combat arena game.  Build your bot by selecting three abilities then enter the arena and battle against other bots.  Be the last bot still standing at the end to win the game.</p>
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
          h1 {
            margin: 0;
            text-align: center;
          }
          label {
            display: block;
            margin-bottom: 5px;
            margin-top: 20px;
            font-size: 150%;
          }
          img {
            max-width: 100%;
          }
        `}</style>
      </div>
    )
  }
}
