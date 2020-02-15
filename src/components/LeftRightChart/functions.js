const accessor = {
  shotFrequency: d => d.total,
  fieldGoalPercentage: d => (100 * d.made) / d.total || 0,
};

const domain = {
  shotFrequency: d => {
    const minimumDomain = 100;
    const leftMax = Math.max(...(d?.left?.map(accessor.shotFrequency) ?? []));
    const rightMax = Math.max(...(d?.right?.map(accessor.shotFrequency) ?? []));
    const max = Math.max(leftMax, rightMax, minimumDomain);
    return [-max, max];
  },
  fieldGoalPercentage: d => [-100, 100],
};

const labeler = {
  shotFrequency: d => ({
    counts: {
      num: d.total,
    },
  }),
  fieldGoalPercentage: d => ({
    counts: {
      num: d.made,
      denom: d.total,
    },
    pct: ((100 * d.made) / d.total || 0).toFixed(2),
  }),
};

export default {
  shotFrequency: {
    accessor: accessor.shotFrequency,
    domain: domain.shotFrequency,
    labeler: labeler.shotFrequency,
  },
  fieldGoalPercentage: {
    accessor: accessor.fieldGoalPercentage,
    domain: domain.fieldGoalPercentage,
    labeler: labeler.fieldGoalPercentage,
  },
};
