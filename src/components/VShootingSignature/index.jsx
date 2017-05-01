import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import styled from 'styled-components'
import { VictoryArea, VictoryAxis, VictoryChart, VictoryLabel } from 'victory'

import MyWrapper from './Wrapper'

const Div = styled.div`
  flex: 1
  box-sizing: border-box
  background-color: #7e8000
  display: flex
  align-self: stretch
  align-items: center
  height: auto
  width: 100%
  min-width: 25rem;
`

class VShootingSignature extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
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

    const x = d3.scaleLinear()
      .domain([0, this.state.maxDistance])
      .range([0, this.width])

    const y = d3.scaleLinear()
      .domain([0, 1])
      .range([this.height, 0])

    const offset = d3.scaleLinear()
      .domain(x.domain())
      .range([0, 100])

    const w = d3.scaleLinear()
      .domain([0, this.height])
      .range([0, 0.4])

    this.areaAbove = d3.area()
      .x(d => x(d.x))
      .y0(d => y(d.y) - w(d.widthValue))
      .y1(d => Math.ceil(y(d.y))) // ceil and floor prevent line between areas
      .curve(d3.curveBasis)
    this.areaBelow = d3.area()
      .x(d => x(d.x))
      .y0(d => y(d.y) + w(d.widthValue))
      .y1(d => Math.floor(y(d.y))) // ceil and floor prevent line between areas
      .curve(d3.curveBasis)
    this.xScale = x
    this.yScale = y
    this.wScale = w

    const colorScale = d3.scaleSequential(d3.interpolatePlasma)
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

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      maxDistance: nextProps.maxDistance
    })
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
        margin: 20,
        fontFamily: "'Fira Sans', sans-serif",
        width: '100%',
        height: 'auto'
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

  formatData(data) {
    return data.map(d => ({
      _x: d.x,
      _y1: d.y + this.wScale(d.widthValue),
      _y0: d.y - this.wScale(d.widthValue)
    }))
  }

  render() {
    const styles = this.getStyles()
    const tickValues = this.getTickValues()
    const gradientId = 'signaturegradient'

    return (
      <Div>
        <VictoryChart
          domain={{ x: [0, this.state.maxDistance], y: [0, 1.2] }}
          style={{ parent: styles.parent }}
        >
          <MyWrapper colorData={this.colorData} gradientId={gradientId} >
            <VictoryArea
              standalone={false}
              data={this.formatData(this.state.data)}
              interpolation={'basis'}
              style={{ data: { fill: `url(#${gradientId})` } }}
            />
          </MyWrapper>
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
        </VictoryChart>
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
  maxDistance: PropTypes.number.isRequired
}

export default VShootingSignature
