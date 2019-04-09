import fetch from 'isomorphic-unfetch';


export default class Control extends React.Component {

  static async getInitialProps({req, query}) {
    let servers = [];
    const serverResult = await fetch(process.env.API_URL + '/api/servers', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (serverResult.status == 200) {
      servers = await serverResult.json();
    }

    let mods = [];
    const modsResult = await fetch(process.env.API_URL + '/api/mods', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
      body: JSON.stringify({userId:req.session.userId})
    });

    if (modsResult.status == 200) {
      mods = await modsResult.json();
    }

    return {servers:servers, mods:mods};
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
      } else {
        console.log(res)
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


  submitMod() {
    const userId = document.getElementById('modInput').value;
    if (userId) {
      fetch('/api/addMod', {
        method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        body: JSON.stringify({userId:userId})
      }).then((res) => {
        if (res.status == 200) {
          window.location.href = '/control';
        }
      })
    }
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

        <br/><br/><br/>

        <h2>Mods</h2>
        {this.props.mods.map((mod) => {
          return (
            <div key={mod._id}>{mod.username}</div>
          )
        })}

        <label>Add Mod</label>
        <input type="text" placeholder="user id" id="modInput" />
        <button onClick={this.submitMod}>Submit</button>

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
