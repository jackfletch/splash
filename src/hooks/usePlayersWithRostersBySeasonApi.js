import {useEffect, useState} from 'react';
import axios from 'axios';

function usePlayersWithRostersBySeasonApi(seasonId = null) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const origin =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000'
          : 'https://splash.jackfletch.com';

      const endpoint = new URL(origin);
      endpoint.pathname = `/api/playersWithRosters/${seasonId}`;

      const result = await axios.get(endpoint);
      setPlayers(result.data);
    };
    fetchData();
  }, [seasonId]);

  return [players];
}

export default usePlayersWithRostersBySeasonApi;
