import React from 'react'
import PropTypes from 'prop-types'

function Court(props) {
  const xScale = props.scale.x
  const yScale = props.scale.y
  const dThreePointLine = [
    'M', xScale(-220), yScale(-52.5),
    'L', xScale(-220), yScale(89.47765),
    'C', xScale(-184.71), yScale(176.29), xScale(-99.5), yScale(237.5), xScale(0), yScale(237.5),
    'S', xScale(184.71), yScale(176.29), xScale(220), yScale(89.47765),
    'L', xScale(220), yScale(-52.5)
  ].join(' ')

  const arcPoints = {
    sx: xScale(-60),
    sy: yScale(137.5),
    x: xScale(60),
    y: yScale(137.5),
    rx: xScale(0) - xScale(60),
    ry: yScale(60) - yScale(0),
    large_arc_flag: 0,
    sweep_flag: 1
  }
  const dTopFreeThrowArc = [
    'M', arcPoints.sx, arcPoints.sy,
    'A', arcPoints.rx, arcPoints.ry, 0, arcPoints.large_arc_flag, arcPoints.sweep_flag, arcPoints.x, arcPoints.y
  ].join(' ')
  const dBottomFreeThrowArc = [
    'M', arcPoints.sx, arcPoints.sy,
    'A', arcPoints.rx, arcPoints.ry, 0, arcPoints.large_arc_flag, 0, arcPoints.x, arcPoints.y
  ].join(' ')

  const restrictedArcPoints = {
    sx: xScale(-40),
    sy: yScale(0),
    x: xScale(40),
    y: yScale(0),
    rx: xScale(0) - xScale(40),
    ry: yScale(40) - yScale(0),
    large_arc_flag: 0,
    sweep_flag: 1
  }

  const dRestrictedArc = [
    'M', restrictedArcPoints.sx, restrictedArcPoints.sy,
    'A', restrictedArcPoints.rx, restrictedArcPoints.ry, 0, restrictedArcPoints.large_arc_flag, 1, restrictedArcPoints.x, restrictedArcPoints.y
  ].join(' ')

  const lines = [
    [{ x: 60, y: 137.5 },
      { x: 60, y: -52.5 }],
    [{ x: -60, y: 137.5 },
      { x: -60, y: -52.5 }],
    [{ x: 80, y: 0 },
      { x: 90, y: 0 }],
    [{ x: 80, y: 116 },
      { x: 90, y: 116 }],
    [{ x: 80, y: 86 },
      { x: 90, y: 86 }],
    [{ x: 80, y: 52.5 },
      { x: 90, y: 52.5 }],
    [{ x: 80, y: 41 },
      { x: 90, y: 41 }],
    [{ x: -80, y: 0 },
      { x: -90, y: 0 }],
    [{ x: -80, y: 116 },
      { x: -90, y: 116 }],
    [{ x: -80, y: 86 },
      { x: -90, y: 86 }],
    [{ x: -80, y: 52.5 },
      { x: -90, y: 52.5 }],
    [{ x: -80, y: 41 },
      { x: -90, y: 41 }]
  ]

  return (
    <g className="court">
      {/* border */}
      <rect
        x={xScale(-250)}
        y={yScale(417.5)}
        width={xScale(250) - xScale(-250)}
        height={yScale(-52.5) - yScale(417.5)}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* 3pt line */}
      <path
        d={dThreePointLine}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* paint */}
      <rect
        x={xScale(-80)}
        y={yScale(137.5)}
        width={xScale(160) - xScale(0)}
        height={yScale(0) - yScale(190)}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* backboard */}
      <rect
        x={xScale(-30)}
        y={yScale(-12.5)}
        width={xScale(60) - xScale(0)}
        height={yScale(0) - yScale(5)}
        fill={props.lineColor}
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* back of the rim */}
      <rect
        x={xScale(-2.5)}
        y={yScale(-9)}
        width={xScale(5) - xScale(0)}
        height={yScale(0) - yScale(5)}
        fill={props.lineColor}
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* free throw arc */}
      <path
        d={dTopFreeThrowArc}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      <path
        d={dBottomFreeThrowArc}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
        strokeDasharray="13.33,11.67"
      />
      {/* restricted arc */}
      <path
        d={dRestrictedArc}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* rim */}
      <ellipse
        cx={xScale(0)}
        cy={yScale(0)}
        rx={xScale(9) - xScale(0)}
        ry={yScale(0) - yScale(9)}
        fill="none"
        stroke={props.lineColor}
        strokeWidth={props.strokeWidth}
        strokeMiterlimit={10}
      />
      {/* random lines */}
      {lines.map(line =>
        <line
          x1={xScale(line[0].x)}
          y1={yScale(line[0].y)}
          x2={xScale(line[1].x)}
          y2={yScale(line[1].y)}
          fill="none"
          stroke={props.lineColor}
          strokeWidth={props.strokeWidth}
          strokeLinejoin="milter"
          strokeMiterlimit={10}
          key={line[0].x.toString() + line[0].y.toString() +
            line[1].x.toString() + line[1].y.toString()}
        />)}

      <clipPath id="clip">
        <rect
          className="mesh"
          width={props.width}
          height={props.height}
        />
      </clipPath>
    </g>
  )
}

Court.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func
  }).isRequired,
  lineColor: PropTypes.string,
  strokeWidth: PropTypes.number
}

Court.defaultProps = {
  lineColor: '#aaa',
  strokeWidth: 1.67
}

export default Court
