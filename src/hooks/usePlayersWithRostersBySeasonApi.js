import {useEffect, useState} from 'react';
import axios from 'axios';

import {apiOrigin} from '../utils/config';

function usePlayersWithRostersBySeasonApi(seasonId = null) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = new URL(apiOrigin);
      endpoint.pathname = `/api/playersWithRosters/${seasonId}`;

      const result = await axios.get(endpoint);
      setPlayers(result.data);
    };
    fetchData();
  }, [seasonId]);

  return [players];
}

export default usePlayersWithRostersBySeasonApi;
