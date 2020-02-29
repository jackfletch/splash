/**
 * Create a data accessor function given a property key, array index, or null
 * for identity.
 * @param {(Function | Number | string)} key the accessor as a function,
 * property key, array index,or null for identity.
 * @returns {Function} the data accessor function.
 */
function createAccessor(key) {
  if (typeof key === 'function') {
    return key;
  }
  if (key === null || key === undefined) {
    return x => x;
  }
  return x => x[key];
}

function getPoint(datum) {
  const {_x, _x1, _x0, voronoiX, _y, _y1, _y0, voronoiY} = datum;
  const defaultX = _x1 ?? _x;
  const defaultY = _y1 ?? _y;
  const point = {
    x: voronoiX ?? defaultX,
    x0: _x0 ?? _x,
    y: voronoiY ?? defaultY,
    y0: _y0 ?? _y,
  };
  return {...datum, ...point};
}

/**
 * Scale the given datum using the scales.
 * @param {Object} scale the scale object.
 * @param {Function} scale.x the x scale.
 * @param {Function} scale.y the y scale.
 * @param {Object} datum the datum to scale.
 */
function scalePoint(scale, datum) {
  const d = getPoint(datum);

  const x = scale.x(d.x);
  const x0 = scale.x(d.x0);
  const y = scale.y(d.y);
  const y0 = scale.y(d.y0);
  return {x, x0, y, y0};
}

export {createAccessor, getPoint, scalePoint};
