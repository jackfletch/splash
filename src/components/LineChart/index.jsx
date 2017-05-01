import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { VictoryChart, VictoryAxis, VictoryLabel, VictoryLine, VictoryVoronoiContainer } from 'victory'


/* eslint-disable */
const Div = styled.div`
  flex: 1
  box-sizing: border-box
  background-color: #5f7a00
  display: flex
  align-self: stretch
  align-items: center
  height: auto
  width: 100%
  min-width: 25rem
`

const Cursor = ({ x, y, datum, totalShots}) => {
  let xLoc
  let newTextAnchor

  if (datum.x < 25) {
    xLoc = x + 5
    newTextAnchor = 'start'
  } else {
    xLoc = x - 5
    newTextAnchor = 'end'
  }
  return(
    <g>
      <text x={xLoc} y={60} style={{ textAnchor: newTextAnchor, fontSize: '14px' }}>{`${((100 * datum.y) / totalShots).toFixed(2)}%`}</text>
      <path d={`M${x},250 L${x},50`} style={{ strokeWidth: 1, stroke: 'rgba(0, 0, 0, 0.2)' }} />
    </g>
  )
}


class LineChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      maxDistance: props.maxDistance,
    }
    this.updateHover = props.updateHover
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
    const BLUE_COLOR = 'midnightblue'
    const RED_COLOR = '#7c270b'

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
      labelNumber: {
        textAnchor: 'middle',
        fill: '#ffffff',
        fontFamily: 'inherit',
        fontSize: '14px'
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
        data: { stroke: "red", strokeWidth: 2 }
      },
      axisOneCustomLabel: {
        fill: GRAY_COLOR,
        fontFamily: 'inherit',
        fontWeight: 300,
        fontSize: 21
      },

      // DATA SET TWO
      axisTwo: {
        axis: { stroke: RED_COLOR, strokeWidth: 0 },
        tickLabels: {
          fill: RED_COLOR,
          fontFamily: 'inherit',
          fontSize: 16
        }
      },
      labelTwo: {
        textAnchor: 'end',
        fill: RED_COLOR,
        fontFamily: 'inherit',
        fontSize: 12,
        fontStyle: 'italic'
      },
      lineTwo: {
        data: { stroke: RED_COLOR, strokeWidth: 4.5 }
      },

      // HORIZONTAL LINE
      lineThree: {
        data: { stroke: '#e95f46', strokeWidth: 2 }
      }
    }
  }

  render() {
    const data = this.state.data.binData
    const tickValues = this.getTickValues()
    const styles = this.getStyles()

    return (
      <Div>
        <VictoryChart
          containerComponent={
            <VictoryVoronoiContainer
              dimension="x"
              labels={d => `shot freq %: ${((100 * d.y) / this.state.data.totalShots).toFixed(2)}%`}
              labelComponent={<Cursor totalShots={this.state.data.totalShots}/>}
              onDeactivated={(points)=>{
                return (null)
              }
                }
              onActivated={(points) => {
                return (this.updateHover({
                  distance: points[0].x,
                  toggle: true
                }))
              }
                }
            />
          }
          style={{ parent: styles.parent }}
        >
          <VictoryAxis
            scale="linear"
            standalone={false}
            style={styles.axisX}
            tickValues={tickValues}
            tickLabelComponent={<VictoryLabel dy={-0.5}/>}
          />
          <VictoryAxis
            dependentAxis
            domain={[0, 25]}
            orientation="left"
            standalone={false}
            style={styles.axisOne}
            tickLabelComponent={<VictoryLabel dx={5} />}
          />
          <VictoryLine
            data={data}
            y={d => (100 * d.y) / this.state.data.totalShots}
            domain={{
              x: [0, this.state.maxDistance],
              y: [0, 1]
            }}
            interpolation="monotoneX"
            scale={{ x: 'linear', y: 'linear' }}
            standalone={false}
            style={styles.lineOne}
          />
        </VictoryChart>
      </Div>
    )
  }
}

LineChart.propTypes = {
  data: PropTypes.any.isRequired,
  updateHover: PropTypes.func.isRequired,
  maxDistance: PropTypes.number.isRequired
}

export default LineChart
