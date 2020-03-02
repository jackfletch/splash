import React from 'react';
import styled from 'styled-components';

export const Svg = styled.svg`
  display: block;
  margin: 0 auto;
  height: auto;
  width: 100%;
  pointer-events: all;
`;

export const Rect = styled.rect`
  fill: rgba(43, 49, 55, 0.5);
`;

const NoninteractiveDiv = styled.div`
  user-select: none;
  pointer-events: none;
  touch-action: none;
`;

export const StaticSvg = React.forwardRef((props, ref) => (
  <NoninteractiveDiv>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Svg {...props} ref={ref}></Svg>
  </NoninteractiveDiv>
));
