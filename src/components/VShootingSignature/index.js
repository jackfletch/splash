import React from 'react';
import PropTypes from 'prop-types';
import {scaleLinear, scaleSequential} from 'd3-scale';
import {interpolatePlasma} from 'd3-scale-chromatic';
import {area, curveBasis} from 'd3-shape';
import styled from 'styled-components';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
} from 'victory';

import Gradient from './Gradient';
import Legend from './Legend';
import theme from '../victorytheme';

const Div = styled.div`
  flex: 1
  box-sizing: border-box
  background-color: #7e8000
  display: flex
  flex-direction: column
  align-self: stretch
  align-items: center
  height: auto
  width: 100%
  min-width: 25rem
`;
const Div2 = styled.div`
  flex: 1
  box-sizing: border-box
  display: flex
  align-self: stretch
  align-items: center
  height: auto
  width: 100%
  padding: 1em
  position: relative
`;

const ChartTitle = styled.h3`
  color: black;
  font-size: 1.75em
  font-weight: normal
  margin-bottom: 0
`;

const GRAY_COLOR = '#2b3137';
const styles = {
  parent: {
    background: '#dddddd',
    boxSizing: 'border-box',
    display: 'inline',
    padding: 0,
    width: '100%',
    height: '100%',
  },
  title: {
    textAnchor: 'start',
    verticalAnchor: 'end',
    fill: '#000000',
    fontFamily: 'inherit',
    fontSize: '18px',
    fontWeight: 'bold',
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
  labelOne: {
    fill: GRAY_COLOR,
    fontFamily: 'inherit',
    fontSize: 14,
    fontStyle: 'italic',
  },
  lineOne: {
    data: {stroke: 'red', strokeWidth: 2},
  },
  axisOneCustomLabel: {
    fill: GRAY_COLOR,
    fontFamily: 'inherit',
    fontWeight: 300,
    fontSize: 21,
  },
};

const Cursor = ({scale, x}) => (
  <g>
    <path
      d={`M${scale.x(x)},200 L${scale.x(x)},20`}
      style={{strokeWidth: 1, stroke: 'rgba(0, 0, 0, 0.2)'}}
    />
  </g>
);

Cursor.defaultProps = {
  scale: {
    x: d => d,
    y: d => d,
  },
};

Cursor.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
  x: PropTypes.number.isRequired,
};

class VShootingSignature extends React.Component {
  constructor(props) {
    super(props);
    this.margin = {top: 20, right: 20, bottom: 40, left: 60};
    this.svgWidth = 380;
    this.svgHeight = 240;
    this.width = this.svgWidth - this.margin.left - this.margin.right;
    this.height = this.svgHeight - this.margin.top - this.margin.bottom;

    this.backgroundColor = '#dddddd';

    const x = scaleLinear()
      .domain([0, props.maxDistance])
      .range([0, this.width]);

    const y = scaleLinear()
      .domain([0, 1])
      .range([this.height, 0]);

    const w = scaleLinear()
      .domain([0, this.height])
      .range([0, 0.4]);

    this.areaAbove = area()
      .x(d => x(d.x))
      .y0(d => y(d.y) - w(d.widthValue))
      .y1(d => Math.ceil(y(d.y))) // ceil and floor prevent line between areas
      .curve(curveBasis);
    this.areaBelow = area()
      .x(d => x(d.x))
      .y0(d => y(d.y) + w(d.widthValue))
      .y1(d => Math.floor(y(d.y))) // ceil and floor prevent line between areas
      .curve(curveBasis);
    this.xScale = x;
    this.yScale = y;
    this.wScale = w;
  }

  getTickValues() {
    const {maxDistance} = this.props;
    return Array(Math.ceil(maxDistance / 5 + 1))
      .fill()
      .map((val, i) => i * 5);
  }

  formatAreaData(data) {
    return data.map(d => ({
      _x: d.x,
      _y1: d.y + this.wScale(d.widthValue),
      _y0: d.y - this.wScale(d.widthValue),
    }));
  }

  findDomain() {
    const {data} = this.props;
    const maxX = Math.max(...data.map(d => d.x));
    const minX = Math.min(...data.map(d => d.x));
    return [minX, maxX];
  }

  calculateGradientData(data) {
    const offset = scaleLinear()
      .domain(this.findDomain())
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
  }

  render() {
    const {data, hover, maxDistance} = this.props;
    const areaData = this.formatAreaData(data);
    const colorData = this.calculateGradientData(data);

    const tickValues = this.getTickValues();
    const gradientId = 'signaturegradient';
    return (
      <Div>
        <ChartTitle>Shooting Signature</ChartTitle>
        <Div2>
          <VictoryChart
            containerComponent={<VictoryContainer />}
            domain={{x: [0, maxDistance], y: [0, 1]}}
            style={{parent: styles.parent}}
            theme={theme}
            padding={{top: 20, bottom: 100, left: 50, right: 50}}
          >
            <Legend x={250} y={255} imgWidth={150} imgHeight={10} />
            <Gradient colorData={colorData} gradientId={gradientId}>
              <VictoryArea
                standalone={false}
                data={areaData}
                interpolation="basis"
                style={{data: {fill: `url(#${gradientId})`}}}
              />
            </Gradient>
            <VictoryAxis
              scale="linear"
              standalone={false}
              style={styles.axisX}
              tickValues={tickValues}
            />
            <VictoryAxis
              dependentAxis
              orientation="left"
              standalone={false}
              style={styles.axisOne}
              tickFormat={d => `${(100 * d).toFixed(0)}%`}
              tickLabelComponent={<VictoryLabel dx={7} />}
            />
            {hover.toggle ? <Cursor x={hover.distance} /> : null}
          </VictoryChart>
        </Div2>
      </Div>
    );
  }
}

VShootingSignature.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      widthValue: PropTypes.number.isRequired,
      colorValue: PropTypes.number.isRequired,
    })
  ).isRequired,
  hover: PropTypes.object.isRequired,
  maxDistance: PropTypes.number.isRequired,
};

export default VShootingSignature;
