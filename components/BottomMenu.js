export default class BottomMenu extends React.Component {

  componentDidMount() {
    console.log('document.referrer', document.referrer)
  }

  renderPartners() {
    console.log('props host', this.props.host);

    if (this.props.host && this.props.host.includes('crazygames')) {
      return (
        <div>
          <a href="https://www.crazygames.com/c/io">CrazyGames IO Games</a>&nbsp;
          <a href="/partners">Partners</a>
          <style jsx>{`
            div {
              font-family: 'Roboto', sans-serif;
            }
            a {
              padding: 10px;
              color: #eee;
              display: inline-block;
            }
            a:hover {
              background-color: hsl(203, 30%, 20%);
              color: #eee;
            }
          `}</style>
        </div>
      )
    } else {
      return (
        <div>
          <a href="http://iogames.space/">More IO Games</a>
          <a href="http://io-games.zone">IO Games</a>
          <a href="http://bongo.games">Bongo io Games</a>
          <a href="http://titotu.io">Titotu io Games</a>
          <a href="/partners">Partners</a>
          <style jsx>{`
            div {
              font-family: 'Roboto', sans-serif;
            }
            a {
              padding: 10px;
              color: #eee;
              display: inline-block;
            }
            a:hover {
              background-color: hsl(203, 30%, 20%);
              color: #eee;
            }
          `}</style>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div id="bottomMenu">
          <div></div>
          <div>
            {this.renderPartners()}
          </div>
          <div style={{textAlign:'right'}}>
            <a href="https://discord.gg/6R3jYyH">Discord</a>
            <a href="/contact">Contact</a>
            <a href="/privacypolicy">Privacy Policy</a>
          </div>
          <div></div>
        </div>
        <style jsx>{`
          #bottomMenu {
            position: fixed;
            bottom: 0px;
            width: 100%;
            font-family: 'Roboto', sans-serif;
            background-color: hsla(203, 30%, 10%, 75%);
            display: grid;
            grid-template-columns: 40px auto auto 40px;
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
            background-color: hsl(203, 30%, 20%);
            color: #eee;
          }
        `}</style>
      </div>
    )
  }
}
