/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import theme from '../../theme';

const TSpan = styled.tspan`
  font-size: 14px;
  fill: rgb(43, 49, 55);
`;

const defaultAxisProps = {
  role: 'presentation',
  shapeRendering: 'auto',
  strokeWidth: theme.axis.style.strokeWidth,
  stroke: theme.axis.style.axis.stroke,
  vectorEffect: 'non-scaling-stroke',
};

export const XAxis = props => {
  const {scale} = props;
  const ticks = scale.x.ticks();
  const tickLength = 5;
  return (
    <g role="presentation">
      <line
        {...defaultAxisProps}
        x1={scale.x.range()[0]}
        x2={scale.x.range()[1]}
        y1={scale.y.range()[0]}
        y2={scale.y.range()[0]}
      />
      {ticks.map(t => (
        <g role="presentation" key={t}>
          <line
            {...defaultAxisProps}
            x1={scale.x(t)}
            x2={scale.x(t)}
            y1={scale.y(0)}
            y2={scale.y(0) + tickLength}
          />
          {t % 100 === 0 && (
            <text
              x={scale.x(t)}
              y={scale.y.range()[0] + tickLength + 10}
              dy={12}
            >
              <TSpan textAnchor="middle">{Math.abs(t)}</TSpan>
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

XAxis.propTypes = {
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,
};

export const YAxis = props => {
  const {scale} = props;
  const ticks = scale.y.ticks();
  const tickLength = 5;
  return (
    <g role="presentation">
      <line
        {...defaultAxisProps}
        x1={scale.x.range()[0]}
        x2={scale.x.range()[0]}
        y1={scale.y.range()[0]}
        y2={scale.y.range()[1]}
      />
      {ticks.map(
        t =>
          t !== 0 && (
            <g role="presentation" key={t}>
              <line
                {...defaultAxisProps}
                x1={scale.x.range()[0]}
                x2={scale.x.range()[0] - tickLength}
                y1={scale.y(t)}
                y2={scale.y(t)}
              />
              <text
                x={scale.x.range()[0] - tickLength - 10}
                y={scale.y(t)}
                dx={5}
                dy={5}
              >
                <TSpan textAnchor="end">{t}</TSpan>
              </text>
            </g>
          )
      )}
    </g>
  );
};

YAxis.propTypes = {
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  scale: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }).isRequired,
};
