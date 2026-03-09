// 传感器数据采集器

export interface SensorData {
  timestamp: number
  latitude: number
  longitude: number
  altitude: number | null
  speed: number | null
  heading: number | null
  accuracy: number | null
  accelX: number
  accelY: number
  accelZ: number
  longitudinalAccel: number
  lateralAccel: number
  inertialBallX: number
  inertialBallY: number
}

export interface BadEvent {
  type: 'harsh_deceleration' | 'harsh_acceleration' | 'sharp_turn' | 'jerk'
  timestamp: number
  latitude: number
  longitude: number
  intensity: number
  longitudinalAccel: number
  lateralAccel: number
  speed: number
}

type SensorCallback = (data: SensorData) => void
type EventCallback = (event: BadEvent) => void

export class SensorCollector {
  private gpsWatchId: number | null = null
  private lastAccelData: { x: number; y: number; z: number; timestamp: number } | null = null
  private callbacks: SensorCallback[] = []
  private eventCallbacks: EventCallback[] = []
  private lastPosition: { latitude: number; longitude: number; speed: number } | null = null
  
  // 不良事件阈值
  private readonly thresholds = {
    harsh_deceleration: -3.0,  // m/s²
    harsh_acceleration: 3.0,    // m/s²
    sharp_turn: 3.0,            // m/s²
    jerk: 4.0                   // m/s³
  }
  
  // 事件冷却时间（防止重复检测）
  private lastEventTime: Record<string, number> = {}
  private readonly eventCooldown = 2000 // 2秒
  
  start() {
    // 启动GPS
    if (navigator.geolocation) {
      this.gpsWatchId = navigator.geolocation.watchPosition(
        (position) => {
          this.lastPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speed: position.coords.speed || 0
          }
        },
        (error) => console.error('GPS error:', error),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      )
    }
    
    // 启动加速度计
    window.addEventListener('devicemotion', this.handleDeviceMotion)
  }
  
  stop() {
    if (this.gpsWatchId !== null) {
      navigator.geolocation.clearWatch(this.gpsWatchId)
      this.gpsWatchId = null
    }
    
    window.removeEventListener('devicemotion', this.handleDeviceMotion)
  }
  
  onData(callback: SensorCallback) {
    this.callbacks.push(callback)
  }
  
  onEvent(callback: EventCallback) {
    this.eventCallbacks.push(callback)
  }
  
  private handleDeviceMotion = (event: DeviceMotionEvent) => {
    const accel = event.accelerationIncludingGravity
    if (!accel) return
    
    const now = Date.now()
    const x = accel.x || 0
    const y = accel.y || 0
    const z = accel.z || 0
    
    // 计算纵向和横向加速度（假设手机竖放，y轴为前进方向）
    const longitudinalAccel = -y // 前进方向
    const lateralAccel = x       // 左右方向
    
    // 计算惯性球位置（归一化到-1到1）
    const maxAccel = 5.0 // 最大加速度参考值
    const inertialBallX = Math.max(-1, Math.min(1, lateralAccel / maxAccel))
    const inertialBallY = Math.max(-1, Math.min(1, longitudinalAccel / maxAccel))
    
    const sensorData: SensorData = {
      timestamp: now,
      latitude: this.lastPosition?.latitude || 0,
      longitude: this.lastPosition?.longitude || 0,
      altitude: null,
      speed: this.lastPosition?.speed || null,
      heading: null,
      accuracy: null,
      accelX: x,
      accelY: y,
      accelZ: z,
      longitudinalAccel,
      lateralAccel,
      inertialBallX,
      inertialBallY
    }
    
    // 检测不良事件
    this.detectBadEvents(sensorData, now)
    
    // 触发回调
    this.callbacks.forEach(cb => cb(sensorData))
    
    // 保存上一次数据
    this.lastAccelData = { x, y, z, timestamp: now }
  }
  
  private detectBadEvents(data: SensorData, now: number) {
    // 急减速
    if (data.longitudinalAccel < this.thresholds.harsh_deceleration) {
      this.emitEvent('harsh_deceleration', data, Math.abs(data.longitudinalAccel), now)
    }
    
    // 急加速
    if (data.longitudinalAccel > this.thresholds.harsh_acceleration) {
      this.emitEvent('harsh_acceleration', data, data.longitudinalAccel, now)
    }
    
    // 急转向
    if (Math.abs(data.lateralAccel) > this.thresholds.sharp_turn) {
      this.emitEvent('sharp_turn', data, Math.abs(data.lateralAccel), now)
    }
    
    // 顿挫（加速度变化率）
    if (this.lastAccelData) {
      const dt = (now - this.lastAccelData.timestamp) / 1000
      if (dt > 0 && dt < 1) {
        const jerk = Math.abs(data.longitudinalAccel - (-this.lastAccelData.y)) / dt
        if (jerk > this.thresholds.jerk) {
          this.emitEvent('jerk', data, jerk, now)
        }
      }
    }
  }
  
  private emitEvent(
    type: BadEvent['type'],
    data: SensorData,
    intensity: number,
    now: number
  ) {
    // 检查冷却时间
    const lastTime = this.lastEventTime[type] || 0
    if (now - lastTime < this.eventCooldown) return
    
    this.lastEventTime[type] = now
    
    const event: BadEvent = {
      type,
      timestamp: now,
      latitude: data.latitude,
      longitude: data.longitude,
      intensity,
      longitudinalAccel: data.longitudinalAccel,
      lateralAccel: data.lateralAccel,
      speed: data.speed || 0
    }
    
    this.eventCallbacks.forEach(cb => cb(event))
  }
}
