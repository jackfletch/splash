import { sum } from 'd3'

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
  const avgShootingPct = totalMakes / totalShots

  const binData = []
  const shootingPctArray = []
  Object.keys(binnedShots).forEach((bin) => {
    const shots = binnedShots[bin]
    const shootingPct = shots.reduce((a, b) => a + b.made_flag, 0) / shots.length
    const width = (40 * shots.length) / (totalShots / 30)
    binData.push({ x: parseInt(bin), y: shootingPct, widthValue: width, colorValue: shootingPct - avgShootingPct })
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
      binData[i].y = sum(tempArray.slice(3)) / 163
    } else if (i === 1) {
      binData[i].y = sum(tempArray.slice(2)) / 219
    } else if (i === 2) {
      binData[i].y = sum(tempArray.slice(2)) / 247
    } else if (i === 3) {
      binData[i].y = sum(tempArray.slice(1)) / 255
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
    binData[i].colorValue = binData[i].y - avgShootingPct
  }

  return binData
}
