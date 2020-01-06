import {useEffect, useState} from 'react';
import axios from 'axios';

function useLeagueShootingPctApi(maxDistance) {
  const [leagueShootingPct, setLeagueShootingPct] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:5000/api/league/shootingPct?distance=${maxDistance}`
          : `https://splash.jackfletch.com/api/league/shootingPct?distance=${maxDistance}`;
      const {data} = await axios.get(endpoint);
      console.log('fetching league avgs');
      setLeagueShootingPct(data.map(bin => Number(bin.pct)));
    };
    fetchData();
  }, [maxDistance]);

  return [leagueShootingPct];
}

export default useLeagueShootingPctApi;
