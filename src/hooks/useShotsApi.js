import {useEffect, useState} from 'react';
import axios from 'axios';
import {binShots, ribbonShots} from '@jackfletch/splash-vis-utils';

function useShotsApi(playerId, seasonId, maxDistance) {
  const [data, setData] = useState(undefined);
  const [ribbonedData, setRibbonedData] = useState([]);
  const [binnedData, setBinnedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const origin =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000'
          : 'https://splash.jackfletch.com';

      const endpoint = new URL(origin);
      endpoint.pathname = `/api/shots/player/${playerId}/season/${seasonId}`;

      const res = await axios.get(endpoint);
      setData(res.data);
      setRibbonedData(ribbonShots(res.data, maxDistance));
      setBinnedData(binShots(res.data, maxDistance));
    };
    fetchData();
  }, [playerId, seasonId, maxDistance]);

  return [{data, ribbonedData, binnedData}];
}

export default useShotsApi;
