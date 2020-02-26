import {useEffect, useState} from 'react';
import {scaleLinear} from 'd3-scale';

/**
 * Create a scale object for the given chart parameters.
 * @param {Object} data
 * @param {Object} scale the scale object for the associated graph.
 * @param {Function} scale.x the x scale.
 * @param {Function} scale.y the y scale.
 * @param {[Number, Number]} domain
 * @param {Number} maxDistance
 * @param {Object} margin
 * @param {Object} svgDimensions
 */
function useScale(data, domain, maxDistance, margin, svgDimensions) {
  const {height, width} = svgDimensions;

  const [scale, setScale] = useState(undefined);

  useEffect(() => {
    const xDomain = domain(data);
    const xScale = scaleLinear()
      .domain(xDomain)
      .range([margin.left, width - margin.right]);
    const yScale = scaleLinear()
      .domain([0, maxDistance])
      .range([height - margin.bottom, margin.top]);
    setScale({
      x: xScale,
      y: yScale,
    });
  }, [data, domain, margin, maxDistance, height, width]);

  return scale;
}

export default useScale;
