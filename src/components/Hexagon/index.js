import React from 'react';
import PropTypes from 'prop-types';

import {leagueAvgShootingPct} from '../../lib/ribbonShots';
import {distance} from '../../lib';

class Hexagon extends React.Component {
  constructor(props) {
    super(props);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);

    const {data} = this.props;
    const {x, y} = data;
    this.distance = Math.floor(distance({x, y}) / 10);
    this.shootingPct = data.reduce((a, b) => a + b[2], 0) / data.length;
    this.shootingPctAboveAvg =
      this.shootingPct - leagueAvgShootingPct[this.distance] / 100;
  }

  mouseEnter() {
    const {color, data, scale, updateTooltip} = this.props;

    updateTooltip({
      color: color(this.shootingPctAboveAvg),
      makes: data.reduce((a, b) => a + b[2], 0),
      opacity: 0.75,
      shots: data.length,
      show: true,
      transform: `translate(${scale.x(data.x - 65)},${scale.y(data.y + 80)})`,
    });
  }

  mouseLeave() {
    const {updateTooltip} = this.props;
    updateTooltip({
      color: 'none',
      makes: '',
      opacity: 0,
      shots: '',
      show: false,
    });
  }

  renderSize(length) {
    // reduce noise
    const {hexbinSize} = this.props;
    if (length > hexbinSize) {
      return hexbinSize;
    }
    if (length < 2) {
      return 0;
    }
    return length;
  }

  render() {
    const {color, data, hexbinPath, scale, radius} = this.props;
    return (
      <g className="hexPath">
        <path
          shapeRendering="geometricPrecision"
          transform={`translate(${scale.x(data.x)},${scale.y(data.y)})`}
          d={hexbinPath.hexagon(this.renderSize(radius(data.length)))}
          style={{
            fill: color(this.shootingPctAboveAvg),
          }}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
          onClick={this.mouseEnter}
        />
      </g>
    );
  }
}

Hexagon.propTypes = {
  color: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  hexbinPath: PropTypes.any.isRequired,
  hexbinSize: PropTypes.number.isRequired,
  updateTooltip: PropTypes.func.isRequired,
  radius: PropTypes.func.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,
};

export default Hexagon;
