const accessor = {
  shotProportion: totalShots => d => (100 * d.total) / totalShots,
  fieldGoalPercentage: totalShots => d => (100 * d.made) / d.total || 0,
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

export default {
  shotProportion: {
    accessor: accessor.shotProportion,
    labeler: labeler.shotProportion,
  },
  fieldGoalPercentage: {
    accessor: accessor.fieldGoalPercentage,
    labeler: labeler.fieldGoalPercentage,
  },
};
