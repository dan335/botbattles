import MainLayout from '../layouts/MainLayout.js';
import TopMenu from '../components/TopMenu.js';



export default class Register extends React.Component {

  static async getInitialProps({req, query}) {
    const userId = req && req.session ? req.session.userId : null;
    return {userId:userId};
  }

  constructor(props) {
    super(props);
    this.state = {
      isError:false,
      errorMsg:''
    };

    this.submitButton = this.submitButton.bind(this);
  }


  submitButton(event) {
    const username = document.getElementById('usernameInput').value;
    const email = document.getElementById('emailInput').value;
    const password1 = document.getElementById('passwordInput1').value;
    const password2 = document.getElementById('passwordInput2').value;

    fetch('/auth/register', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, password1:password1, password2:password2, username:username})
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

  render() {
    return (
      <div>
        <MainLayout>
          <TopMenu user={this.props.user} />

          <div className="contentContainer">
            <div className="contentBox roboto">
              <h1>Create an Account</h1>

              {this.showErrorMsg()}

              <label>Username</label>
              <input type="text" id="usernameInput"></input>

              <label>Email</label>
              <input type="text" id="emailInput"></input>

              <label>Password</label>
              <input type="password" id="passwordInput1"></input>

              <label>Type Password Again</label>
              <input type="password" id="passwordInput2"></input>

              <button id="submitButton" onClick={this.submitButton}>Submit</button>

              <br/><br/>
              <p>
                Already have an account? <a href="/login">Login here.</a>
              </p>
            </div>

          </div>
        </MainLayout>
        <style jsx>{`
          .contentContainer {
            width: 600px;
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
