import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase配置缺失，部分功能可能不可用')
}

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

// 司机相关
export const driverApi = {
  async login(phone: string, password: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (error) throw error
    return data
  },

  async getProfile(driverId: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', driverId)
      .single()
    
    if (error) throw error
    return data
  },

  async updatePoints(driverId: string, points: number, reason: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    // 获取当前积分
    const { data: driver } = await supabase
      .from('drivers')
      .select('total_points')
      .eq('id', driverId)
      .single()
    
    const newBalance = (driver?.total_points || 0) + points
    
    // 更新积分
    await supabase
      .from('drivers')
      .update({ total_points: newBalance })
      .eq('id', driverId)
    
    // 记录历史
    await supabase
      .from('points_history')
      .insert({
        driver_id: driverId,
        points,
        reason,
        balance_after: newBalance
      })
  }
}

// 任务相关
export const taskApi = {
  async getAvailableTasks(driverId: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .or(`assigned_driver_id.is.null,assigned_driver_id.eq.${driverId}`)
      .in('status', ['pending', 'assigned'])
      .order('priority', { ascending: false })
    
    if (error) throw error
    return data
  },

  async acceptTask(taskId: string, driverId: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('tasks')
      .update({
        assigned_driver_id: driverId,
        status: 'assigned',
        assigned_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// 行程相关
export const tripApi = {
  async startTrip(taskId: string, driverId: string, vehicleId: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('trips')
      .insert({
        task_id: taskId,
        driver_id: driverId,
        vehicle_id: vehicleId,
        start_time: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async addSensorData(tripId: string, data: any) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { error } = await supabase
      .from('sensor_data')
      .insert({
        trip_id: tripId,
        timestamp: data.timestamp,
        location: `POINT(${data.longitude} ${data.latitude})`,
        speed: data.speed,
        accel_x: data.accel_x,
        accel_y: data.accel_y,
        accel_z: data.accel_z,
        longitudinal_accel: data.longitudinal_accel,
        lateral_accel: data.lateral_accel,
        inertial_ball_x: data.inertial_ball_x,
        inertial_ball_y: data.inertial_ball_y
      })
    
    if (error) throw error
  },

  async endTrip(tripId: string, vehicleNumber: string, driverName: string) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('trips')
      .update({
        end_time: new Date().toISOString(),
        vehicle_number: vehicleNumber,
        driver_name: driverName,
        status: 'completed'
      })
      .eq('id', tripId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 实时订阅行程数据
  subscribeToTrip(tripId: string, callback: (payload: any) => void) {
    if (!supabase) return () => {}
    
    const channel = supabase
      .channel(`trip:${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `id=eq.${tripId}`
        },
        callback
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }
}

// 排行榜
export const leaderboardApi = {
  async getWeeklyTop(limit: number = 10) {
    if (!supabase) throw new Error('Supabase未配置')
    
    const { data, error } = await supabase
      .from('drivers')
      .select('id, name, average_score, total_trips, total_points')
      .order('average_score', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}
