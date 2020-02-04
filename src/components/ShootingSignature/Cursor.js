import React from 'react';
import PropTypes from 'prop-types';

import {useHoverState} from '../../hooks';

const Cursor = ({scale}) => {
  const hover = useHoverState();
  const x = scale.x(hover.distance + 0.5);
  const top = scale.y(1);
  const bottom = scale.y(0);
  return (
    hover.toggle && (
      <g>
        <path
          d={`M${x},${top} L${x},${bottom}`}
          style={{strokeWidth: 10, stroke: 'rgba(0, 0, 0, 0.2)'}}
        />
      </g>
    )
  );
};

Cursor.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
};

export default Cursor;
