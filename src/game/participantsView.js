import './participantsView.css';
import PropTypes from 'prop-types';

function ParticipantsView(props) {

  // order players such that this player will be first
  const orderedPlayers = [];
  for (const player of props.players) {
    if (player === props.thisPlayer) {
      orderedPlayers.unshift({"name": player, "className": "this-player"});
    } else {
      orderedPlayers.push({"name": player, "className": "other-player"});
    }
  }

  return (
    <div>
      <table className={"players-table"}>
        {orderedPlayers.map((player, i) => {
          return (
            <tbody>
            <tr key={i}>
              <td key={"tdp" + i} className={"person ".concat(player.className)}>{player.name}</td>
              <td key={"tde" + i} className={"td-icon"}>
                <img className={"td-item"} src={"error-icon.png"} alt={"error-icon"} width={"40px"}
                     height={"40px"} hidden={!props.blockedPlayers.has(player.name)}/>
              </td>
              <td key={"tdv" + i} className={"td-icon"}>
                <img className={"td-item"} src={"radio-bot-animated.gif"} alt={"virtual-helper"} width={"40px"}
                     height={"55px"} hidden={!(props.playerGettingHelp === player.name)}/>
              </td>
            </tr>
            </tbody>
          )
        })}
      </table>
    </div>

  )
}

ParticipantsView.propTypes = {
  players: PropTypes.arrayOf(PropTypes.string),
  thisPlayer: PropTypes.string,
  playerGettingHelp: PropTypes.string,
  blockedPlayers: PropTypes.object  // set
};

export default ParticipantsView;