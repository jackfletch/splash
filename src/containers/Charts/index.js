import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import media from '../../components/style-utils';

import HexShotchart from '../../components/HexShotchart';
import ShootingSignature from '../../components/ShootingSignature';
import BarChart, {
  functions as barChartFunctions,
} from '../../components/BarChart';
import {HoverProvider, useShotsApi, useLeagueShootingPctApi} from '../../hooks';
import LeftRightChart, {
  functions as leftRightFunctions,
} from '../../components/LeftRightChart';

const ChartsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${media.tablet`flex-direction: column;`}
`;

const withHoverProvider = children => <HoverProvider>{children}</HoverProvider>;

const Charts = ({playerId, seasonId}) => {
  const maxDistance = 35;
  const [leagueShootingPct] = useLeagueShootingPctApi(maxDistance, seasonId);
  const [{data, ribbonedData, binnedData, leftRightData}] = useShotsApi(
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

  return withHoverProvider(
    <>
      <ChartsDiv>
        <HexShotchart data={data} leagueShootingPct={leagueShootingPct} />
        <ShootingSignature
          data={ribbonedData}
          leagueShootingPct={leagueShootingPct}
          maxDistance={maxDistance}
        />
        <BarChart
          data={binnedData}
          label={barChartFunctions.shotProportion.labeler}
          maxDistance={maxDistance}
          title="Shot Proportion by Distance"
          y={barChartFunctions.shotProportion.accessor}
        />
        <BarChart
          data={binnedData}
          domain={[0, 100]}
          label={barChartFunctions.fieldGoalPercentage.labeler}
          maxDistance={maxDistance}
          title="Field Goal Percentage by Distance"
          y={barChartFunctions.fieldGoalPercentage.accessor}
        />
      </ChartsDiv>
      <ChartsDiv>
        <LeftRightChart
          accessor={leftRightFunctions.shotFrequency.accessor}
          data={leftRightData}
          domain={leftRightFunctions.shotFrequency.domain}
          maxDistance={maxDistance}
          title="Shooting Frequency by Side"
        />
        <LeftRightChart
          accessor={leftRightFunctions.fieldGoalPercentage.accessor}
          data={leftRightData}
          domain={leftRightFunctions.fieldGoalPercentage.domain}
          maxDistance={maxDistance}
          title="Field Goal Percentage by Side"
        />
      </ChartsDiv>
    </>
  );
};

Charts.propTypes = {
  playerId: PropTypes.number,
  seasonId: PropTypes.number,
};

export default Charts;
