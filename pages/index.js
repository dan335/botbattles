import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';


export default class Index extends React.Component {

  static async getInitialProps({req, query}) {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';

    // get game
    const serverResult = await fetch(baseUrl + '/api/servers', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (serverResult.status == 200) {
      const servers = await serverResult.json();
      return {servers:servers};
    } else {
      console.log(serverResult);
      return {servers:[]};
    }
  }



  constructor(props) {
    super(props);

    this.ws = null;

    this.state = {
      isWsOpen: false,
      server: null
    }

    this.playButton = this.playButton.bind(this);
  }


  componentDidMount() {
    this.findServer();
  }




  componentDidUpdate(prevProps, prevState) {
    // if we now have a server connect to it
    if (prevState.server != this.state.server) {
      if (this.state.server) {
        this.ws = new WebSocket(this.state.server.address);

        this.ws.onopen = (event) => {
          this.setState({isWsOpen: true});
        }

        this.ws.onmessage = (event) => {
          const json = JSON.parse(event.data);
          if (json && json.t == 'gameId') {
            window.location.href = '/game/' + this.state.server._id + '/' + json.gameId;
          }
        };
      }
    }
  }



  // in the future if there is more than one server ping all servers to find closest one
  findServer() {
    if (this.props.servers && this.props.servers.length) {
      this.setState({server:this.props.servers[0]});
    }
  }


  playButton(event) {
    this.ws.send(JSON.stringify({t:'requestGame'}));
  }


  renderPlayButton() {
    if (!this.state.server) {
      return (
        <div>Finding a server...</div>
      )
    }

    if (!this.state.isWsOpen) {
      return (
        <div>Connecting to server...</div>
      )
    }

    return (
      <button onClick={this.playButton}>Play</button>
    )
  }


  render() {
    return (
      <div>
        <MainLayout>
          {this.renderPlayButton()}
        </MainLayout>
      </div>
    )
  }
}
