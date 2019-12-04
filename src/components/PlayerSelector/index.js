import React from 'react';
import PropTypes from 'prop-types';

class PlayerSelector extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const {player} = this.props;
    if (nextProps.player !== player) {
      return true;
    }
    return false;
  }

  render() {
    const {player, players, setPlayerId} = this.props;
    return (
      <form>
        <label htmlFor="select1">
          Select
          <select
            value={player}
            onChange={e => setPlayerId(parseInt(e.target.value))}
          >
            {players.map(d => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
      </form>
    );
  }
}

PlayerSelector.propTypes = {
  player: PropTypes.number.isRequired,
  players: PropTypes.array.isRequired,
  setPlayerId: PropTypes.func.isRequired,
};

export default PlayerSelector;
