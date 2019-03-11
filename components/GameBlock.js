var moment = require('moment');
const _s = require('../lib/settings.js');



export default class GameBlock extends React.Component {

  renderAbilities(player) {
    if (player.abilities) {
      return player.abilities.map((ability, index) => {

        const a = _s.abilityTypes.find((t) => {
          return t.id == ability.id;
        })

        if (a) {
          return (
            <span key={Math.random()}>
              {a.name}{index == _s.numAbilities-1 ? '' : ','}&nbsp;
            </span>
          )
        }

      })
    }
  }



  renderReplay(game) {
    if (this.props.replay) {
      const url = '/replay/' + this.props.replay._id;

      return (
        <a href={url}>View Replay</a>
      )
    }
  }




  render() {
    return (
      <div key={this.props.game._id} className="gameInfo">
        <div className="name">{this.props.game._id.substring(this.props.game._id.length - 6)}</div>
        <div className="info">
          Ended: {moment(this.props.game.endedAt).format('lll')} &nbsp;&nbsp;
          Lasted: {Math.round(this.props.game.length / 1000)} sec &nbsp;&nbsp;
          {this.renderReplay(this.props.game)}
        </div>
        <ul>
          {
            this.props.game.players.map((player) => {
              const playerUrl = '/player/' + player.userId;
              return (
                <li className="playerInfo" key={Math.random()}>
                  <div className="playerName">
                    {player.userId ? (<a href={playerUrl}>{player.name}</a>) : player.name} &nbsp;&nbsp;
                    <span className="winner">{player.isWinner ? 'Winner' : ''}</span>
                  </div>
                  <div className="other">
                    Kills: {player.kills} &nbsp;&nbsp;
                    Damage: {Math.round(player.damage)} &nbsp;&nbsp;
                    Abilities: {this.renderAbilities(player)} &nbsp;&nbsp;
                    {player.userId ? 'Rating Change: ' + Math.round(player.ratingChange) : ''}
                  </div>
                </li>
              )
            })
          }
        </ul>
        <style jsx>{`
          .name {
            font-size: 175%;
            margin-bottom: 10px;
            color: #91df3e;
          }
          .gameInfo {
            margin-bottom: 5px;
            background-color: hsl(203, 30%, 10%);
            padding: 20px;
            border-radius: 3px;
          }
          .playerInfo {
            margin: 0px;
            font-family: 'Roboto', sans-serif;
            margin-bottom: 10px;
          }
          .info {
            color: #aaa;
            margin-bottom: 10px;
            font-family: 'Roboto', sans-serif;
          }
          .playerName {
            font-size: 120%;
            margin-bottom: 4px;
          }
          .winner {
            color: #91df3e;
          }
          .abilities {
            color: #aaa;
          }
          .other {
            color: #aaa;
            font-size: 85%;
          }
          ul {
            padding: 0;
            padding-left: 20px;
          }
        `}</style>
      </div>
    )
  }
}
