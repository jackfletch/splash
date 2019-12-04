import React, {useState} from 'react';
import styled from 'styled-components';

import Charts from '../Charts';
import PlayerSelector from '../../components/PlayerSelector';
import {usePlayersApi} from '../../hooks';

const Title = styled.h1`
  color: midnightblue;
`;

export default function ChartDashboard() {
  const [players] = usePlayersApi();
  const [playerId, setPlayerId] = useState(2544);

  if (players === undefined) {
    return <div>Still fetching data</div>;
  }
  if (players.length === 0) {
    return <div>No players found</div>;
  }

  return (
    <div>
      <Title>Chart Dashboard</Title>
      <PlayerSelector
        player={playerId}
        players={players}
        setPlayerId={setPlayerId}
      />
      <Charts playerId={playerId} />
    </div>
  );
}
