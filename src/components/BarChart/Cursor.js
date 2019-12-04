import React from 'react';
import PropTypes from 'prop-types';

const Cursor = ({x, datum, totalShots}) => {
  let xLoc;
  let newTextAnchor;

  if (datum.x < 30) {
    xLoc = x + 10;
    newTextAnchor = 'start';
  } else {
    xLoc = x - 10;
    newTextAnchor = 'end';
  }
  return (
    <g>
      <text
        x={xLoc}
        y={30}
        style={{textAnchor: newTextAnchor, fontSize: '16px'}}
      >{`${((100 * datum.y) / totalShots).toFixed(2)}%`}</text>
      <text
        x={xLoc}
        y={50}
        style={{textAnchor: newTextAnchor, fontSize: '14px'}}
      >{`${datum.y} shot${datum.y === 1 ? '' : 's'}`}</text>
      <text
        x={xLoc}
        y={65}
        style={{textAnchor: newTextAnchor, fontSize: '14px'}}
      >{`@ ${datum.x} ft`}</text>
      <path
        d={`M${x},250 L${x},20`}
        style={{
          strokeWidth: 10,
          stroke: 'rgba(0, 0, 0, 0.2)',
        }}
      />
    </g>
  );
};

Cursor.propTypes = {
  x: PropTypes.number,
  datum: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  totalShots: PropTypes.number.isRequired,
};

export default Cursor;
