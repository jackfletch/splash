import React from 'react';
import PropTypes from 'prop-types';

function Court({
  height,
  lineColor = '#aaa',
  scale,
  strokeWidth = 1.667,
  width,
}) {
  const dThreePointLine = [
    'M',
    scale.x(-220),
    scale.y(-52.5),
    'L',
    scale.x(-220),
    scale.y(89.47765),
    'C',
    scale.x(-184.71),
    scale.y(176.29),
    scale.x(-99.5),
    scale.y(237.5),
    scale.x(0),
    scale.y(237.5),
    'S',
    scale.x(184.71),
    scale.y(176.29),
    scale.x(220),
    scale.y(89.47765),
    'L',
    scale.x(220),
    scale.y(-52.5),
  ].join(' ');

  const arcPoints = {
    sx: scale.x(-60),
    sy: scale.y(137.5),
    x: scale.x(60),
    y: scale.y(137.5),
    rx: scale.x(0) - scale.x(60),
    ry: scale.y(60) - scale.y(0),
    large_arc_flag: 0,
    sweep_flag: 1,
  };
  const dTopFreeThrowArc = [
    'M',
    arcPoints.sx,
    arcPoints.sy,
    'A',
    arcPoints.rx,
    arcPoints.ry,
    0,
    arcPoints.large_arc_flag,
    arcPoints.sweep_flag,
    arcPoints.x,
    arcPoints.y,
  ].join(' ');
  const dBottomFreeThrowArc = [
    'M',
    arcPoints.sx,
    arcPoints.sy,
    'A',
    arcPoints.rx,
    arcPoints.ry,
    0,
    arcPoints.large_arc_flag,
    0,
    arcPoints.x,
    arcPoints.y,
  ].join(' ');

  const restrictedArcPoints = {
    sx: scale.x(-40),
    sy: scale.y(0),
    x: scale.x(40),
    y: scale.y(0),
    rx: scale.x(0) - scale.x(40),
    ry: scale.y(40) - scale.y(0),
    large_arc_flag: 0,
    sweep_flag: 1,
  };

  const dRestrictedArc = [
    'M',
    restrictedArcPoints.sx,
    restrictedArcPoints.sy,
    'A',
    restrictedArcPoints.rx,
    restrictedArcPoints.ry,
    0,
    restrictedArcPoints.large_arc_flag,
    1,
    restrictedArcPoints.x,
    restrictedArcPoints.y,
  ].join(' ');

  const lines = [
    [{x: 60, y: 137.5}, {x: 60, y: -52.5}],
    [{x: -60, y: 137.5}, {x: -60, y: -52.5}],
    [{x: 80, y: 0}, {x: 90, y: 0}],
    [{x: 80, y: 116}, {x: 90, y: 116}],
    [{x: 80, y: 86}, {x: 90, y: 86}],
    [{x: 80, y: 52.5}, {x: 90, y: 52.5}],
    [{x: 80, y: 41}, {x: 90, y: 41}],
    [{x: -80, y: 0}, {x: -90, y: 0}],
    [{x: -80, y: 116}, {x: -90, y: 116}],
    [{x: -80, y: 86}, {x: -90, y: 86}],
    [{x: -80, y: 52.5}, {x: -90, y: 52.5}],
    [{x: -80, y: 41}, {x: -90, y: 41}],
  ];

  return (
    <g className="court">
      {/* 3pt line */}
      <path
        d={dThreePointLine}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* paint */}
      <rect
        x={scale.x(-80)}
        y={scale.y(137.5)}
        width={scale.x(160) - scale.x(0)}
        height={scale.y(0) - scale.y(190)}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* backboard */}
      <rect
        x={scale.x(-30)}
        y={scale.y(-12.5)}
        width={scale.x(60) - scale.x(0)}
        height={scale.y(0) - scale.y(5)}
        fill={lineColor}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* back of the rim */}
      <rect
        x={scale.x(-2.5)}
        y={scale.y(-9)}
        width={scale.x(5) - scale.x(0)}
        height={scale.y(0) - scale.y(5)}
        fill={lineColor}
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* free throw arc */}
      <path
        d={dTopFreeThrowArc}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      <path
        d={dBottomFreeThrowArc}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
        strokeDasharray="13.33,11.67"
      />
      {/* restricted arc */}
      <path
        d={dRestrictedArc}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeLinecap="join"
        strokeLinejoin="milter"
        strokeMiterlimit={10}
      />
      {/* rim */}
      <ellipse
        cx={scale.x(0)}
        cy={scale.y(0)}
        rx={scale.x(9) - scale.x(0)}
        ry={scale.y(0) - scale.y(9)}
        fill="none"
        stroke={lineColor}
        strokeWidth={strokeWidth}
        strokeMiterlimit={10}
      />
      {/* random lines */}
      {lines.map(line => (
        <line
          x1={scale.x(line[0].x)}
          y1={scale.y(line[0].y)}
          x2={scale.x(line[1].x)}
          y2={scale.y(line[1].y)}
          fill="none"
          stroke={lineColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="milter"
          strokeMiterlimit={10}
          key={
            line[0].x.toString() +
            line[0].y.toString() +
            line[1].x.toString() +
            line[1].y.toString()
          }
        />
      ))}

      <clipPath id="clip">
        <rect className="mesh" width={width} height={height} />
      </clipPath>
    </g>
  );
}

Court.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,
  lineColor: PropTypes.string,
  strokeWidth: PropTypes.number,
};

export default React.memo(Court);
