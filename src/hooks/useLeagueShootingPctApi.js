import {useEffect, useState} from 'react';
import axios from 'axios';

import {apiOrigin} from '../utils/config';

function useLeagueShootingPctApi(maxDistance) {
  const [leagueShootingPct, setLeagueShootingPct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = new URL(apiOrigin);
      endpoint.pathname = `/api/league/shootingPct`;
      endpoint.search = new URLSearchParams({
        distance: maxDistance,
      });

      const {data} = await axios.get(endpoint);
      setLeagueShootingPct(data.map(bin => Number(bin.pct)));
    };
    fetchData();
  }, [maxDistance]);

  return [leagueShootingPct];
}

export default useLeagueShootingPctApi;
