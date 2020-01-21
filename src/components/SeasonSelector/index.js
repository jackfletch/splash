import React from 'react';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';

const SeasonSelector = ({player, season, seasons, setSeasonId}) => {
  const history = useHistory();
  return (
    <form>
      <label htmlFor="seasonselector">
        Season{' '}
        <select
          id="seasonselector"
          value={season}
          onChange={e => {
            const seasonId = parseInt(e.target.value);
            history.push(`/players/${player}?season_id=${seasonId}`);
            setSeasonId(seasonId);
          }}
        >
          {seasons.map(d => (
            <option key={d.id} value={d.id}>
              {d.string}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
};

SeasonSelector.propTypes = {
  player: PropTypes.number.isRequired,
  season: PropTypes.number.isRequired,
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      string: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSeasonId: PropTypes.func.isRequired,
};

export default SeasonSelector;
