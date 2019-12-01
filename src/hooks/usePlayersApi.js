import {useEffect, useState} from 'react';
import axios from 'axios';

function usePlayersApi() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const endpoint =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api/players'
          : 'https://splash.jackfletch.com/api/players';
      const result = await axios.get(endpoint);
      setPlayers(result.data);
    };
    fetchData();
  }, []);

  return [players];
}

export default usePlayersApi;
