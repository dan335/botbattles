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

  constructor(props) {
    super(props);
    this.state = {};

    this.submitButton = this.submitButton.bind(this);
  }


  showErrorMsg() {
    if (this.state.isError) {
      return (
        <div id="errorMsg">
          {this.state.errorMsg}
          <style jsx>{`
            #errorMsg {
              background-color: hsl(0, 70%, 45%);
              padding: 20px;
              border-radius: 2px;
              margin:10px 0 10px 0;
              color: #fff;
            }
          `}</style>
        </div>
      )
    }
  }


  submitButton(event) {
    var email = document.getElementById('emailInput').value;
    var password = document.getElementById('passwordInput').value;

    fetch('/auth/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, password:password})
    }).then((res) => {
      if (res.status == 200) {
        window.location.href = '/';
      } else {
        res.text().then((msg) => {
          this.setState({ isError: true, errorMsg: msg });
        })
      }
    })
  }


  render() {
    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />
          <div>

            <div className="constrain">
              <div id="content">
                <h1>Login</h1>

                {this.showErrorMsg()}

                <label>Email</label>
                <input type="text" id="emailInput"></input>

                <label>Password</label>
                <input type="password" id="passwordInput" onKeyPress={(e) => {(e.key === 'Enter' ? this.submitButton() : null)}}></input>

                <button id="submitButton" onClick={this.submitButton}>Submit</button>

                <br/><br/>
                <p>
                  Don't have an account? <a href="/register">Register here.</a>
                </p>
              </div>
            </div>
          </div>
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
          h1 {
            padding: 10px;
            margin: 0;
          }
          label {
            padding: 20px 0px 5px 0px;
            display: block;
          }
          #submitButton {
            margin-top: 20px;
            display: block;
          }
        `}</style>
      </div>
    )
  }
}
