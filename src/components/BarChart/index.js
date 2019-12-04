import React, {Component} from 'react';
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

const ChartTitle = styled.h3`
  color: black;
  font-size: 1.75em;
  font-weight: normal;
  margin-bottom: 0;
`;

const Cursor = ({x, datum, totalShots}) => {
  let xLoc;
  let newTextAnchor;

  if (datum.x < 30) {
    xLoc = x + 10;
    newTextAnchor = 'start';
  } else {
    xLoc = x - 10;
    newTextAnchor = 'end';
  }
  return (
    <g>
      <text
        x={xLoc}
        y={30}
        style={{textAnchor: newTextAnchor, fontSize: '16px'}}
      >{`${((100 * datum.y) / totalShots).toFixed(2)}%`}</text>
      <text
        x={xLoc}
        y={50}
        style={{textAnchor: newTextAnchor, fontSize: '14px'}}
      >{`${datum.y} shot${datum.y === 1 ? '' : 's'}`}</text>
      <text
        x={xLoc}
        y={65}
        style={{textAnchor: newTextAnchor, fontSize: '14px'}}
      >{`@ ${datum.x} ft`}</text>
      <path
        d={`M${x},250 L${x},20`}
        style={{
          strokeWidth: 10,
          stroke: 'rgba(0, 0, 0, 0.2)',
        }}
      />
    </g>
  );
};

Cursor.propTypes = {
  x: PropTypes.number,
  datum: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  totalShots: PropTypes.number.isRequired,
};

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

class BarChart extends Component {
  getTickValues() {
    const {maxDistance} = this.props;
    return Array(Math.ceil(maxDistance / 5 + 1))
      .fill()
      .map((val, i) => i * 5);
  }

  findMaxY() {
    const {data} = this.props;
    const maxShots = Math.max(...data.binData.map(d => d.y));
    const maxPct = (maxShots * 100) / data.totalShots;
    return Math.ceil(maxPct / 5) * 5;
  }

  render() {
    const {data, hover, maxDistance, setActivated, setDeactivated} = this.props;
    const tickValues = this.getTickValues();
    const maxY = this.findMaxY();

    return (
      <Div>
        <ChartTitle>Shot Frequency by Distance</ChartTitle>
        <Div2>
          <VictoryChart
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                labels={d =>
                  `shot freq %: ${((100 * d.y) / data.totalShots).toFixed(2)}%`
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
              data={data.binData}
              y={d => (100 * d.y) / data.totalShots}
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
  }
}

BarChart.propTypes = {
  data: PropTypes.exact({
    binData: PropTypes.arrayOf(
      PropTypes.exact({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      })
    ),
    totalMakes: PropTypes.number.isRequired,
    totalShots: PropTypes.number.isRequired,
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
