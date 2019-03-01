import fetch from 'isomorphic-unfetch';


export default class Control extends React.Component {

  static async getInitialProps({req, query}) {
    const serverResult = await fetch(process.env.API_URL + '/api/servers', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (serverResult.status == 200) {
      const servers = await serverResult.json();
      return {servers:servers};
    } else {
      return {servers:[]};
    }
  }


  constructor(props) {
    super(props);

    this.state = {};

    this.submitButton = this.submitButton.bind(this);
    this.deleteButton = this.deleteButton.bind(this);
  }



  submitButton(event) {
    const name = document.getElementById('nameInput').value;
    const address = document.getElementById('addressInput').value;
    const url = document.getElementById('urlInput').value;

    fetch('/api/addServer', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({name:name, address:address, url:url})
    }).then((res) => {
      if (res.status == 200) {
        window.location.href = '/control';
      }
    })
  }


  deleteButton(event, serverId) {
    fetch('/api/deleteServer', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({serverId:serverId})
    }).then((res) => {
      if (res.status == 200) {
        window.location.href = '/control';
      }
    })
  }


  renderServers() {
    return this.props.servers.map((s) => {
      return (
        <div key={s._id}>
          {s.name} : {s.address} : {s.url} <button onClick={(event) => {this.deleteButton(event, s._id)}}>Delete</button>
        </div>
      )
    })
  }


  render() {
    return (
      <div>
        {this.renderServers()}
        <br/><br/>

        <label>Name</label>
        <input type="text" id="nameInput" />

        <label>Address</label>
        <input type="text" placeholder="ws://localhost:3020/ws" id="addressInput" />

        <label>Url</label>
        <input type="text" placeholder="http://123.123.123.123" id="urlInput" />

        <br/>
        <button onClick={this.submitButton}>Submit</button>

        <style jsx>{`
          label {
            display: block;
            margin-top: 10px;
          }
          input {
            display: block;
          }
        `}</style>
      </div>
    )
  }
}
