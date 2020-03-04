/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';
import styled from 'styled-components';

import theme from '../victorytheme';

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

const tickFormat = d => `${(100 * d).toFixed(0)}`;

const Legend = ({imgHeight, imgWidth, x, y}) => {
  const scale = scaleLinear()
    .domain([-0.25, 0.25])
    .range([0, imgWidth]);
  const ticks = scale.ticks();
  const tickLength = 5;

  return (
    <g role="presentation" transform={`translate(${x}, ${y})`}>
      <image
        xlinkHref="/media/img/plasma.png"
        height={imgHeight}
        width={imgWidth}
        preserveAspectRatio="none"
      />

      <line
        {...defaultAxisProps}
        x1={scale.range()[0]}
        x2={scale.range()[1]}
        y1={imgHeight}
        y2={imgHeight}
      />
      {ticks.map(t => (
        <g role="presentation" key={t}>
          <line
            {...defaultAxisProps}
            x1={scale(t)}
            x2={scale(t)}
            y1={imgHeight}
            y2={imgHeight + tickLength}
          />
          {t % 0.1 === 0 && (
            <text x={scale(t)} y={imgHeight + tickLength + 10} dy={12}>
              <TSpan textAnchor="middle">{tickFormat(t)}</TSpan>
            </text>
          )}
        </g>
      ))}
      <TSpan x={imgWidth / 2} y={imgHeight + 30} textAnchor="middle">
        FG% vs LeagueAvg
      </TSpan>
    </g>
  );
};

Legend.propTypes = {
  imgHeight: PropTypes.number.isRequired,
  imgWidth: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default Legend;
