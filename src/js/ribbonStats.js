import { sum } from 'd3-array'

export function calcRibbonStats(data, maxDistance) {
  const binnedShots = {}
  let totalMakes = 0
  let totalShots = data.length

  data.forEach((shot) => {
    if (shot.distance <= maxDistance) {
      if (shot.distance in binnedShots) {
        binnedShots[shot.distance].push(shot)
      } else {
        binnedShots[shot.distance] = [shot]
      }
      totalMakes += shot.made_flag
    } else {
      totalShots -= 1
    }
  })
  const avgShootingPct = {
    0: 76.90,
    1: 58.10,
    2: 50.72,
    3: 42.07,
    4: 41.60,
    5: 40.86,
    6: 41.40,
    7: 41.85,
    8: 40.88,
    9: 40.56,
    10: 40.71,
    11: 40.35,
    12: 41.61,
    13: 40.37,
    14: 41.13,
    15: 42.25,
    16: 41.10,
    17: 41.24,
    18: 40.91,
    19: 39.80,
    20: 40.18,
    21: 37.12,
    22: 38.50,
    23: 38.52,
    24: 37.07,
    25: 35.42,
    26: 34.63,
    27: 32.67,
    28: 31.17,
    29: 28.32,
    30: 28.07,
    31: 20.83,
    32: 26.76,
    33: 17.54,
    34: 18.18,
    35: 12.00,
    totalMakes
  }

  const binData = []
  const shootingPctArray = []
  Object.keys(binnedShots).forEach((bin) => {
    const shots = binnedShots[bin]
    const shootingPct = shots.reduce((a, b) => b.made_flag ? a + 1 : a, 0) / shots.length
    const width = (40 * shots.length) / (totalShots / 30)
    binData.push({ x: parseInt(bin), y: shootingPct, widthValue: width, colorValue: shootingPct - (avgShootingPct[parseInt(bin)] / 100) })
    shootingPctArray.push(shootingPct)
  })

  for (let i = 0; i < binData.length; i++) {
    const tempArray = [
      shootingPctArray[i - 4],
      shootingPctArray[i - 3] * 8,
      shootingPctArray[i - 2] * 28,
      shootingPctArray[i - 1] * 56,
      shootingPctArray[i] * 70,
      shootingPctArray[i + 1] * 56,
      shootingPctArray[i + 2] * 28,
      shootingPctArray[i + 3] * 8,
      shootingPctArray[i + 4]
    ]
    if (i === 0) {
      binData[i].y = binData[i].y
    } else if (i === 1) {
      binData[i].y = binData[i].y
    } else if (i === 2) {
      binData[i].y = binData[i].y
    } else if (i === 3) {
      binData[i].y = binData[i].y
    } else if (i === binData.length - 4) {
      binData[i].y = sum(tempArray.slice(0, -1)) / 255
    } else if (i === binData.length - 3) {
      binData[i].y = sum(tempArray.slice(0, -1)) / 247
    } else if (i === binData.length - 2) {
      binData[i].y = sum(tempArray.slice(0, -2)) / 219
    } else if (i === binData.length - 1) {
      binData[i].y = sum(tempArray.slice(0, -3)) / 163
    } else {
      binData[i].y = sum(tempArray) / 256
    }
    binData[i].colorValue = binData[i].y - (avgShootingPct[i] / 100)
  }

  return binData
}
