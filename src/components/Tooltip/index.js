import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = props => {
  const {vals} = props;
  const shotsText = `Shots: ${vals.makes}/${vals.shots}`;
  const fgp = (100 * (vals.makes / vals.shots)).toFixed(0);
  const fgpText = `FG%: ${fgp}%`;

  return (
    <g transform={vals.transform}>
      <rect
        width={130}
        height={60}
        rx={5}
        ry={5}
        fill="#222"
        fillOpacity={vals.opacity}
        stroke="none"
        style={vals.opacity === 0 ? {display: 'none'} : null}
      />
      <g>
        <rect
          x={90}
          y={30}
          width={20}
          height={20}
          rx={5}
          ry={5}
          fill={vals.color}
          stroke="#aaa"
          strokeWidth={2}
        />
        <text
          x={10}
          y={20}
          textAnchor="left"
          alignmentBaseline="central"
          style={{fill: '#ddd'}}
        >
          {shotsText}
        </text>
        <text
          x={10}
          y={40}
          textAnchor="left"
          alignmentBaseline="central"
          style={{fill: '#ddd'}}
        >
          {fgpText}
        </text>
      </g>
    </g>
  );
};

Tooltip.propTypes = {
  vals: PropTypes.any.isRequired,
};

export default Tooltip;
