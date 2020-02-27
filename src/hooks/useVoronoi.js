import {useEffect, useState} from 'react';

import Voronoi from '../lib/voronoi';

/**
 * Create a Voronoi object to handle chart interaction events
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
function useVoronoi(
  data,
  scale,
  onActivated,
  onDeactivated,
  accessor,
  options
) {
  const [voronoi, setVoronoi] = useState(undefined);

  useEffect(() => {
    if (scale) {
      setVoronoi(
        new Voronoi(data, scale, onActivated, onDeactivated, accessor, options)
      );
    }
  }, [accessor, data, onActivated, onDeactivated, options, scale]);

  return voronoi;
}

export default useVoronoi;
