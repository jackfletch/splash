import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import media from '../../components/style-utils';

import HexShotchart from '../../components/HexShotchart';
import ShootingSignature from '../../components/ShootingSignature';
import BarChart from '../../components/BarChart';
import {useShotsApi, useLeagueShootingPctApi} from '../../hooks';

const ChartsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${media.tablet`flex-direction: column;`}
`;

const Charts = ({playerId, seasonId}) => {
  const maxDistance = 35;
  const [activated, setActivated] = useState(0);
  const [deactivated, setDeactivated] = useState(0);
  const [leagueShootingPct] = useLeagueShootingPctApi(maxDistance);
  const [{data, ribbonedData, binnedData}] = useShotsApi(
    playerId,
    seasonId,
    maxDistance
  );

  if (
    leagueShootingPct.length === 0 ||
    data === undefined ||
    ribbonedData.length === 0 ||
    Object.keys(binnedData).length === 0
  ) {
    return <div>Loading player data</div>;
  }
  if (data.length === 0) {
    return <div>No result found for this player</div>;
  }
  if (data.length <= 50) {
    return <div>Not enough shots by this player for any meaningful data</div>;
  }

  const hover = {
    distance: activated,
    toggle: activated !== deactivated,
  };

  return (
    <ChartsDiv>
      <HexShotchart
        data={data}
        hover={hover}
        leagueShootingPct={leagueShootingPct}
      />
      <ShootingSignature
        data={ribbonedData}
        hover={hover}
        leagueShootingPct={leagueShootingPct}
        maxDistance={maxDistance}
      />
      <BarChart
        data={binnedData}
        hover={hover}
        maxDistance={maxDistance}
        setActivated={setActivated}
        setDeactivated={setDeactivated}
      />
    </ChartsDiv>
  );
};

Charts.propTypes = {
  playerId: PropTypes.number,
  seasonId: PropTypes.number,
};

export default Charts;
