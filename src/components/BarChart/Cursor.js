import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {useHoverState} from '../../hooks';

const distanceFlipCursorOrientation = 30;

const Text = styled.text`
  font-size: ${props => (props.main ? 1 : 0.875)}rem;
  text-anchor: ${props => props.textAnchor};
`;

const Cursor = props => {
  const {datum, labeler, scale, totalShots} = props;
  const hover = useHoverState();

  const x = scale.x(hover.distance + 0.5);

  const textAnchor =
    hover.distance < distanceFlipCursorOrientation ? 'start' : 'end';
  const dx = hover.distance < distanceFlipCursorOrientation ? x + 10 : x - 10;

  const {counts, pct} = labeler(totalShots)(datum);
  const pctText = `${pct}%`;
  const countText = `~ ${counts.num} / ${counts.denom}`;
  const distanceText = `@ ${hover.distance} ft`;

  return (
    hover.toggle && (
      <g>
        <Text main x={dx} y={32} textAnchor={textAnchor}>
          {pctText}
        </Text>
        <Text x={dx} y={50} textAnchor={textAnchor}>
          {countText}
        </Text>
        <Text x={dx} y={68} textAnchor={textAnchor}>
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
  datum: PropTypes.oneOfType([
    PropTypes.exact({
      made: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
    }),
    PropTypes.exact({}),
  ]),
  labeler: PropTypes.func.isRequired,
  scale: PropTypes.shape({
    x: PropTypes.func.isRequired,
    y: PropTypes.func.isRequired,
  }),
  totalShots: PropTypes.number.isRequired,
};

export default Cursor;
