import MainLayout from '../layouts/MainLayout.js';
import fetch from 'isomorphic-unfetch';
import TopMenu from '../components/TopMenu.js';



export default class Abilities extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;

    const result = await fetch(process.env.API_URL + '/api/abilities', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({abilityId:req.body.abilityId})
    })

    var ability = await result.json();

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

    return {userId:userId, abilities:ability, user:user};
  }

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div>
        <MainLayout>
          <div>
            <div className="constrain">
              <div id="content">
                Ability
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
