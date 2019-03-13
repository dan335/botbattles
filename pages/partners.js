import MainLayout from '../layouts/MainLayout.js';
import TopMenu from '../components/TopMenu.js';
import fetch from 'isomorphic-unfetch';


export default class Login extends React.Component {

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
              <h1>Partners</h1>
              <br/>
              <a href="http://iogames.fun" target="_blank" title="More IO Games">Play IO Games</a><br/>
              <a href="https://iogames.army/r/68">More io Games</a><br/>
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
          .contentContainer {
            width: 600px;
          }
          h1 {
            margin: 0;
          }
        `}</style>
      </div>
    )
  }
}
