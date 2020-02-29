function getTransformationMatrix(svg) {
  return svg.getScreenCTM().inverse();
}

function transformTarget(target, matrix, dimension) {
  const {a, d, e, f} = matrix;
  return dimension === 'y' ? d * target + f : a * target + e;
}

function getSVGEventCoordinates(evt, svg) {
  const event = evt.changedTouches?.length ? evt.changedTouches[0] : evt;
  const matrix = getTransformationMatrix(svg);
  return {
    x: transformTarget(event.clientX, matrix, 'x'),
    y: transformTarget(event.clientY, matrix, 'y'),
  };
}

function getDomainCoordinates(props, customDomain) {
  const {horizontal, scale} = props;
  const domain = customDomain || {
    x: scale.x.domain(),
    y: scale.y.domain(),
  };
  return {
    x: horizontal
      ? [scale.y(domain.y[0]), scale.y(domain.y[1])]
      : [scale.x(domain.x[0]), scale.x(domain.x[1])],
    y: horizontal
      ? [scale.x(domain.x[0]), scale.x(domain.x[1])]
      : [scale.y(domain.y[0]), scale.y(domain.y[1])],
  };
}

function getDataCoordinates(props, scale, x, y) {
  const {horizontal} = props;
  return {
    x: horizontal ? scale.x.invert(y) : scale.x.invert(x),
    y: horizontal ? scale.y.invert(x) : scale.y.invert(y),
  };
}

function getBounds(props) {
  const {scale, x1, x2, y1, y2} = props;
  const point1 = getDataCoordinates(props, scale, x1, y1);
  const point2 = getDataCoordinates(props, scale, x2, y2);

  const makeBound = (a, b) => [Math.min(a, b), Math.max(a, b)];

  return {
    x: makeBound(point1.x, point2.x),
    y: makeBound(point1.y, point2.y),
  };
}

export {
  getSVGEventCoordinates,
  getDomainCoordinates,
  getDataCoordinates,
  getBounds,
};
