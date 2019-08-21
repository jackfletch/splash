import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {hexbin} from 'd3-hexbin';
import {scaleLinear, scaleSequential, scaleSqrt} from 'd3-scale';
import {interpolatePlasma} from 'd3-scale-chromatic';

import Court from '../Court';
import Hexagon from '../Hexagon';
import Tooltip from '../Tooltip';

const Div = styled.div`
  flex: 1
  box-sizing: border-box
  background-color: #807200
  display: flex
  align-self: stretch
  align-items: center
  height: auto
  width: 100%
  min-width: 25rem;
  z-index: 1
`;

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;
  overflow: visible !important;
`;

class ShotChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltip: {
        color: 'none',
        makes: '',
        opacity: 0,
        shots: '',
        show: false,
        transform: '',
      },
    };
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    this.svgWidth = 540;
    this.svgHeight = 500;
    this.width = this.svgWidth - this.margin.left - this.margin.right;
    this.height = this.svgHeight - this.margin.top - this.margin.bottom;
    this.backgroundColor = '#ddd';
    this.hexbinSize = 10;

    this.xScale = scaleLinear()
      .domain([-250, 250])
      .range([0, this.width]);
    this.yScale = scaleLinear()
      .domain([-52.5, 417.5])
      .range([this.height, 0]);

    this.updateTooltip = this.updateTooltip.bind(this);
  }

  updateTooltip(e) {
    this.setState({
      tooltip: {
        color: e.color,
        makes: e.makes,
        opacity: e.opacity,
        shots: e.shots,
        show: e.show,
        transform: e.transform,
      },
    });
  }

  render() {
    const {tooltip} = this.state;
    const {data, hover} = this.props;
    const radius = scaleSqrt()
      .domain([0, 50])
      .range([0, 10]);

    const color = scaleSequential(interpolatePlasma).domain([0, 1]);

    const shots = data.map(shot => [shot.x, shot.y, shot.made_flag]);

    const hexbinPath = hexbin()
      .size([this.width, this.height])
      .radius(this.hexbinSize);

    const scales = {
      x: this.xScale,
      y: this.yScale,
    };

    const hexagons = hexbinPath(shots).map(bin => (
      <Hexagon
        key={bin.x.toString() + bin.y.toString()}
        color={color}
        data={bin}
        hexbinPath={hexbinPath}
        hexbinSize={this.hexbinSize}
        radius={radius}
        scale={scales}
        updateTooltip={this.updateTooltip}
      />
    ));

    return (
      <Div>
        <Svg
          display="block"
          height="100%"
          width="100%"
          viewBox={`0 0 ${this.svgWidth} ${this.svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            <rect
              x={this.xScale(-250)}
              y={this.yScale(417.5)}
              width={this.xScale(250) - this.xScale(-250)}
              height={this.yScale(-52.5) - this.yScale(417.5)}
              fill={this.backgroundColor}
              stroke="none"
            />
            <g clipPath="url(#clip)">{hexagons}</g>
            <Court width={this.width} height={this.height} scale={scales} />
            {hover.toggle && hover.distance >= 0 ? (
              <ellipse
                clipPath="url(#clip)"
                cx={this.xScale(0)}
                cy={this.yScale(0)}
                rx={this.xScale((hover.distance + 0.5) * 10) - this.xScale(0)}
                ry={this.yScale(0) - this.yScale((hover.distance + 0.5) * 10)}
                strokeWidth={10}
                fill="none"
                stroke="rgba(0, 0, 0, 0.2)"
              />
            ) : null}
            {tooltip.show ? <Tooltip vals={tooltip} /> : null}
          </g>
        </Svg>
      </Div>
    );
  }
}

ShotChart.propTypes = {
  // data: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     x: PropTypes.number.isRequired,
  //     y: PropTypes.number.isRequired,
  //     made_flag: PropTypes.bool.isRequired,
  //     distance: PropTypes.number.isRequired
  //   }).isRequired
  // ).isRequired,
  data: PropTypes.any.isRequired,
  hover: PropTypes.object.isRequired,
};

export default ShotChart;
