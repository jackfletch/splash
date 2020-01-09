import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryBar,
  VictoryVoronoiContainer,
} from 'victory';

import theme from '../victorytheme';
import ChartTitle from '../ChartTitle';
import Cursor from './Cursor';

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
`;

const GRAY_COLOR = '#2b3137';
const RED_COLOR = '#7c270b';
const styles = {
  parent: {
    background: '#dddddd',
    boxSizing: 'border-box',
    display: 'inline',
    padding: 0,
    width: '100%',
    height: 'auto',
  },
  title: {
    textAnchor: 'start',
    verticalAnchor: 'end',
    fill: '#000000',
    fontFamily: 'inherit',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  labelNumber: {
    textAnchor: 'middle',
    fill: '#ffffff',
    fontFamily: 'inherit',
    fontSize: '14px',
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
  labelOne: {
    fill: GRAY_COLOR,
    fontFamily: 'inherit',
    fontSize: 14,
    fontStyle: 'italic',
  },
  lineOne: {
    data: {fill: 'rgba(43, 49, 55, 0.5)', strokeWidth: 0},
  },
  axisOneCustomLabel: {
    fill: GRAY_COLOR,
    fontFamily: 'inherit',
    fontWeight: 300,
    fontSize: 21,
  },

  // DATA SET TWO
  axisTwo: {
    axis: {stroke: RED_COLOR, strokeWidth: 0},
    tickLabels: {
      fill: RED_COLOR,
      fontFamily: 'inherit',
      fontSize: 16,
    },
  },
  labelTwo: {
    textAnchor: 'end',
    fill: RED_COLOR,
    fontFamily: 'inherit',
    fontSize: 12,
    fontStyle: 'italic',
  },
  lineTwo: {
    data: {stroke: RED_COLOR, strokeWidth: 4.5},
  },

  // HORIZONTAL LINE
  lineThree: {
    data: {stroke: '#e95f46', strokeWidth: 2},
  },
};

const getTickValues = maxDistance =>
  Array(Math.ceil(maxDistance / 5 + 1))
    .fill()
    .map((val, i) => i * 5);

const findMaxY = data => {
  const {bins, totalShots} = data;
  const maxShots = Math.max(...bins.map(d => d.total));
  const maxPct = (maxShots * 100) / totalShots;
  return Math.ceil(maxPct / 5) * 5;
};

const BarChart = props => {
  const {data, hover, maxDistance, setActivated, setDeactivated} = props;
  const tickValues = getTickValues(maxDistance);
  const maxY = findMaxY(data);
  const victoryData = useMemo(() => data.bins.map((d, i) => ({...d, x: i})), [
    data,
  ]);

  return (
    <Div>
      <ChartTitle>Shot Frequency by Distance</ChartTitle>
      <Div2>
        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={d =>
                `shot freq %: ${((100 * d.total) / data.totalShots).toFixed(
                  2
                )}%`
              }
              labelComponent={<Cursor totalShots={data.totalShots} />}
              onActivated={points => {
                setActivated(points[0].x);
              }}
              onDeactivated={points => {
                if (points.length) {
                  setDeactivated(points[0].x);
                }
              }}
              events={{
                onMouseOut: () => {
                  if (!hover.toggle) {
                    setActivated(-15);
                    setDeactivated(-15);
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
            domain={[0, maxY]}
            orientation="left"
            standalone={false}
            style={styles.axisOne}
            tickLabelComponent={<VictoryLabel dx={5} />}
          />
          <VictoryBar
            data={victoryData}
            y={d => (100 * d.total) / data.totalShots}
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
        </VictoryChart>
      </Div2>
    </Div>
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
  hover: PropTypes.exact({
    distance: PropTypes.number.isRequired,
    toggle: PropTypes.bool.isRequired,
  }).isRequired,
  maxDistance: PropTypes.number.isRequired,
  setActivated: PropTypes.func.isRequired,
  setDeactivated: PropTypes.func.isRequired,
};

export default BarChart;
