const findMaxY = (data, accessor) => {
  const {bins, totalShots} = data;
  const yValues = bins.map(accessor(totalShots)).filter(y => !Number.isNaN(y));
  const max = Math.max(...yValues);
  return Math.ceil(max / 5) * 5;
};

const accessor = {
  shotProportion: totalShots => d => (100 * d.total) / totalShots,
  fieldGoalPercentage: totalShots => d => (100 * d.made) / d.total || 0,
};

const domain = {
  shotProportion: d => [0, findMaxY(d, accessor.shotProportion)],
  fieldGoalPercentage: d => [0, 100],
};

const labeler = {
  shotProportion: totalShots => d => ({
    counts: {
      num: d.total,
      denom: totalShots,
    },
    pct: ((100 * d.total) / totalShots).toFixed(2),
  }),
  fieldGoalPercentage: totalShots => d => ({
    counts: {
      num: d.made,
      denom: d.total,
    },
    pct: ((100 * d.made) / d.total || 0).toFixed(2),
  }),
};

export const voronoiActivatorEvents = {
  onActivated: dispatch => (point, i) => {
    dispatch({type: 'activate', value: i});
  },
  onDeactivated: dispatch => (point, i) => {
    if (point) {
      dispatch({
        type: 'deactivate',
        value: i,
      });
    }
  },
};

export default {
  shotProportion: {
    accessor: accessor.shotProportion,
    domain: domain.shotProportion,
    labeler: labeler.shotProportion,
  },
  fieldGoalPercentage: {
    accessor: accessor.fieldGoalPercentage,
    domain: domain.fieldGoalPercentage,
    labeler: labeler.fieldGoalPercentage,
  },
};
