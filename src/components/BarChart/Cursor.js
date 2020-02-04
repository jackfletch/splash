import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {useHoverState} from '../../hooks';

const Text = styled.text`
  font-size: ${props => (props.main ? 1 : 0.875)}rem;
  text-anchor: ${props => props.textAnchor};
`;

const Cursor = props => {
  const {datum, labeler, scale, totalShots} = props;
  const hover = useHoverState();

  const x = scale.x(hover.distance + 0.5);
  let xLoc;
  let newTextAnchor;

  if (hover.distance < 30) {
    xLoc = x + 10;
    newTextAnchor = 'start';
  } else {
    xLoc = x - 10;
    newTextAnchor = 'end';
  }

  const {counts, pct} = labeler(totalShots)(datum);
  const pctText = `${pct}%`;
  const countText = `~ ${counts.num} / ${counts.denom}`;
  const distanceText = `@ ${hover.distance} ft`;

  return (
    hover.toggle && (
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
    )
  );
};

Cursor.propTypes = {
  datum: PropTypes.shape({
    total: PropTypes.number.isRequired,
  }),
  labeler: PropTypes.func.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
  totalShots: PropTypes.number.isRequired,
};

export default Cursor;
