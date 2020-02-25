import {Delaunay} from 'd3-delaunay';

import {scalePoint} from '../chart-util/helpers';
import {getSVGEventCoordinates} from '../chart-util/selection';
import {getDatasets, withinBounds, withinRadius} from './voronoiHelpers';

/** Class of a 1-dimensional voronoi diagram that responds to mouse events in an SVG */
class Voronoi {
  /**
   * Create a 1-dimensional voronoi diagram.
   * @param {Object[]} data the array of points used to make the voronoi diagram.
   * @param {Number} data[].x a point's x value.
   * @param {Number} data[].y a point's y value.
   * @param {Object} scale the scale object for the associated graph.
   * @param {Function} scale.x the x scale.
   * @param {Function} scale.y the y scale.
   * @param {Function} onActivated the function run on activating a point.
   * @param {Function} onDeactivated the function run on deactivating a point.
   * @param {Object} accessor the accessor object for data.
   * @param {Function} accessor.x the x accessor function.
   * @param {Function} accessor.y the y accessor function.
   * @param {Object} options
   * @param {("x" | "y")} options.voronoiDimension the direction of the voronoi
   * regions. The value of the other dimension will be ignored.
   * @param {Number} [options.radius] the radius around each point within which
   * to trigger a voronoi region.
   */
  constructor(data, scale, onActivated, onDeactivated, accessor, options = {}) {
    this.data = data;
    this.scale = scale;
    this.onActivated = onActivated;
    this.onDeactivated = onDeactivated;
    this.accessor = accessor;
    this.radius = options?.radius;
    this.voronoiDimension = options.voronoiDimension;

    this.datasets = getDatasets(data, scale, accessor, {
      voronoiDimension: options.voronoiDimension,
    });
    this.scaledData = this.datasets.map(d => {
      const {x, y} = scalePoint(scale, d);
      return [x, y];
    });
    this.delaunay = Delaunay.from(this.scaledData);
  }

  /**
   * Get the index and the associated datum of the voronoi region at the given
   * mouse position.
   * @param {Object} mousePosition the mouse position.
   * @param {Number} mousePosition.x
   * @param {Number} mousePosition.y
   * @returns {Object} the index of the voronoi region and the associated datum.
   */
  getVoronoiPoint(mousePosition) {
    // TODO: benchmark possible performance gain of starting delaunay.find from
    // last active point
    const index = this.delaunay.find(mousePosition.x, mousePosition.y);
    const isWithinRadius = withinRadius(
      this.scaledData[index],
      mousePosition,
      this.radius
    );
    const datum = isWithinRadius ? this.datasets[index] : {};

    return {datum, index};
  }

  onMouseLeave(evt, targetProps) {
    const {activeIndex, activePoint} = targetProps;
    if (this.onDeactivated)
      this.onDeactivated(activePoint, activeIndex, targetProps);
  }

  onMouseMove(evt, targetProps) {
    const {activeIndex, activePoint, parentSVG} = targetProps;
    const mousePosition = getSVGEventCoordinates(evt, parentSVG.current);
    // if the new point is out of bounds, deactivate the active point
    if (!withinBounds(mousePosition, targetProps)) {
      if (this.onDeactivated)
        this.onDeactivated(activePoint, activeIndex, targetProps);
      return;
    }
    const {datum, index} = this.getVoronoiPoint(mousePosition);
    // if the new point is not the old/active point, activate the new one and
    // deactivate the old one
    if (!activePoint || activeIndex !== index) {
      if (this.onActivated) this.onActivated(datum, index, targetProps);
      if (this.onDeactivated)
        this.onDeactivated(activePoint, activeIndex, targetProps);
    }
  }
}

export default Voronoi;
