import React, {useState} from 'react';
import {useRouteMatch} from 'react-router-dom';

import Charts from '../Charts';
import PlayerSelector from '../../components/PlayerSelector';
import SeasonSelector from '../../components/SeasonSelector';
import {
  usePlayersWithRostersBySeasonApi,
  useSeasonsApi,
  useUrlSearchParams,
} from '../../hooks';

export default function ChartDashboard() {
  const match = useRouteMatch('/players/:playerId');
  const urlSearchParams = useUrlSearchParams();
  const slugSeasonId = parseInt(urlSearchParams.get('season_id'));
  const slugPlayerId =
    match && match.params ? parseInt(match.params.playerId) : 2544;
  const [seasons] = useSeasonsApi(slugPlayerId);
  const [seasonId, setSeasonId] = useState(slugSeasonId || 2019);
  const [players] = usePlayersWithRostersBySeasonApi(seasonId);
  const [playerId, setPlayerId] = useState(slugPlayerId);

  if (slugPlayerId && slugPlayerId !== playerId) {
    setPlayerId(slugPlayerId);
  }
  if (
    seasons?.[0]?.id &&
    seasons[0].id !== seasonId &&
    Number.isNaN(slugSeasonId)
  ) {
    setSeasonId(seasons?.[0].id);
  }

  if (players === undefined || seasons === undefined) {
    return <div>Still fetching data</div>;
  }
  if (players.length === 0) {
    return <div>No players found</div>;
  }

  return (
    <div>
      <PlayerSelector
        player={playerId}
        players={players}
        setPlayerId={setPlayerId}
      />
      <SeasonSelector
        player={playerId}
        season={seasonId}
        seasons={seasons}
        setSeasonId={setSeasonId}
      />
      <Charts playerId={playerId} seasonId={seasonId} />
    </div>
  );
}
