// 五星评分计算器

export interface TripStats {
  // 时间
  estimatedTime: number  // 秒
  actualTime: number     // 秒
  
  // 距离
  estimatedDistance: number  // 米
  actualDistance: number     // 米
  
  // 不良事件
  harshDecelerationCount: number
  harshAccelerationCount: number
  sharpTurnCount: number
  jerkCount: number
  
  // 数据质量
  gpsAccuracyAvg: number      // 米
  sensorCompleteness: number  // 百分比 0-100
}

export interface ScoreResult {
  totalScore: number
  stars: number
  breakdown: {
    smoothness: number  // 平顺性得分 (40分)
    time: number        // 时间效率得分 (20分)
    quality: number     // 数据质量得分 (20分)
    route: number       // 路线完成度得分 (20分)
  }
}

export function calculateScore(stats: TripStats): ScoreResult {
  // 1. 平顺性得分 (40分)
  let smoothnessScore = 40
  const eventPenalty = {
    harsh_deceleration: 3,
    harsh_acceleration: 3,
    sharp_turn: 2,
    jerk: 1
  }
  
  const totalPenalty = 
    stats.harshDecelerationCount * eventPenalty.harsh_deceleration +
    stats.harshAccelerationCount * eventPenalty.harsh_acceleration +
    stats.sharpTurnCount * eventPenalty.sharp_turn +
    stats.jerkCount * eventPenalty.jerk
  
  smoothnessScore = Math.max(0, smoothnessScore - totalPenalty)
  
  // 2. 时间效率得分 (20分)
  let timeScore = 20
  const timeDeviation = stats.estimatedTime > 0 
    ? (stats.actualTime - stats.estimatedTime) / stats.estimatedTime 
    : 0
  
  if (timeDeviation <= 0) {
    timeScore = 20  // 准时或提前
  } else if (timeDeviation <= 0.05) {
    timeScore = 15  // 延迟5%内
  } else if (timeDeviation <= 0.10) {
    timeScore = 10  // 延迟10%内
  } else {
    timeScore = 5   // 延迟超过10%
  }
  
  // 3. 数据质量得分 (20分)
  let qualityScore = 0
  
  // GPS精度评分 (10分)
  if (stats.gpsAccuracyAvg < 5) {
    qualityScore += 10
  } else if (stats.gpsAccuracyAvg < 10) {
    qualityScore += 7
  } else {
    qualityScore += 4
  }
  
  // 传感器完整性评分 (10分)
  if (stats.sensorCompleteness >= 98) {
    qualityScore += 10
  } else if (stats.sensorCompleteness >= 95) {
    qualityScore += 7
  } else {
    qualityScore += 4
  }
  
  // 4. 路线完成度得分 (20分)
  let routeScore = 0
  const distanceCoverage = stats.estimatedDistance > 0
    ? stats.actualDistance / stats.estimatedDistance
    : 0
  
  if (distanceCoverage >= 1.0) {
    routeScore = 20  // 完成或超出
  } else if (distanceCoverage >= 0.95) {
    routeScore = 15  // 95%以上
  } else if (distanceCoverage >= 0.90) {
    routeScore = 10  // 90%以上
  } else {
    routeScore = 5   // 低于90%
  }
  
  // 总分
  const totalScore = smoothnessScore + timeScore + qualityScore + routeScore
  
  // 星级
  let stars = 1
  if (totalScore >= 90) stars = 5
  else if (totalScore >= 80) stars = 4
  else if (totalScore >= 70) stars = 3
  else if (totalScore >= 60) stars = 2
  
  return {
    totalScore,
    stars,
    breakdown: {
      smoothness: smoothnessScore,
      time: timeScore,
      quality: qualityScore,
      route: routeScore
    }
  }
}

// 积分奖励计算
export function calculatePointsReward(stars: number): number {
  const rewards: Record<number, number> = {
    5: 50,
    4: 40,
    3: 30,
    2: 20,
    1: 10
  }
  return rewards[stars] || 10
}
