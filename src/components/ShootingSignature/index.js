import React from 'react';
import PropTypes from 'prop-types';
import {scaleLinear, scaleSequential} from 'd3-scale';
import {interpolatePlasma} from 'd3-scale-chromatic';
import {area, curveBasis} from 'd3-shape';
import styled from 'styled-components';

import ChartDiv from '../ChartDiv';
import ChartTitle from '../ChartTitle';
import Cursor from './Cursor';
import Gradient from './Gradient';

const Div2 = styled.div`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  align-self: stretch;
  align-items: center;
  height: auto;
  width: 100%;
  position: relative;
`;

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;
`;

const calculateGradientData = (data, leagueShootingPct, maxDistance) => {
  const offset = scaleLinear()
    .domain([0, maxDistance])
    .range([0, 100]);

  const colorScale = scaleSequential(interpolatePlasma).domain([-0.15, 0.15]);

  const colorData = [];
  const stripe = false; // set stripe to true to prevent linear gradient fading
  for (let i = 0; i < data.length; i++) {
    const prevData = data[i - 1];
    const currData = data[i];
    if (stripe && prevData) {
      const prevColor = prevData.shootingPct - leagueShootingPct[i - 1];
      colorData.push({
        offset: `${offset(i)}%`,
        stopColor: colorScale(prevColor),
      });
    }
    const currColor = currData.shootingPct - leagueShootingPct[i];
    colorData.push({
      offset: `${offset(i)}%`,
      stopColor: colorScale(currColor),
    });
  }
  return colorData;
};

const margin = {top: 0, right: 0, bottom: 0, left: 0};
const svgWidth = 400;
const svgHeight = 200;
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

const ShootingSignature = props => {
  const {data, leagueShootingPct, maxDistance} = props;

  const x = scaleLinear()
    .domain([0, maxDistance])
    .range([0, width]);

  const y = scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  const w = scaleLinear()
    .domain([0, 1])
    .range([1, height]);

  const areaAbove = area()
    .x((d, i) => x(i))
    .y0(d => y(d.shootingPct) - w(d.width))
    .y1(d => Math.ceil(y(d.shootingPct))) // ceil and floor prevent line between areas
    .curve(curveBasis);
  const areaBelow = area()
    .x((d, i) => x(i))
    .y0(d => y(d.shootingPct) + w(d.width))
    .y1(d => Math.floor(y(d.shootingPct))) // ceil and floor prevent line between areas
    .curve(curveBasis);

  const colorData = calculateGradientData(data, leagueShootingPct, maxDistance);

  const gradientId = 'signaturegradient';
  return (
    <ChartDiv>
      <ChartTitle>Shooting Signature</ChartTitle>
      <Div2>
        <Svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <g className="area-group">
              <Gradient colorData={colorData} gradientId={gradientId}>
                <path
                  className="area area-above"
                  d={areaAbove(data)}
                  style={{fill: `url(#${gradientId})`}}
                />
                <path
                  className="area area-below"
                  d={areaBelow(data)}
                  style={{fill: `url(#${gradientId})`}}
                />
              </Gradient>
              <Cursor scale={{x, y}} />
            </g>
          </g>
        </Svg>
      </Div2>
    </ChartDiv>
  );
};

ShootingSignature.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      shootingPct: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
    })
  ).isRequired,
  leagueShootingPct: PropTypes.arrayOf(PropTypes.number).isRequired,
  maxDistance: PropTypes.number.isRequired,
};

export default ShootingSignature;
