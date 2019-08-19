export function binShots(data, maxDistance) {
  const binnedShots = {};
  let totalMakes = 0;
  let totalShots = data.length;

  data.forEach(shot => {
    if (shot.distance <= maxDistance) {
      if (shot.distance in binnedShots) {
        binnedShots[shot.distance].push(shot);
      } else {
        binnedShots[shot.distance] = [shot];
      }
      totalMakes += shot.make;
    } else {
      totalShots -= 1;
    }
  });

  const binData = [];
  let x = 0;

  Object.keys(binnedShots).forEach(bin => {
    while (x !== parseInt(bin)) {
      binData.push({x: parseInt(x), y: 0});
      x += 1;
    }
    const shots = binnedShots[bin];
    binData.push({x: parseInt(bin), y: shots.length});
    x += 1;
  });

  const binnedData = {
    binData,
    totalShots,
    totalMakes,
  };
  return binnedData;
}
