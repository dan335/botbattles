export default class TopMenu extends React.Component {

  logout() {
    fetch('/auth/logout', {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      location.reload();
    })
  }



  render() {
    return (
      <div>
        <div id="topMenu">
          <div>
            <a href="/">Home</a>
            <a href="/abilities">Abilities</a>
            <a href="/leaderboard">Leaderboard</a>
            <a href="/games">History</a>
          </div>
          <div id="rightMenu">
            {this.props.user ? (
              <span>
                <a href={'/player/' + this.props.user._id}>{this.props.user.username}</a>
                <a onClick={this.logout}>Logout</a>
              </span>
            ) : (
              <span>
                <a href="/register">Register</a>
                <a href="/login">Login</a>
              </span>
            )}
          </div>
        </div>
        <style jsx>{`
          #topMenu {
            font-family: 'Roboto', sans-serif;
            background-color: hsl(203, 20%, 10%);
            display: grid;
            grid-template-columns: auto auto;
          }
          #rightMenu {
            text-align: right;
          }
          a {
            padding: 10px;
            color: #eee;
            display: inline-block;
          }
          a:hover {
            background-color: hsl(203, 20%, 20%);
            color: #eee;
          }
        `}</style>
      </div>
    )
  }
}
