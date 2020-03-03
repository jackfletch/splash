import {useEffect, useState} from 'react';
import {scaleLinear} from 'd3-scale';

/**
 * Create a scale object for the given chart parameters.
 * @param {Object} data
 * @param {Object} domain the domain object for the associated graph.
 * @param {Function} domain.x the x domain accessor.
 * @param {Function} domain.y the y domain accessor.
 * @param {Number} maxDistance
 * @param {Object} margin
 * @param {Object} svgDimensions
 */
function useScale(data, domain, maxDistance, margin, svgDimensions) {
  const {height, width} = svgDimensions;

  const [scale, setScale] = useState(undefined);

  useEffect(() => {
    const xDomain = domain.x(data);
    const yDomain = domain.y(data);
    const xScale = scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain(yDomain)
      .range([height - margin.bottom, margin.top]);
    setScale({
      x: xScale,
      y: yScale,
    });
  }, [data, domain, margin, maxDistance, height, width]);

  return scale;
}

export default useScale;
