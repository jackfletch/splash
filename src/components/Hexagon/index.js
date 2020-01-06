import React from 'react';
import PropTypes from 'prop-types';

import {distance as euclideanDistance} from '../../lib';

const resetTooltip = updateTooltip => {
  updateTooltip({
    color: 'none',
    makes: '',
    opacity: 0,
    shots: '',
    show: false,
  });
};

const setTooltip = (updateTooltip, props) => {
  updateTooltip({
    ...props,
    opacity: 0.75,
    show: true,
  });
};

const renderSize = (length, hexbinSize) => {
  if (length > hexbinSize) {
    return hexbinSize;
  }
  if (length < 2) {
    return 0;
  }
  return length;
};

const Hexagon = props => {
  const {
    color: colorScale,
    data,
    hexbinPath,
    hexbinSize,
    leagueShootingPct,
    scale,
    radius,
    updateTooltip,
  } = props;
  const {x, y} = data;
  const distance = Math.floor(euclideanDistance({x, y}) / 10);
  const madeShots = data.reduce((a, b) => a + b[2], 0);
  const totalShots = data.length;
  const shootingPct = madeShots / totalShots;
  const shootingPctAboveAvg = shootingPct - leagueShootingPct[distance];
  const color = colorScale(shootingPctAboveAvg);

  const tooltipProps = {
    color,
    makes: madeShots,
    shots: totalShots,
    transform: `translate(${scale.x(x - 65)},${scale.y(y + 80)})`,
  };

  return (
    <g className="hexPath">
      <path
        shapeRendering="geometricPrecision"
        transform={`translate(${scale.x(x)},${scale.y(y)})`}
        d={hexbinPath.hexagon(renderSize(radius(totalShots), hexbinSize))}
        style={{
          fill: color,
        }}
        onMouseEnter={() => setTooltip(updateTooltip, tooltipProps)}
        onMouseLeave={() => resetTooltip(updateTooltip)}
        onClick={() => setTooltip(updateTooltip, tooltipProps)}
      />
    </g>
  );
};

Hexagon.propTypes = {
  color: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  hexbinPath: PropTypes.any.isRequired,
  hexbinSize: PropTypes.number.isRequired,
  leagueShootingPct: PropTypes.arrayOf(PropTypes.number).isRequired,
  updateTooltip: PropTypes.func.isRequired,
  radius: PropTypes.func.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,
};

export default Hexagon;
