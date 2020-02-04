import React, {useState} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {hexbin} from 'd3-hexbin';
import {scaleLinear, scaleSequential, scaleSqrt} from 'd3-scale';
import {interpolatePlasma} from 'd3-scale-chromatic';

import Court from '../Court';
import ChartDiv from '../ChartDiv';
import Hexagons from '../Hexagons';
import ShotchartCursor from './ShotchartCursor';
import Tooltip from '../Tooltip';

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;
  overflow: visible !important;
`;

const ShotChart = props => {
  const {data, leagueShootingPct} = props;
  const [tooltip, setTooltip] = useState({
    color: 'none',
    makes: '',
    opacity: 0,
    shots: '',
    show: false,
    transform: '',
  });
  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const svgWidth = 540;
  const svgHeight = 500;
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;
  const backgroundColor = '#ddd';
  const hexbinSize = 10;

  const xScale = scaleLinear()
    .domain([-250, 250])
    .range([0, width]);
  const yScale = scaleLinear()
    .domain([-52.5, 417.5])
    .range([height, 0]);
  const scales = {
    x: xScale,
    y: yScale,
  };

  const radius = scaleSqrt()
    .domain([0, 50])
    .range([0, 10]);
  const color = scaleSequential(interpolatePlasma).domain([-0.15, 0.15]);
  const hexbinPath = hexbin()
    .size([width, height])
    .radius(hexbinSize);

  return (
    <ChartDiv>
      <Svg
        display="block"
        height="100%"
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          <rect
            x={xScale(-250)}
            y={yScale(417.5)}
            width={width}
            height={height}
            fill={backgroundColor}
            stroke="none"
          />
          <Court width={width} height={height} scale={scales} />
          <g clipPath="url(#clip)">
            <Hexagons
              color={color}
              data={data}
              hexbinPath={hexbinPath}
              hexbinSize={hexbinSize}
              leagueShootingPct={leagueShootingPct}
              radius={radius}
              scale={scales}
              updateTooltip={setTooltip}
            />
          </g>
          <ShotchartCursor scale={scales} />
          {tooltip.show ? <Tooltip vals={tooltip} /> : null}
        </g>
      </Svg>
    </ChartDiv>
  );
};

ShotChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      game_id: PropTypes.number.isRequired,
      game_event_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      player_id: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      made: PropTypes.bool.isRequired,
    })
  ).isRequired,
  leagueShootingPct: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ShotChart;
