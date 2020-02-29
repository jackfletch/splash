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

const withoutInteraction = component => (
  <NoninteractiveDiv>{component}</NoninteractiveDiv>
);

export const StaticSvg = withoutInteraction(Svg);
