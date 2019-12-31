import React from 'react';
import PropTypes from 'prop-types';

const Cursor = ({scale, x}) => {
  const top = scale.y(1);
  const bottom = scale.y(0);
  return (
    <g>
      <path
        d={`M${scale.x(x + 0.5)},${top} L${scale.x(x + 0.5)},${bottom}`}
        style={{strokeWidth: 10, stroke: 'rgba(0, 0, 0, 0.2)'}}
      />
    </g>
  );
};

Cursor.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
  x: PropTypes.number.isRequired,
};

export default Cursor;
