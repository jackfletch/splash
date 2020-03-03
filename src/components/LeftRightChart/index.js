import React, {createRef, useCallback, useMemo} from 'react';
import PropTypes from 'prop-types';

import {
  useActivatorEvents,
  useChartScale,
  useHover,
  useVoronoi,
} from '../../hooks';
import ChartDiv from '../ChartDiv';
import ChartTitle from '../ChartTitle';
import {XAxis, YAxis} from './Axis';
import Cursor from './Cursor';
import {voronoiActivatorEvents} from './functions';
import {Rect, StaticSvg as Svg} from './style';

const margin = {top: 20, right: 50, bottom: 50, left: 50};
const svgWidth = 450;
const svgHeight = 300;

const barWidth = 0.8;
const barPadding = 1 - barWidth;
const barRectOffset = 1 - barPadding / 2;

const voronoiDimension = 'y';
const voronoiOptions = {voronoiDimension};

const LeftRightChart = props => {
  const {accessor, data, domain: xDomain, maxDistance, title} = props;
  const [hover, dispatchHover] = useHover();
  const svgRef = createRef();

  const domain = useMemo(() => ({x: xDomain, y: d => [0, maxDistance]}), [
    xDomain,
    maxDistance,
  ]);

  const scale = useChartScale(data, domain, maxDistance, margin, {
    height: svgHeight,
    width: svgWidth,
  });

  const voronoiAccessor = useMemo(
    () => ({
      x: accessor,
      y: (d, i) => i + 0.5,
    }),
    [accessor]
  );

  const {onActivated, onDeactivated} = useActivatorEvents(
    dispatchHover,
    voronoiActivatorEvents
  );
  const onReset = useCallback(() => {
    if (!hover.toggle) {
      dispatchHover({type: 'reset'});
    }
  }, [dispatchHover, hover.toggle]);

  const voronoi = useVoronoi(
    data.left,
    scale,
    onActivated,
    onDeactivated,
    voronoiAccessor,
    voronoiOptions
  );

  const activeIndex = hover.toggle && hover.distance;
  const activePoint = hover.toggle && data.left?.[hover.distance];
  const targetProps = {
    activeIndex,
    activePoint,
    parentSVG: svgRef,
    height: svgHeight,
    width: svgWidth,
    voronoiPadding: 5,
  };
  if (!scale || !voronoi) return null;
  return (
    <ChartDiv>
      <ChartTitle>{title}</ChartTitle>
      <Svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        ref={svgRef}
        onMouseLeave={e => voronoi.onMouseLeave(e, targetProps)}
        onTouchCancel={e => voronoi.onMouseLeave(e, targetProps)}
        onMouseMove={e => voronoi.onMouseMove(e, targetProps)}
        onTouchMove={e => voronoi.onMouseMove(e, targetProps)}
        onMouseOut={onReset}
        onBlur={onReset}
      >
        <XAxis scale={scale} />
        <YAxis scale={scale} />
        {data.left?.map(
          (d, i) =>
            d.total !== 0 && (
              <Rect
                x={scale.x(-accessor(d))}
                y={scale.y(i + barRectOffset)}
                width={scale.x(0) - scale.x(-accessor(d))}
                height={scale.y(0) - scale.y(1 - barPadding)}
                key={`left-${i}-${d.total}`}
              />
            )
        )}
        {data.right?.map(
          (d, i) =>
            d.total !== 0 && (
              <Rect
                x={scale.x(0)}
                y={scale.y(i + barRectOffset)}
                width={scale.x(accessor(d)) - scale.x(0)}
                height={scale.y(0) - scale.y(1 - barPadding)}
                key={`right-${i}-${d.total}`}
              />
            )
        )}
        <Cursor scale={scale} />
      </Svg>
    </ChartDiv>
  );
};

LeftRightChart.propTypes = {
  accessor: PropTypes.func.isRequired,
  data: PropTypes.exact({
    left: PropTypes.arrayOf(
      PropTypes.exact({
        made: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ),
    right: PropTypes.arrayOf(
      PropTypes.exact({
        made: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  domain: PropTypes.func.isRequired,
  maxDistance: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default LeftRightChart;
export {default as functions} from './functions';
