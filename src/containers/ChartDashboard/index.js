import React, {useState} from 'react';
import styled from 'styled-components';

import media from '../../components/style-utils';

import PlayerSelector from '../../components/PlayerSelector';
import HexShotchart from '../../components/HexShotchart';
import VShootingSignature from '../../components/VShootingSignature';
import BarChart from '../../components/BarChart';
import {usePlayersApi, useShotsApi} from '../../hooks';

const Title = styled.h1`
  color: midnightblue;
`;

const ChartsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  ${media.tablet`flex-direction: column;`}
`;

export default function ChartDashboard() {
  const maxDistance = 35;
  const [activated, setActivated] = useState(0);
  const [deactivated, setDeactivated] = useState(0);
  const [players] = usePlayersApi();
  const [playerId, setPlayerId] = useState(2544);
  const [{data, ribbonedData, binnedData}] = useShotsApi(playerId, maxDistance);

  if (data === undefined || players === undefined) {
    return <div>Still fetching data</div>;
  }
  if (players.length === 0) {
    return <div>No players found</div>;
  }
  if (data.length === 0) {
    return (
      <div>
        <Title>Chart Dashboard</Title>
        <PlayerSelector
          player={playerId}
          players={players}
          setPlayerId={setPlayerId}
        />
        <div>No result found for this player</div>
      </div>
    );
  }
  if (data.length <= 50) {
    return (
      <div>
        <Title>Chart Dashboard</Title>
        <PlayerSelector
          player={playerId}
          players={players}
          setPlayerId={setPlayerId}
        />
        <div>Not enough shots by this player for any meaningful data</div>
      </div>
    );
  }
  const hover = {
    distance: activated,
    toggle: activated !== deactivated,
  };

  return (
    <div>
      <Title>Chart Dashboard</Title>
      <PlayerSelector
        player={playerId}
        players={players}
        setPlayerId={setPlayerId}
      />
      <ChartsDiv>
        <HexShotchart data={data} hover={hover} />
        <VShootingSignature
          data={ribbonedData}
          hover={hover}
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
    </div>
  );
}
