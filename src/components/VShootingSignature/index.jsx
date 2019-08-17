import React from 'react'
import PropTypes from 'prop-types'
import * as d3Shape from 'd3-shape'
import * as d3Scale from 'd3-scale'
import styled from 'styled-components'
import { VictoryArea, VictoryAxis, VictoryChart, VictoryContainer, VictoryLabel } from 'victory'

import Gradient from './Gradient'
import Legend from './Legend'
import theme from './../victorytheme'

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
`
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
`

const ChartTitle = styled.h3`
  color: black;
  font-size: 1.75em
  font-weight: normal
  margin-bottom: 0
`

const Cursor = props => (
  <g>
    <path d={`M${props.scale.x(props.x)},250 L${props.scale.x(props.x)},50`} style={{ strokeWidth: 1, stroke: 'rgba(0, 0, 0, 0.2)' }} />
  </g>
  )

Cursor.defaultProps = {
  scale: {
    x: d => d,
    y: d => d
  }
}

Cursor.propTypes = {
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired
  }),
  x: PropTypes.number.isRequired
}

class VShootingSignature extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      hover: props.hover,
      maxDistance: props.maxDistance
    }
  }

  componentWillMount() {
    this.margin = { top: 20, right: 20, bottom: 40, left: 60 }
    this.svgWidth = 380
    this.svgHeight = 240
    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom

    this.backgroundColor = '#dddddd'

    const x = d3Scale.scaleLinear()
      .domain([0, this.state.maxDistance])
      .range([0, this.width])

    const y = d3Scale.scaleLinear()
      .domain([0, 1])
      .range([this.height, 0])

    const w = d3Scale.scaleLinear()
      .domain([0, this.height])
      .range([0, 0.4])

    this.areaAbove = d3Shape.area()
      .x(d => x(d.x))
      .y0(d => y(d.y) - w(d.widthValue))
      .y1(d => Math.ceil(y(d.y))) // ceil and floor prevent line between areas
      .curve(d3Shape.curveBasis)
    this.areaBelow = d3Shape.area()
      .x(d => x(d.x))
      .y0(d => y(d.y) + w(d.widthValue))
      .y1(d => Math.floor(y(d.y))) // ceil and floor prevent line between areas
      .curve(d3Shape.curveBasis)
    this.xScale = x
    this.yScale = y
    this.wScale = w

    this.areaData = this.formatAreaData(this.state.data)
    this.calculateGradientData()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      hover: nextProps.hover,
      maxDistance: nextProps.maxDistance
    })
  }

  componentWillUpdate(nextProps, nextState) {
    this.areaData = this.formatAreaData(nextState.data)
    this.calculateGradientData()
  }

  getTickValues() {
    return Array((this.state.maxDistance / 5) + 1).fill().map((val, i) => i * 5)
  }

  getStyles() {
    const GRAY_COLOR = '#2b3137'

    return {
      parent: {
        background: '#dddddd',
        boxSizing: 'border-box',
        display: 'inline',
        padding: 0,
        width: '100%',
        height: '100%'
      },
      title: {
        textAnchor: 'start',
        verticalAnchor: 'end',
        fill: '#000000',
        fontFamily: 'inherit',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      // INDEPENDENT AXIS
      axisX: {
        axis: { stroke: GRAY_COLOR, strokeWidth: 1 },
        ticks: {
          size: (tick) => {
            const tickSize =
              tick % 5 === 0 ? 10 : 5
            return tickSize
          },
          stroke: GRAY_COLOR,
          strokeWidth: 1
        },
        tickLabels: {
          fill: GRAY_COLOR,
          fontFamily: 'inherit',
          fontSize: 14
        }
      },

      // DATA SET ONE
      axisOne: {
        axis: { stroke: GRAY_COLOR, strokeWidth: 1 },
        ticks: {
          size: (tick) => {
            const tickSize =
              tick % 5 === 0 ? 10 : 5
            return tickSize
          },
          stroke: GRAY_COLOR,
          strokeWidth: 1
        },
        tickLabels: {
          fill: GRAY_COLOR,
          fontFamily: 'inherit',
          fontSize: 14
        }
      },
      labelOne: {
        fill: GRAY_COLOR,
        fontFamily: 'inherit',
        fontSize: 14,
        fontStyle: 'italic'
      },
      lineOne: {
        data: { stroke: 'red', strokeWidth: 2 }
      },
      axisOneCustomLabel: {
        fill: GRAY_COLOR,
        fontFamily: 'inherit',
        fontWeight: 300,
        fontSize: 21
      }
    }
  }

  formatAreaData(data) {
    return data.map(d => ({
      _x: d.x,
      _y1: d.y + this.wScale(d.widthValue),
      _y0: d.y - this.wScale(d.widthValue)
    }))
  }

  findDomain() {
    const maxX = Math.max(...this.state.data.map(d => d.x))
    const minX = Math.min(...this.state.data.map(d => d.x))
    return [minX, maxX]
  }

  calculateGradientData() {
    const offset = d3Scale.scaleLinear()
      .domain(this.findDomain())
      .range([0, 100])

    const colorScale = d3Scale.scaleSequential(d3Scale.interpolatePlasma)
      .domain([-0.25, 0.25])

    this.colorData = []
    const stripe = false // set stripe to true to prevent linear gradient fading
    for (let i = 0; i < this.state.data.length; i++) {
      const prevData = this.state.data[i - 1]
      const currData = this.state.data[i]
      if (stripe && prevData) {
        this.colorData.push({
          offset: `${offset(currData.x)}%`,
          stopColor: colorScale(prevData.colorValue)
        })
      }
      this.colorData.push({
        offset: `${offset(currData.x)}%`,
        stopColor: colorScale(currData.colorValue)
      })
    }
  }

  render() {
    const styles = this.getStyles()
    const tickValues = this.getTickValues()
    const gradientId = 'signaturegradient'
    return (
      <Div>
        <ChartTitle>Shooting Signature</ChartTitle>
        <Div2>
          <div
            className="signature-explanation-toggle"
            style={{
              position: 'absolute',
              borderRadius: '50%',
              right: '2em',
              top: '2em',
              width: 16,
              height: 16,
              backgroundColor: '#eee',
              color: '#aaa',
              textAlign: 'center',
              cursor: 'help'
            }}
          >
            ?
            <img src="https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/plasma.png" alt="signature explanation" className="signature-explanation" />
          </div>
          <VictoryChart
            containerComponent={<VictoryContainer />}
            domain={{ x: [0, this.state.maxDistance], y: [0, 1] }}
            style={{ parent: styles.parent }}
            theme={theme}
            padding={{ top: 20, bottom: 100, left: 50, right: 50 }}
          >
            <VictoryLabel
              text="Shooting Signature"
              dx={'50%'}
              y={10}
              textAnchor="middle"
              verticalAnchor="start"
              style={{ fontSize: 24 }}
              theme={theme}
            />
            <Legend
              x={250}
              y={255}
              imgWidth={150}
              imgHeight={10}
            />
            <Gradient colorData={this.colorData} gradientId={gradientId} >
              <VictoryArea
                standalone={false}
                data={this.areaData}
                interpolation={'basis'}
                style={{ data: { fill: `url(#${gradientId})` } }}
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
            {this.state.hover.toggle ?
              <Cursor x={this.state.hover.distance} /> :
            null
          }
          </VictoryChart>
        </Div2>
      </Div>
    )
  }
}

VShootingSignature.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      widthValue: PropTypes.number.isRequired,
      colorValue: PropTypes.number.isRequired
    })
  ).isRequired,
  hover: PropTypes.object.isRequired,
  maxDistance: PropTypes.number.isRequired
}

export default VShootingSignature
