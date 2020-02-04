import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';
import styled from 'styled-components';
import {
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryBar,
  VictoryVoronoiContainer,
} from 'victory';

import {useHover} from '../../hooks';
import theme from '../victorytheme';
import ChartDiv from '../ChartDiv';
import ChartTitle from '../ChartTitle';
import Cursor from './Cursor';

const Div2 = styled.div`
  flex: 1;
  box-sizing: border-box;
  display: flex;
  align-self: stretch;
  align-items: center;
  height: auto;
  width: 100%;
`;

const GRAY_COLOR = '#2b3137';
const styles = {
  parent: {
    boxSizing: 'border-box',
    display: 'inline',
    padding: 0,
    width: '100%',
    height: 'auto',
  },
  // INDEPENDENT AXIS
  axisX: {
    axis: {stroke: GRAY_COLOR, strokeWidth: 1},
    ticks: {
      size: tick => {
        const tickSize = tick % 5 === 0 ? 10 : 5;
        return tickSize;
      },
      stroke: GRAY_COLOR,
      strokeWidth: 1,
    },
    tickLabels: {
      fill: GRAY_COLOR,
      fontFamily: 'inherit',
      fontSize: 14,
    },
  },

  // DATA SET ONE
  axisOne: {
    axis: {stroke: GRAY_COLOR, strokeWidth: 1},
    ticks: {
      size: tick => (tick % 5 === 0 ? 10 : 5),
      stroke: GRAY_COLOR,
      strokeWidth: 1,
    },
    tickLabels: {
      fill: GRAY_COLOR,
      fontFamily: 'inherit',
      fontSize: 14,
    },
  },
  lineOne: {
    data: {fill: 'rgba(43, 49, 55, 0.5)', strokeWidth: 0},
  },
};

const getTickValues = maxDistance =>
  Array(Math.ceil(maxDistance / 5 + 1))
    .fill()
    .map((val, i) => i * 5);

const findMaxY = (data, yAccessor) => {
  const {bins, totalShots} = data;
  const yValues = bins.map(yAccessor(totalShots)).filter(y => !Number.isNaN(y));
  const max = Math.max(...yValues);
  return Math.ceil(max / 5) * 5;
};

const PercentAxisTickLabel = props => {
  const {text, ...otherProps} = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <VictoryLabel {...otherProps} text={`${text}%`} />
  );
};

PercentAxisTickLabel.propTypes = {
  text: PropTypes.string,
};

const BarChart = props => {
  const {data, domain, label, maxDistance, title, y} = props;
  const {height, padding, width} = theme.area;

  const [hover, dispatchHover] = useHover();

  const xScale = scaleLinear()
    .domain([0, maxDistance])
    .range([padding.left, width - padding.right]);
  const yScale = scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
  const scales = {
    x: xScale,
    y: yScale,
  };

  const tickValues = getTickValues(maxDistance);
  const maxY = findMaxY(data, y);
  const victoryData = useMemo(() => data.bins.map((d, i) => ({...d, x: i})), [
    data,
  ]);

  return (
    <ChartDiv>
      <ChartTitle>{title}</ChartTitle>
      <Div2>
        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              onActivated={points => {
                dispatchHover({type: 'activate', value: points[0].x});
              }}
              onDeactivated={points => {
                if (points.length) {
                  dispatchHover({type: 'deactivate', value: points[0].x});
                }
              }}
              events={{
                onMouseOut: () => {
                  if (!hover.toggle) {
                    dispatchHover({type: 'reset'});
                  }
                },
              }}
            />
          }
          theme={theme}
          style={{parent: styles.parent}}
        >
          <VictoryAxis
            scale="linear"
            standalone={false}
            style={styles.axisX}
            tickValues={tickValues}
            tickLabelComponent={<VictoryLabel dy={-0.5} />}
          />
          <VictoryAxis
            dependentAxis
            domain={domain ?? [0, maxY]}
            orientation="left"
            standalone={false}
            style={styles.axisOne}
            tickLabelComponent={<PercentAxisTickLabel dx={5} />}
          />
          <VictoryBar
            data={victoryData}
            y={y(data.totalShots)}
            x={d => d.x + 0.5}
            domain={{
              x: [0, maxDistance],
              y: [0, 1],
            }}
            interpolation="monotoneX"
            scale={{x: 'linear', y: 'linear'}}
            standalone={false}
            style={styles.lineOne}
          />
          {hover.toggle && hover.distance >= 0 && (
            <Cursor
              x={scales.x(hover.distance + 0.5)}
              datum={{x: hover.distance, ...data.bins[hover.distance]}}
              totalShots={data.totalShots}
              labeler={label}
            />
          )}
        </VictoryChart>
      </Div2>
    </ChartDiv>
  );
};

BarChart.propTypes = {
  data: PropTypes.exact({
    bins: PropTypes.arrayOf(
      PropTypes.exact({
        made: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ),
    totalMakes: PropTypes.number.isRequired,
    totalShots: PropTypes.number.isRequired,
    totalShotsWithinMaxDistance: PropTypes.number.isRequired,
  }).isRequired,
  domain: PropTypes.arrayOf(PropTypes.number),
  label: PropTypes.func.isRequired,
  maxDistance: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  y: PropTypes.func.isRequired,
};

export default BarChart;
export {default as functions} from './functions';
