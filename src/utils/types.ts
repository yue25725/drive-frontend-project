// TypeScript类型定义

export interface Driver {
  id: string
  phone: string
  name: string
  email?: string
  
  // 评分统计
  total_trips: number
  five_star_trips: number
  four_star_trips: number
  three_star_trips: number
  two_star_trips: number
  one_star_trips: number
  average_score: number
  
  // 积分系统
  total_points: number
  current_level: number
  
  // 状态
  status: 'active' | 'suspended' | 'offline'
  current_vehicle_id?: string
  
  created_at: string
  updated_at: string
  last_online_at?: string
}

export interface Vehicle {
  id: string
  number: string
  type?: string
  model?: string
  year?: number
  device_id?: string
  current_driver_id?: string
  status: 'available' | 'in_use' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  type: 'route' | 'cruise' | 'scenario'
  
  // 路线信息
  origin_name?: string
  origin_location?: { lat: number; lng: number }
  destination_name?: string
  destination_location?: { lat: number; lng: number }
  
  // 任务要求
  estimated_duration?: number
  estimated_distance?: number
  min_quality_score?: number
  
  // 派发信息
  assigned_driver_id?: string
  assigned_vehicle_id?: string
  
  // 状态
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  
  created_at: string
  assigned_at?: string
  started_at?: string
  completed_at?: string
  
  priority: number
}

export interface Trip {
  id: string
  task_id?: string
  driver_id: string
  vehicle_id?: string
  
  vehicle_number?: string
  driver_name?: string
  
  start_time: string
  end_time?: string
  duration?: number
  estimated_time?: number
  actual_time?: number
  time_deviation?: number
  
  distance?: number
  estimated_distance?: number
  distance_coverage?: number
  
  // 不良事件统计
  harsh_deceleration_count: number
  harsh_acceleration_count: number
  sharp_turn_count: number
  jerk_count: number
  total_events: number
  
  // 平均数据
  avg_longitudinal_accel?: number
  avg_lateral_accel?: number
  avg_speed?: number
  
  // 评分
  smoothness_score?: number
  time_score?: number
  quality_score?: number
  route_score?: number
  total_score?: number
  stars?: number
  
  status: 'active' | 'completed' | 'cancelled'
  
  data_quality: 'excellent' | 'good' | 'acceptable' | 'poor'
  gps_accuracy_avg?: number
  sensor_completeness?: number
  
  created_at: string
  updated_at: string
}

export interface PointsHistory {
  id: string
  driver_id: string
  trip_id?: string
  points: number
  reason: string
  type: string
  balance_after?: number
  created_at: string
}

export interface LeaderboardEntry {
  driver_id: string
  name: string
  average_score: number
  total_trips: number
  five_star_rate: number
  rank: number
}
