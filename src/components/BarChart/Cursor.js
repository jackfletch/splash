import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Text = styled.text`
  font-size: ${props => (props.main ? 1 : 0.875)}rem;
  text-anchor: ${props => props.textAnchor};
`;

const Cursor = props => {
  const {x, datum, labeler, totalShots} = props;
  let xLoc;
  let newTextAnchor;

  if (datum.x < 30) {
    xLoc = x + 10;
    newTextAnchor = 'start';
  } else {
    xLoc = x - 10;
    newTextAnchor = 'end';
  }

  const {counts, pct} = labeler(totalShots)(datum);
  const pctText = `${pct}%`;
  const countText = `~ ${counts.num} / ${counts.denom}`;
  const distanceText = `@ ${datum.x} ft`;

  return (
    <g>
      <Text main x={xLoc} y={32} textAnchor={newTextAnchor}>
        {pctText}
      </Text>
      <Text x={xLoc} y={50} textAnchor={newTextAnchor}>
        {countText}
      </Text>
      <Text x={xLoc} y={68} textAnchor={newTextAnchor}>
        {distanceText}
      </Text>
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
    total: PropTypes.number.isRequired,
  }),
  labeler: PropTypes.func.isRequired,
  totalShots: PropTypes.number.isRequired,
};

export default Cursor;
