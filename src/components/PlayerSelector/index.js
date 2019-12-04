import React from 'react';
import PropTypes from 'prop-types';

const PlayerSelector = ({player, players, setPlayerId}) => (
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

PlayerSelector.propTypes = {
  player: PropTypes.number.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  setPlayerId: PropTypes.func.isRequired,
};

export default PlayerSelector;
