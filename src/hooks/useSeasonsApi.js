import {useEffect, useState} from 'react';
import axios from 'axios';

import {apiOrigin} from '../utils/config';

function useSeasonsApi(playerId) {
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = new URL(apiOrigin);
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
