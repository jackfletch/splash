import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as d3 from 'd3'
import { hexbin } from 'd3-hexbin'

import Court from '../Court'
import Hexagon from '../Hexagon'
import Tooltip from '../Tooltip'

const Div = styled.div`
  flex: 1
  box-sizing: border-box
  background-color: #807200
  display: flex
  align-self: stretch
  align-items: center
  height: auto
  width: 100%
  min-width: 25rem;
  z-index: 1
`

const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;
  overflow: visible !important;
`

class ShotChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data,
      tooltip: {
        color: 'none',
        makes: '',
        opacity: 0,
        shots: '',
        show: false,
        transform: ''
      }
    }
    this.updateTooltip = this.updateTooltip.bind(this)
  }

  componentWillMount() {
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 }
    this.svgWidth = 540
    this.svgHeight = 500
    this.width = this.svgWidth - this.margin.left - this.margin.right
    this.height = this.svgHeight - this.margin.top - this.margin.bottom
    this.backgroundColor = '#ddd'
    this.hexbinSize = 10

    this.xScale = d3.scaleLinear().domain([-250, 250]).range([0, this.width])
    this.yScale = d3.scaleLinear().domain([-52.5, 417.5]).range([this.height, 0])
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    })
  }

  updateTooltip(e) {
    this.setState({
      tooltip: {
        color: e.color,
        makes: e.makes,
        opacity: e.opacity,
        shots: e.shots,
        show: e.show,
        transform: e.transform
      }
    })
  }

  render() {
    const radius = d3.scaleSqrt()
      .domain([0, 50])
      .range([0, 10])

    const color = d3.scaleSequential(d3.interpolatePlasma)
      .domain([0, 1])

    const points = d3.range(Object.keys(this.state.data).length).map(i => [this.state.data[i].x, this.state.data[i].y, this.state.data[i].make])

    const hexbinPath = hexbin()
      .size([this.width, this.height])
      .radius(this.hexbinSize)

    const scales = {
      x: this.xScale,
      y: this.yScale
    }

    const hexagons = hexbinPath(points).map(data =>
      <Hexagon
        key={data.x.toString() + data.y.toString()}
        color={color}
        data={data}
        hexbinPath={hexbinPath}
        hexbinSize={this.hexbinSize}
        radius={radius}
        scale={scales}
        updateTooltip={this.updateTooltip}
      />
    )

    return (
      <Div>
        <Svg display="block" height="100%" width="100%" viewBox={`0 0 ${this.svgWidth} ${this.svgHeight}`} preserveAspectRatio="xMidYMid meet">
          <g transform={`translate(${this.margin.left}, ${this.margin.top})`}>
            <rect
              x={this.xScale(-250)}
              y={this.yScale(417.5)}
              width={this.xScale(250) - this.xScale(-250)}
              height={this.yScale(-52.5) - this.yScale(417.5)}
              fill={this.backgroundColor}
              stroke="none"
            />
            <g clipPath="url(#clip)">
              {hexagons}
            </g>
            <Court
              width={this.width}
              height={this.height}
              scale={scales}
            />
            <ellipse
              clipPath="url(#clip)"
              cx={this.xScale(0)}
              cy={this.yScale(0)}
              rx={this.xScale((this.props.hover.distance + 0.5) * 10) - this.xScale(0)}
              ry={this.yScale(0) - this.yScale((this.props.hover.distance + 0.5) * 10)}
              style={this.props.hover.toggle ? null : { display: 'none' }}
              strokeWidth={10}
              fill="none"
              stroke={'rgba(0, 0, 0, 0.2)'}
            />

            {this.state.tooltip.show ? <Tooltip vals={this.state.tooltip} /> : null}
          </g>
        </Svg>
      </Div>
    )
  }
}

ShotChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      make: PropTypes.number.isRequired,
      distance: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,
  hover: PropTypes.object.isRequired
}

export default ShotChart
