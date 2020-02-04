import React from 'react';
import PropTypes from 'prop-types';

import {useHoverState} from '../../hooks';

const ShotchartCursor = ({scale}) => {
  const hover = useHoverState();

  return (
    hover.toggle && (
      <ellipse
        clipPath="url(#clip)"
        cx={scale.x(0)}
        cy={scale.y(0)}
        rx={scale.x((hover.distance + 0.5) * 10) - scale.x(0)}
        ry={scale.y(0) - scale.y((hover.distance + 0.5) * 10)}
        strokeWidth={10}
        fill="none"
        stroke="rgba(0, 0, 0, 0.2)"
      />
    )
  );
};

ShotchartCursor.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
};

export default ShotchartCursor;
