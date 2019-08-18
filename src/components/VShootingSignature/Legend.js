import React from 'react'
import PropTypes from 'prop-types'
import { VictoryAxis, VictoryLabel } from 'victory'


const LegendWrapper = ({ imgHeight, imgWidth, x, y }) => {
  const padding = 2
  const GRAY_COLOR = '#2b3137'
  const style = {
    axis: { stroke: GRAY_COLOR, strokeWidth: 1 },
    ticks: {
      size: 5,
      stroke: GRAY_COLOR,
      strokeWidth: 1
    },
    tickLabels: {
      fill: GRAY_COLOR,
      fontFamily: 'inherit',
      fontSize: 10
    }
  }
  return (
    <g transform={`translate(${x}, ${y})`}>
      <image
        xlinkHref="https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/plasma.png"
        height={imgHeight}
        width={imgWidth}
        preserveAspectRatio="none"
      />
      <VictoryAxis
        standalone={false}
        width={imgWidth}
        height={imgHeight + padding}
        padding={0}
        domain={[-0.25, 0.25]}
        style={style}
        tickFormat={d => `${(100 * d).toFixed(0)}`}
        tickLabelComponent={<VictoryLabel verticalAnchor="middle" dy={-3} />}
      />
      <text
        x={imgWidth / 2}
        y={imgHeight + 30}
        fontSize={12}
        textAnchor="middle"
        fill={GRAY_COLOR}
      >
      FG% vs LeagueAvg
    </text>
    </g>
  )
}

LegendWrapper.propTypes = {
  imgHeight: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default LegendWrapper
