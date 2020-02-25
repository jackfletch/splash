import React from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';

import ChartDiv from '../ChartDiv';
import ChartTitle from '../ChartTitle';
import {XAxis, YAxis} from './Axis';
import Cursor from './Cursor';
import {Rect, Svg} from './style';

const margin = {top: 20, right: 50, bottom: 50, left: 50};
const svgWidth = 450;
const svgHeight = 300;

const barWidth = 0.8;
const barPadding = 1 - barWidth;

const LeftRightChart = props => {
  const {accessor, data, domain, maxDistance, title} = props;

  const xDomain = React.useMemo(() => domain(data), [data, domain]);
  const xScale = scaleLinear()
    .domain(xDomain)
    .range([margin.left, svgWidth - margin.right]);
  const yScale = scaleLinear()
    .domain([0, maxDistance])
    .range([svgHeight - margin.bottom, margin.top]);
  const scales = {
    x: xScale,
    y: yScale,
  };

  return (
    <ChartDiv>
      <ChartTitle>{title}</ChartTitle>
      <Svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <XAxis scale={scales} />
        <YAxis scale={scales} />
        {data.left?.map(
          (d, i) =>
            d.total !== 0 && (
              <Rect
                x={xScale(-accessor(d))}
                y={yScale(i + 1 - barPadding / 2)}
                width={xScale(0) - xScale(-accessor(d))}
                height={yScale(0) - yScale(1 - barPadding)}
                key={`${i}-${d.total}`}
              />
            )
        )}
        {data.right?.map(
          (d, i) =>
            d.total !== 0 && (
              <Rect
                x={xScale(0)}
                y={yScale(i + 1 - barPadding / 2)}
                width={xScale(accessor(d)) - xScale(0)}
                height={yScale(0) - yScale(1 - barPadding)}
                key={`${i}-${d.total}`}
              />
            )
        )}
        <Cursor scale={scales} />
      </Svg>
    </ChartDiv>
  );
};

LeftRightChart.propTypes = {
  accessor: PropTypes.func.isRequired,
  data: PropTypes.exact({
    left: PropTypes.arrayOf(
      PropTypes.exact({
        made: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ),
    right: PropTypes.arrayOf(
      PropTypes.exact({
        made: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  domain: PropTypes.func.isRequired,
  maxDistance: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default LeftRightChart;
export {default as functions} from './functions';
