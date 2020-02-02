import React from 'react';
import PropTypes from 'prop-types';

import {apiOrigin} from '../../utils/config';
import {Img} from './style';

const PlayerImage = ({player}) => {
  const endpoint = new URL(apiOrigin);
  endpoint.pathname = `/api/static/img/playerheadshots/${player}.png`;

  return <Img src={endpoint.href} alt="Player's portrait" />;
};

PlayerImage.propTypes = {
  player: PropTypes.number.isRequired,
};

export default PlayerImage;
