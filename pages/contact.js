import MainLayout from '../layouts/MainLayout.js';
import TopMenu from '../components/TopMenu.js';
import fetch from 'isomorphic-unfetch';


export default class Contact extends React.Component {

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
    this.state = {
      isError:false,
      errorMsg:'',
      isSuccess: false,
      successMsg:''
    };

    this.sendButton = this.sendButton.bind(this);
  }



  sendButton(event) {
    this.setState(() => {
      return {
        isError: false,
        isSuccess: false
      };
    });

    var email = document.getElementById('emailInput').value;
    var message = document.getElementById('messageInput').value;

    fetch('/api/contact', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, message:message})
    }).then((res) => {
      if (res.status == 200) {
        this.setState({ isSuccess: true, successMsg: 'Email sent.' });
        document.getElementById('emailInput').value = '';
        document.getElementById('messageInput').value = '';
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

  showSuccessMsg() {
    if (this.state.isSuccess) {
      return (
        <div id="successMsg">
          {this.state.successMsg}
          <style jsx>{`
            #successMsg {
              background-color: hsl(150, 75%, 45%);
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
              <h1>Send BotBattles.io an Email</h1>

              {this.showErrorMsg()}
              {this.showSuccessMsg()}

              <label>Your Email Address</label>
              <input type="text" id="emailInput"></input>

              <label>Message</label>
              <textarea id="messageInput"></textarea>

              <br/><br/>
              <button onClick={this.sendButton}>Send Email</button>
            </div>
          </div>
        </MainLayout>
        <style jsx>{`
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
          textarea {
            min-height: 300px;
          }
        `}</style>
      </div>
    )
  }

}
