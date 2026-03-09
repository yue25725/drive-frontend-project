// 设备检测工具

export interface DeviceInfo {
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
  hasGyroscope: boolean
  hasAccelerometer: boolean
  hasGPS: boolean
  isPWA: boolean
  screenWidth: number
  screenHeight: number
}

export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isAndroid = /Android/i.test(ua)
  
  // 检测传感器
  const hasGyroscope = 'DeviceOrientationEvent' in window
  const hasAccelerometer = 'DeviceMotionEvent' in window
  const hasGPS = 'geolocation' in navigator
  
  // 检测PWA模式
  const isPWA = window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    hasGyroscope,
    hasAccelerometer,
    hasGPS,
    isPWA,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
  }
}

// 请求传感器权限（iOS 13+需要）
export async function requestSensorPermissions(): Promise<boolean> {
  try {
    // iOS 13+ DeviceMotion权限
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const motionPermission = await (DeviceMotionEvent as any).requestPermission()
      if (motionPermission !== 'granted') {
        console.warn('Device motion permission denied')
        return false
      }
    }
    
    // iOS 13+ DeviceOrientation权限
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const orientationPermission = await (DeviceOrientationEvent as any).requestPermission()
      if (orientationPermission !== 'granted') {
        console.warn('Device orientation permission denied')
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Error requesting sensor permissions:', error)
    return false
  }
}

// 请求GPS权限
export async function requestGPSPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => {
        console.warn('GPS permission denied:', error)
        resolve(false)
      },
      { timeout: 5000 }
    )
  })
}
