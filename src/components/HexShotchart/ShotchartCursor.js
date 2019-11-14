import React from 'react';
import PropTypes from 'prop-types';

const ShotchartCursor = ({hoverDistance, scale}) => (
  <ellipse
    clipPath="url(#clip)"
    cx={scale.x(0)}
    cy={scale.y(0)}
    rx={scale.x((hoverDistance + 0.5) * 10) - scale.x(0)}
    ry={scale.y(0) - scale.y((hoverDistance + 0.5) * 10)}
    strokeWidth={10}
    fill="none"
    stroke="rgba(0, 0, 0, 0.2)"
  />
);

ShotchartCursor.propTypes = {
  hoverDistance: PropTypes.number.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
};

export default ShotchartCursor;
