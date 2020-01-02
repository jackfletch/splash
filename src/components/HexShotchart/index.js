import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {hexbin} from 'd3-hexbin';
import {scaleLinear, scaleSequential, scaleSqrt} from 'd3-scale';
import {interpolatePlasma} from 'd3-scale-chromatic';

import Court from '../Court';
import Hexagons from '../Hexagons';
import ShotchartCursor from './ShotchartCursor';
import Tooltip from '../Tooltip';

const Div = styled.div`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  align-self: stretch;
  align-items: center;
  height: auto;
  width: 100%;
  z-index: 1;
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
    this.scales = {
      x: this.xScale,
      y: this.yScale,
    };

    this.radius = scaleSqrt()
      .domain([0, 50])
      .range([0, 10]);
    this.color = scaleSequential(interpolatePlasma).domain([-0.15, 0.15]);
    this.hexbinPath = hexbin()
      .size([this.width, this.height])
      .radius(this.hexbinSize);
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
    const {data, hover, leagueShootingPct} = this.props;

    return (
      <Div>
        <Svg
          display="block"
          height="100%"
          width="100%"
          viewBox={`0 0 ${this.width} ${this.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g>
            <rect
              x={this.xScale(-250)}
              y={this.yScale(417.5)}
              width={this.width}
              height={this.height}
              fill={this.backgroundColor}
              stroke="none"
            />
            <Court
              width={this.width}
              height={this.height}
              scale={this.scales}
            />
            <g clipPath="url(#clip)">
              <Hexagons
                color={this.color}
                data={data}
                hexbinPath={this.hexbinPath}
                hexbinSize={this.hexbinSize}
                leagueShootingPct={leagueShootingPct}
                radius={this.radius}
                scale={this.scales}
                updateTooltip={this.updateTooltip}
              />
            </g>
            {hover.toggle && hover.distance >= 0 ? (
              <ShotchartCursor
                hoverDistance={hover.distance}
                scale={this.scales}
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
  data: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.number.isRequired,
      game_id: PropTypes.number.isRequired,
      game_event_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      player_id: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      made_flag: PropTypes.bool.isRequired,
    })
  ).isRequired,
  hover: PropTypes.exact({
    distance: PropTypes.number.isRequired,
    toggle: PropTypes.bool.isRequired,
  }).isRequired,
  leagueShootingPct: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ShotChart;
