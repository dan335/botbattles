import * as Cookies from 'js-cookie';


export default class BottomMenu extends React.Component {

  constructor(props) {
    super(props);
  }


  renderPartners() {
    if (typeof window !== 'undefined' && window.isDesktopApp) return;

    if (Cookies.get('isCrazyGames')) return;

    return (
      <div>
        <a href="http://io-games.zone" target="_blank">IO Games</a>
        <a href="http://bongo.games" target="_blank">Bongo io Games</a>
        <a href="https://gamedevjobs.io" target="_blank">Game Developer Jobs</a>
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
            <a href="/press">Press</a>
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
