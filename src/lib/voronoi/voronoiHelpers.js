import {distance as getEuclidianDistance} from '..';
import {formatData} from '../chart-util/data';
import {getPoint} from '../chart-util/helpers';

/**
 * Transform the data using the accessor functions, scales, and voronoiDimension.
 * @param {Object[]} data the array of points used to make the voronoi diagram.
 * @param {Number} data[].x a point's x value.
 * @param {Number} data[].y a point's y value.
 * @param {Object} scale the scale object for the associated graph.
 * @param {Function} scale.x the x scale.
 * @param {Function} scale.y the y scale.
 * @param {Object} accessor the accessor object for data.
 * @param {Function} accessor.x the x accessor function.
 * @param {Function} accessor.y the y accessor function.
 * @param {Object} options
 * @param {("x" | "y")} options.voronoiDimension the direction of the voronoi
 * regions. The value of the other dimension will be ignored.
 * @returns {Object[]}
 */
const getDatasets = (data, scale, accessor, options) => {
  const {voronoiDimension} = options;

  // eslint-disable-next-line no-shadow
  const addVoronoiData = data =>
    data.map(d => {
      const {x, y, y0, x0} = getPoint(d);
      const voronoiX = (+x + +x0) / 2;
      const voronoiY = (+y + +y0) / 2;
      return {
        voronoiX: voronoiDimension === 'y' ? 0 : voronoiX,
        voronoiY: voronoiDimension === 'x' ? 0 : voronoiY,
        ...d,
      };
    });

  // eslint-disable-next-line no-shadow
  const getFormattedData = (data, props) => {
    const formattedData = formatData(data, props);
    return Array.isArray(formattedData) && formattedData.length > 0
      ? formattedData
      : undefined;
  };

  const formattedData = getFormattedData(data, {scale, ...accessor});
  return addVoronoiData(formattedData);
};

/**
 * Determine whether the point is within the voronoi diagram.
 * @param {Object} point
 * @param {Number} point.x the point's x value.
 * @param {Number} point.y the point's y value.
 * @param {Object} props
 * @param {Number} props.height
 * @param {Number} props.voronoiPadding
 * @param {Number} props.width
 */
const withinBounds = (point, props) => {
  const {height, voronoiPadding: padding = 0, width} = props;
  const {x, y} = point;
  return (
    x >= padding &&
    x <= width - padding &&
    y >= padding &&
    y <= height - padding
  );
};

/**
 * Determine whether the `mousePosition` is within `radius` distance of `point`.
 * @param {Object} point
 * @param {Number} point.x the point's x value.
 * @param {Number} point.y the point's y value.
 * @param {Object} mousePosition
 * @param {Number} mousePosition.x
 * @param {Number} mousePosition.y
 * @param {Number} radius the radius around each point that is included in the voronoi diagram.
 */
const withinRadius = (point, mousePosition, radius) => {
  if (!radius) {
    return true;
  }
  const distance = getEuclidianDistance(mousePosition, {
    x: point[0],
    y: point[1],
  });
  return distance < radius;
};

export {getDatasets, withinBounds, withinRadius};
