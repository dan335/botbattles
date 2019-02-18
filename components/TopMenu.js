export default class TopMenu extends React.Component {

  renderAuth() {
    if (this.props.user) {
      const url = '/player/' + this.props.userId;
      return (
        <span>
          <a href={url}><button>{this.props.user.username}</button></a>
        </span>
      )
    } else {
      return (
        <span>
          <a href="/register"><button>Register</button></a>
          <a href="/login"><button>Login</button></a>
        </span>
      )
    }
  }


  render() {
    return (
      <div>
        <div id="topMenu">
          <a href="/"><button>Home</button></a>
          <a href="/abilities"><button>Abilities</button></a>
          <a href="/games"><button>Game History</button></a>
          {this.renderAuth()}
        </div>
        <style jsx>{`
          #topMenu {
            font-family: 'Roboto', sans-serif;
            position: absolute;
            right: 20px;
            top: 20px;
            text-align: right;
          }
        `}</style>
      </div>
    )
  }
}
