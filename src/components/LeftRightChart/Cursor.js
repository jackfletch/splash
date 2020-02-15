import React from 'react';
import PropTypes from 'prop-types';

import {useHoverState} from '../../hooks';

const Cursor = props => {
  const {scale} = props;
  const hover = useHoverState();

  const y = scale.y(hover.distance + 0.5);
  const [xmin, xmax] = scale.x.range();

  return (
    hover.toggle && (
      <g>
        <path
          d={`M${xmin},${y} L${xmax},${y}`}
          style={{
            strokeWidth: scale.y(0) - scale.y(1),
            stroke: 'rgba(0, 0, 0, 0.2)',
            zIndex: -1,
          }}
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
