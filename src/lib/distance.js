import square from './square';

const distance = (p1, p2 = {x: 0, y: 0}) =>
  Math.sqrt(square(p1.x - p2.x) + square(p1.y - p2.y));

export default distance;
