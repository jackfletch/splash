import React from 'react'
import PropTypes from 'prop-types'

class Hexagon extends React.Component {
  constructor(props) {
    super(props)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
  }

  mouseEnter() {
    const color = this.props.color
    const data = this.props.data

    this.props.updateTooltip({
      color: color(data.reduce((a, b) => a + b[2], 0) / data.length),
      makes: data.reduce((a, b) => a + b[2], 0),
      opacity: 0.75,
      shots: this.props.data.length,
      show: true,
      transform: `translate(${this.props.scale.x(this.props.data.x - 65)},${this.props.scale.y(this.props.data.y + 80)})`
    })
  }

  mouseLeave() {
    this.props.updateTooltip({
      color: 'none',
      makes: '',
      opacity: 0,
      shots: '',
      show: false
    })
  }

  renderSize(length) {
    // reduce noise
    if (length > this.props.hexbinSize) {
      return this.props.hexbinSize
    } else if (length < 2) {
      return 0
    } return length
  }

  render() {
    const color = this.props.color
    const data = this.props.data
    const scale = this.props.scale
    const radius = this.props.radius
    const hexbinPath = this.props.hexbinPath
    return (
      <g className="hexPath">
        <path
          shapeRendering="geometricPrecision"
          transform={`translate(${scale.x(data.x)},${scale.y(data.y)})`}
          d={hexbinPath.hexagon(this.renderSize(radius(data.length)))}
          style={{ fill: color(data.reduce((a, b) => a + b[2], 0) / data.length) }}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
        />
      </g>
    )
  }
}

Hexagon.propTypes = {
  color: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  hexbinPath: PropTypes.any.isRequired,
  hexbinSize: PropTypes.number.isRequired,
  updateTooltip: PropTypes.func.isRequired,
  radius: PropTypes.func.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired
}

export default Hexagon
