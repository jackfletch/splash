import {useEffect, useState} from 'react';
import axios from 'axios';

import {apiOrigin} from '../utils/config';

function usePlayersApi() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = new URL(apiOrigin);
      endpoint.pathname = '/api/players';

      const result = await axios.get(endpoint);
      setPlayers(result.data);
    };
    fetchData();
  }, []);

  return [players];
}

export default usePlayersApi;
