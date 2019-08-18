import React from 'react'
import PropTypes from 'prop-types'

class Tooltip extends React.Component { // eslint-disable-line
  render() {
    const shotsText = `Shots: ${this.props.vals.makes}/${this.props.vals.shots}`
    const fgpText = `FG%: ${(100 * (this.props.vals.makes / this.props.vals.shots)).toFixed(0)}%`

    return (
      <g transform={this.props.vals.transform}>
        <rect
          width={130}
          height={60}
          rx={5}
          ry={5}
          fill={'#222'}
          fillOpacity={this.props.vals.opacity}
          stroke="none"
          style={this.props.vals.opacity === 0 ? { display: 'none' } : null}
        />
        <g>
          <rect
            x={90}
            y={30}
            width={20}
            height={20}
            rx={5}
            ry={5}
            fill={this.props.vals.color}
            stroke={'#aaa'}
            strokeWidth={2}
          />
          <text x={10} y={20} textAnchor="left" alignmentBaseline="central" style={{ fill: '#ddd' }}>
            {shotsText}
          </text>
          <text x={10} y={40} textAnchor="left" alignmentBaseline="central" style={{ fill: '#ddd' }}>
            {fgpText}
          </text>
        </g>
      </g>
    )
  }
}

Tooltip.propTypes = {
  vals: PropTypes.any.isRequired
}

export default Tooltip
