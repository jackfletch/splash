import {useEffect, useState} from 'react';
import axios from 'axios';
import {
  binShots,
  binLeftRight,
  ribbonShots,
} from '@jackfletch/splash-vis-utils';
import isLessThanDistance from '@jackfletch/splash-vis-utils/dist/esnext/filters/isLessThanDistance';

import {apiOrigin} from '../utils/config';

function useShotsApi(playerId, seasonId, maxDistance) {
  const [data, setData] = useState(undefined);
  const [ribbonedData, setRibbonedData] = useState([]);
  const [binnedData, setBinnedData] = useState({});
  const [leftRightData, setLeftRightData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = new URL(apiOrigin);
      endpoint.pathname = `/api/shots/player/${playerId}/season/${seasonId}`;

      const res = await axios.get(endpoint);
      setData(res.data.filter(isLessThanDistance(maxDistance)));
      setRibbonedData(ribbonShots(res.data, maxDistance));
      setBinnedData(binShots(res.data, maxDistance));
      setLeftRightData(binLeftRight(res.data, maxDistance));
    };
    fetchData();
  }, [playerId, seasonId, maxDistance]);

  return [{data, ribbonedData, binnedData, leftRightData}];
}

export default useShotsApi;
