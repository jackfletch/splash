import {useEffect, useState} from 'react';
import axios from 'axios';

import {binShots, ribbonShots} from '../lib';

function useShotsApi(playerId, maxDistance) {
  const [data, setData] = useState(undefined);
  const [ribbonedData, setRibbonedData] = useState([]);
  const [binnedData, setBinnedData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const endpoint =
        process.env.NODE_ENV === 'development'
          ? `http://localhost:5000/api/shots/${playerId}`
          : `https://splash.jackfletch.com/api/shots/${playerId}`;
      const res = await axios.get(endpoint);
      setData(res.data);
      setRibbonedData(ribbonShots(res.data, maxDistance));
      setBinnedData(binShots(res.data, maxDistance));
    };
    fetchData();
  }, [playerId, maxDistance]);

  return [{data, ribbonedData, binnedData}];
}

export default useShotsApi;
