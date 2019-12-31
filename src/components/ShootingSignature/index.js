import React from 'react';
import PropTypes from 'prop-types';
import {scaleLinear, scaleSequential} from 'd3-scale';
import {interpolatePlasma} from 'd3-scale-chromatic';
import {area, curveBasis} from 'd3-shape';
import styled from 'styled-components';

import Cursor from './Cursor';
import Gradient from './Gradient';

const Div = styled.div`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  align-items: center;
  height: auto;
  width: 100%;
  min-width: 15rem;
`;
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

const ChartTitle = styled.h3`
  color: black;
  font-size: 1.75em;
  font-weight: normal;
  margin-bottom: 0;
`;

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;
`;

const findDomain = data => {
  const maxX = Math.max(...data.map(d => d.x));
  const minX = Math.min(...data.map(d => d.x));
  return [minX, maxX];
};

const calculateGradientData = data => {
  const offset = scaleLinear()
    .domain(findDomain(data))
    .range([0, 100]);

  const colorScale = scaleSequential(interpolatePlasma).domain([-0.25, 0.25]);

  const colorData = [];
  const stripe = false; // set stripe to true to prevent linear gradient fading
  for (let i = 0; i < data.length; i++) {
    const prevData = data[i - 1];
    const currData = data[i];
    if (stripe && prevData) {
      colorData.push({
        offset: `${offset(currData.x)}%`,
        stopColor: colorScale(prevData.colorValue),
      });
    }
    colorData.push({
      offset: `${offset(currData.x)}%`,
      stopColor: colorScale(currData.colorValue),
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
  const {data, hover, maxDistance} = props;

  const x = scaleLinear()
    .domain([0, maxDistance])
    .range([0, width]);

  const y = scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  const w = scaleLinear()
    .domain([0, height])
    .range([0, 0.4]);

  const areaAbove = area()
    .x(d => x(d.x))
    .y0(d => y(d.y) - w(d.widthValue))
    .y1(d => Math.ceil(y(d.y))) // ceil and floor prevent line between areas
    .curve(curveBasis);
  const areaBelow = area()
    .x(d => x(d.x))
    .y0(d => y(d.y) + w(d.widthValue))
    .y1(d => Math.floor(y(d.y))) // ceil and floor prevent line between areas
    .curve(curveBasis);

  const colorData = calculateGradientData(data);

  const gradientId = 'signaturegradient';
  return (
    <Div>
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
              {hover.toggle ? (
                <Cursor x={hover.distance} scale={{x, y}} />
              ) : null}
            </g>
          </g>
        </Svg>
      </Div2>
    </Div>
  );
};

ShootingSignature.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      widthValue: PropTypes.number.isRequired,
      colorValue: PropTypes.number.isRequired,
    })
  ).isRequired,
  hover: PropTypes.exact({
    distance: PropTypes.number.isRequired,
    toggle: PropTypes.bool.isRequired,
  }).isRequired,
  maxDistance: PropTypes.number.isRequired,
};

export default ShootingSignature;
