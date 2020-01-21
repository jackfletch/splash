import {useEffect, useState} from 'react';
import axios from 'axios';

function useSeasonsApi(playerId) {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const origin =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000'
          : 'https://splash.jackfletch.com';

      const endpoint = new URL(origin);
      endpoint.pathname = '/api/seasons';
      endpoint.search = new URLSearchParams({
        player_id: playerId,
      });

      const result = await axios.get(endpoint);
      setSeasons(result.data.reverse());
    };
    fetchData();
  }, [playerId]);

  return [seasons];
}

export default useSeasonsApi;
