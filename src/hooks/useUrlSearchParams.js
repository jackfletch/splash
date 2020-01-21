import {useLocation} from 'react-router-dom';

function useUrlSearchParams() {
  return new URLSearchParams(useLocation().search);
}

export default useUrlSearchParams;
