<template>
  <div class="navigation-page">
    <!-- Header -->
    <div class="header">
      <div class="trip-info">
        <span class="label">行程进行中</span>
        <span class="duration">{{ formattedDuration }}</span>
      </div>
      <div class="live-indicator">
        <span class="pulse"></span>
        <span>实时监测</span>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="main-grid">
      <!-- Left: Map + Inertial Ball -->
      <div class="left-column">
        <!-- GPS Map Placeholder -->
        <div class="map-container">
          <canvas ref="mapCanvas" class="map-canvas"></canvas>
          <div class="map-overlay">
            <div class="coordinates">
              <span>📍 {{ currentLat.toFixed(5) }}, {{ currentLng.toFixed(5) }}</span>
            </div>
          </div>
        </div>

        <!-- Inertial Ball -->
        <div class="inertial-container">
          <h4>🎯 惯性监测</h4>
          <div class="inertial-ball-wrapper">
            <canvas ref="ballCanvas" class="ball-canvas"></canvas>
            <div class="crosshair"></div>
            <div class="indicators">
              <span class="up">↑</span>
              <span class="down">↓</span>
              <span class="left">←</span>
              <span class="right">→</span>
            </div>
          </div>
          <div class="accel-values">
            <span>纵向: {{ currentAccel.longitudinal.toFixed(2) }} m/s²</span>
            <span>横向: {{ currentAccel.lateral.toFixed(2) }} m/s²</span>
          </div>
        </div>
      </div>

      <!-- Right: Score + Metrics + Events -->
      <div class="right-column">
        <!-- Real-time Score -->
        <div class="score-card">
          <div class="score-header">
            <span class="icon">📊</span>
            <span>实时评分</span>
          </div>
          <div class="score-display">
            <div class="score-number">{{ liveScore }}</div>
            <div class="score-label">/ 100</div>
          </div>
          <div class="star-rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= stars }">⭐</span>
          </div>
          <div class="smoothness-bar">
            <div class="bar-label">平顺度</div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: smoothnessPercent + '%' }"></div>
            </div>
            <div class="bar-value">{{ smoothnessPercent }}%</div>
          </div>
        </div>

        <!-- Live Metrics -->
        <div class="metrics-card">
          <div class="metric-row">
            <div class="metric">
              <span class="metric-value">{{ currentSpeed.toFixed(1) }}</span>
              <span class="metric-unit">km/h</span>
              <span class="metric-label">当前速度</span>
            </div>
            <div class="metric">
              <span class="metric-value">{{ distanceTraveled.toFixed(2) }}</span>
              <span class="metric-unit">km</span>
              <span class="metric-label">已行驶</span>
            </div>
          </div>
          <div class="metric-row">
            <div class="metric">
              <span class="metric-value">{{ formattedDuration }}</span>
              <span class="metric-unit"></span>
              <span class="metric-label">已用时</span>
            </div>
            <div class="metric">
              <span class="metric-value time-diff" :class="timeDiffClass">
                {{ timeDifference }}
              </span>
              <span class="metric-unit"></span>
              <span class="metric-label">预估 {{ estimatedTime }}分钟</span>
            </div>
          </div>
        </div>

        <!-- Bad Events Counter -->
        <div class="events-card">
          <div class="events-header">
            <span class="icon">⚠️</span>
            <span>不良事件</span>
            <span class="total-badge">{{ totalBadEvents }}</span>
          </div>
          <div class="events-grid">
            <div class="event-item" :class="{ flash: recentEvent === 'harsh_deceleration' }">
              <span class="event-icon">🛑</span>
              <span class="event-name">急减速</span>
              <span class="event-count">{{ badEvents.harsh_deceleration }}</span>
            </div>
            <div class="event-item" :class="{ flash: recentEvent === 'harsh_acceleration' }">
              <span class="event-icon">🚀</span>
              <span class="event-name">急加速</span>
              <span class="event-count">{{ badEvents.harsh_acceleration }}</span>
            </div>
            <div class="event-item" :class="{ flash: recentEvent === 'sharp_turn' }">
              <span class="event-icon">↩️</span>
              <span class="event-name">急转弯</span>
              <span class="event-count">{{ badEvents.sharp_turn }}</span>
            </div>
            <div class="event-item" :class="{ flash: recentEvent === 'jerk' }">
              <span class="event-icon">⚡</span>
              <span class="event-name">顿挫</span>
              <span class="event-count">{{ badEvents.jerk }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="actions-container">
      <button 
        v-if="isPaused" 
        class="action-btn resume" 
        @click="resumeTrip"
      >
        <span class="icon">▶️</span>
        <span>继续行程</span>
      </button>
      <button 
        v-else 
        class="action-btn pause" 
        @click="pauseTrip"
      >
        <span class="icon">⏸️</span>
        <span>暂停</span>
      </button>
      <button class="action-btn end" @click="confirmEndTrip">
        <span class="icon">🏁</span>
        <span>结束行程</span>
      </button>
    </div>

    <!-- End Trip Confirmation Modal -->
    <Teleport to="body">
      <div v-if="showEndModal" class="modal-overlay" @click.self="showEndModal = false">
        <div class="modal-content">
          <h3>确认结束行程？</h3>
          <div class="modal-stats">
            <div class="stat">
              <span class="value">{{ distanceTraveled.toFixed(2) }} km</span>
              <span class="label">行驶距离</span>
            </div>
            <div class="stat">
              <span class="value">{{ formattedDuration }}</span>
              <span class="label">行驶时间</span>
            </div>
            <div class="stat">
              <span class="value">{{ liveScore }}</span>
              <span class="label">预计得分</span>
            </div>
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="showEndModal = false">继续行程</button>
            <button class="confirm-btn" @click="endTrip">确认结束</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Permission Request Modal -->
    <Teleport to="body">
      <div v-if="showPermissionModal" class="modal-overlay">
        <div class="modal-content permission-modal">
          <h3>🔐 需要传感器权限</h3>
          <p>为了准确监测您的驾驶行为，需要访问以下权限：</p>
          <ul class="permission-list">
            <li>📍 GPS定位 - 记录行驶轨迹</li>
            <li>📊 运动传感器 - 检测加减速和转弯</li>
          </ul>
          <button class="confirm-btn" @click="requestPermissions">授予权限</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SensorCollector, type SensorData, type BadEvent } from '@/utils/sensorCollector'
import { calculateScore, type TripStats } from '@/utils/scoreCalculator'

// Router
const router = useRouter()
const route = useRoute()

// Trip ID from route
const tripId = computed(() => route.params.tripId as string)

// Sensor collector instance
let sensorCollector: SensorCollector | null = null

// Canvas refs
const mapCanvas = ref<HTMLCanvasElement | null>(null)
const ballCanvas = ref<HTMLCanvasElement | null>(null)

// Permission state
const showPermissionModal = ref(false)
const hasPermissions = ref(false)

// Trip state
const isPaused = ref(false)
const showEndModal = ref(false)
const tripStartTime = ref(Date.now())
const pausedDuration = ref(0)
const lastPauseTime = ref(0)

// Sensor data
const currentLat = ref(22.5)
const currentLng = ref(114.0)
const currentSpeed = ref(0)
const currentAccel = ref({ longitudinal: 0, lateral: 0 })
const ballPosition = ref({ x: 0, y: 0 })

// Trip metrics
const distanceTraveled = ref(0)
const estimatedTime = ref(45) // minutes - would come from API
const estimatedDistance = ref(32.5) // km - would come from API

// Score data
const liveScore = ref(100)
const stars = ref(5)
const smoothnessPercent = ref(100)

// Bad events
const badEvents = ref({
  harsh_deceleration: 0,
  harsh_acceleration: 0,
  sharp_turn: 0,
  jerk: 0
})
const recentEvent = ref<string | null>(null)
let recentEventTimeout: number | null = null

// History for scoring
const sensorDataHistory: SensorData[] = []
let lastScoreUpdate = 0

// Computed
const totalBadEvents = computed(() => 
  badEvents.value.harsh_deceleration + 
  badEvents.value.harsh_acceleration + 
  badEvents.value.sharp_turn + 
  badEvents.value.jerk
)

const duration = computed(() => {
  const elapsed = Date.now() - tripStartTime.value - pausedDuration.value
  return Math.floor(elapsed / 1000)
})

const formattedDuration = computed(() => {
  const mins = Math.floor(duration.value / 60)
  const secs = duration.value % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

const timeDifference = computed(() => {
  const elapsedMins = duration.value / 60
  const diff = elapsedMins - estimatedTime.value
  if (diff < 0) {
    return `提前 ${Math.abs(Math.floor(diff))} 分钟`
  } else if (diff === 0) {
    return '准时'
  } else {
    return `延迟 ${Math.floor(diff)} 分钟`
  }
})

const timeDiffClass = computed(() => ({
  'ahead': duration.value / 60 < estimatedTime.value,
  'on-time': duration.value / 60 === estimatedTime.value,
  'delayed': duration.value / 60 > estimatedTime.value
}))

// Methods
const requestPermissions = async () => {
  try {
    // Request motion sensor permission (iOS 13+)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      const permission = await (DeviceMotionEvent as any).requestPermission()
      if (permission !== 'granted') {
        alert('需要运动传感器权限才能监测驾驶行为')
        return
      }
    }
    
    // Request GPS permission
    navigator.geolocation.getCurrentPosition(
      () => {
        hasPermissions.value = true
        showPermissionModal.value = false
        startSensors()
      },
      (error) => {
        console.error('GPS permission denied:', error)
        alert('需要GPS权限才能记录行驶轨迹')
      }
    )
  } catch (error) {
    console.error('Permission request failed:', error)
    // Try to start anyway for non-iOS devices
    hasPermissions.value = true
    showPermissionModal.value = false
    startSensors()
  }
}

const startSensors = () => {
  sensorCollector = new SensorCollector()
  
  // Register data callback
  sensorCollector.onData(handleSensorData)
  
  // Register event callback
  sensorCollector.onEvent(handleBadEvent)
  
  // Start collecting
  sensorCollector.start()
  
  // Start update loop
  requestAnimationFrame(updateLoop)
}

const handleSensorData = (data: SensorData) => {
  if (isPaused.value) return
  
  // Update position
  currentLat.value = data.latitude || currentLat.value
  currentLng.value = data.longitude || currentLng.value
  currentSpeed.value = (data.speed || 0) * 3.6 // Convert m/s to km/h
  
  // Update acceleration
  currentAccel.value = {
    longitudinal: data.longitudinalAccel,
    lateral: data.lateralAccel
  }
  
  // Update ball position
  ballPosition.value = {
    x: data.inertialBallX,
    y: data.inertialBallY
  }
  
  // Store for scoring
  sensorDataHistory.push(data)
  
  // Calculate distance (simplified)
  if (sensorDataHistory.length > 1) {
    const prev = sensorDataHistory[sensorDataHistory.length - 2]
    const dist = calculateDistance(
      prev.latitude, prev.longitude,
      data.latitude, data.longitude
    )
    distanceTraveled.value += dist / 1000 // Convert to km
  }
}

const handleBadEvent = (event: BadEvent) => {
  if (isPaused.value) return
  
  // Update counters
  badEvents.value[event.type]++
  
  // Flash effect
  recentEvent.value = event.type
  if (recentEventTimeout) clearTimeout(recentEventTimeout)
  recentEventTimeout = window.setTimeout(() => {
    recentEvent.value = null
  }, 500)
  
  // Vibrate if supported
  if (navigator.vibrate) {
    navigator.vibrate(100)
  }
}

const updateLoop = () => {
  // Update score every 5 seconds
  const now = Date.now()
  if (now - lastScoreUpdate > 5000) {
    updateScore()
    lastScoreUpdate = now
  }
  
  // Draw canvases
  drawMap()
  drawInertialBall()
  
  requestAnimationFrame(updateLoop)
}

const updateScore = () => {
  if (sensorDataHistory.length === 0) return
  
  const stats: TripStats = {
    estimatedTime: estimatedTime.value * 60,
    actualTime: duration.value,
    estimatedDistance: estimatedDistance.value * 1000,
    actualDistance: distanceTraveled.value * 1000,
    harshDecelerationCount: badEvents.value.harsh_deceleration,
    harshAccelerationCount: badEvents.value.harsh_acceleration,
    sharpTurnCount: badEvents.value.sharp_turn,
    jerkCount: badEvents.value.jerk,
    gpsAccuracyAvg: 10, // Placeholder
    sensorCompleteness: 98 // Placeholder
  }
  
  const result = calculateScore(stats)
  liveScore.value = result.totalScore
  stars.value = result.stars
  smoothnessPercent.value = Math.round((result.breakdown.smoothness / 40) * 100)
}

const drawMap = () => {
  const canvas = mapCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const width = canvas.width
  const height = canvas.height
  
  // Clear
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, width, height)
  
  // Draw grid
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)'
  ctx.lineWidth = 1
  
  const gridSize = 30
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
  
  // Draw path (simplified - just show current position)
  const cx = width / 2
  const cy = height / 2
  
  // Glow effect
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40)
  gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)')
  gradient.addColorStop(1, 'rgba(102, 126, 234, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(cx, cy, 40, 0, Math.PI * 2)
  ctx.fill()
  
  // Current position dot
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(cx, cy, 8, 0, Math.PI * 2)
  ctx.fill()
  
  // Direction indicator based on speed
  if (currentSpeed.value > 0) {
    const angle = Math.atan2(currentAccel.value.lateral, currentAccel.value.longitudinal)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.sin(angle) * 25, cy - Math.cos(angle) * 25)
    ctx.stroke()
  }
}

const drawInertialBall = () => {
  const canvas = ballCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  const width = canvas.width
  const height = canvas.height
  const cx = width / 2
  const cy = height / 2
  const maxRadius = Math.min(width, height) / 2 - 20
  
  // Clear
  ctx.clearRect(0, 0, width, height)
  
  // Outer ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2)
  ctx.stroke()
  
  // Inner rings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  for (let r = maxRadius / 3; r < maxRadius; r += maxRadius / 3) {
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  
  // Crosshairs
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.beginPath()
  ctx.moveTo(cx - maxRadius, cy)
  ctx.lineTo(cx + maxRadius, cy)
  ctx.moveTo(cx, cy - maxRadius)
  ctx.lineTo(cx, cy + maxRadius)
  ctx.stroke()
  
  // Ball position
  const ballX = cx + ballPosition.value.x * (maxRadius - 15)
  const ballY = cy + ballPosition.value.y * (maxRadius - 15)
  
  // Ball glow
  const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 25)
  gradient.addColorStop(0, 'rgba(102, 126, 234, 0.6)')
  gradient.addColorStop(1, 'rgba(102, 126, 234, 0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(ballX, ballY, 25, 0, Math.PI * 2)
  ctx.fill()
  
  // Ball
  const ballGradient = ctx.createRadialGradient(ballX - 3, ballY - 3, 0, ballX, ballY, 15)
  ballGradient.addColorStop(0, '#a78bfa')
  ballGradient.addColorStop(1, '#667eea')
  ctx.fillStyle = ballGradient
  ctx.beginPath()
  ctx.arc(ballX, ballY, 15, 0, Math.PI * 2)
  ctx.fill()
  
  // Ball highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.beginPath()
  ctx.arc(ballX - 4, ballY - 4, 5, 0, Math.PI * 2)
  ctx.fill()
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000 // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const pauseTrip = () => {
  isPaused.value = true
  lastPauseTime.value = Date.now()
  if (sensorCollector) {
    sensorCollector.stop()
  }
}

const resumeTrip = () => {
  isPaused.value = false
  pausedDuration.value += Date.now() - lastPauseTime.value
  if (sensorCollector) {
    sensorCollector.start()
  }
}

const confirmEndTrip = () => {
  showEndModal.value = true
}

const endTrip = async () => {
  // Stop sensors
  if (sensorCollector) {
    sensorCollector.stop()
  }
  
  // Prepare trip data
  const tripData = {
    tripId: tripId.value,
    duration: duration.value,
    distance: distanceTraveled.value,
    score: liveScore.value,
    stars: stars.value,
    badEvents: { ...badEvents.value },
    sensorData: sensorDataHistory.slice(-100) // Save last 100 points
  }
  
  // Save to localStorage (would be API call in production)
  try {
    const trips = JSON.parse(localStorage.getItem('completed_trips') || '[]')
    trips.push({
      ...tripData,
      completedAt: new Date().toISOString()
    })
    localStorage.setItem('completed_trips', JSON.stringify(trips))
  } catch (e) {
    console.error('Failed to save trip data:', e)
  }
  
  // Navigate to result/history page
  router.push('/history')
}

const initCanvases = () => {
  // Initialize map canvas
  if (mapCanvas.value) {
    const container = mapCanvas.value.parentElement
    if (container) {
      mapCanvas.value.width = container.clientWidth
      mapCanvas.value.height = container.clientHeight
    }
  }
  
  // Initialize ball canvas
  if (ballCanvas.value) {
    ballCanvas.value.width = 160
    ballCanvas.value.height = 160
  }
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  initCanvases()
  
  // Check permissions
  if ('DeviceMotionEvent' in window) {
    showPermissionModal.value = true
  } else {
    // Auto-start on desktop/non-supporting devices
    hasPermissions.value = true
    startSensors()
  }
  
  // Handle resize
  window.addEventListener('resize', initCanvases)
})

onUnmounted(() => {
  if (sensorCollector) {
    sensorCollector.stop()
  }
  window.removeEventListener('resize', initCanvases)
  if (recentEventTimeout) clearTimeout(recentEventTimeout)
})
</script>

<style scoped>
.navigation-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.trip-info {
  display: flex;
  flex-direction: column;
}

.trip-info .label {
  font-size: 12px;
  opacity: 0.8;
}

.trip-info .duration {
  font-size: 28px;
  font-weight: bold;
  font-family: 'SF Mono', monospace;
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
}

.live-indicator .pulse {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* Main Grid */
.main-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .main-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Left Column */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Map Container */
.map-container {
  position: relative;
  height: 200px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  overflow: hidden;
}

.map-canvas {
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.coordinates {
  font-size: 10px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
}

/* Inertial Ball */
.inertial-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}

.inertial-container h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  opacity: 0.9;
}

.inertial-ball-wrapper {
  position: relative;
  display: inline-block;
}

.ball-canvas {
  display: block;
}

.crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.indicators {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.indicators span {
  position: absolute;
  font-size: 12px;
  opacity: 0.4;
}

.indicators .up { top: 5px; left: 50%; transform: translateX(-50%); }
.indicators .down { bottom: 5px; left: 50%; transform: translateX(-50%); }
.indicators .left { left: 5px; top: 50%; transform: translateY(-50%); }
.indicators .right { right: 5px; top: 50%; transform: translateY(-50%); }

.accel-values {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 12px;
  font-size: 12px;
  opacity: 0.8;
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Score Card */
.score-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.score-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
}

.score-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.score-number {
  font-size: 56px;
  font-weight: bold;
  line-height: 1;
  background: linear-gradient(135deg, #fff 0%, #e0e0ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.score-label {
  font-size: 20px;
  opacity: 0.6;
}

.star-rating {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
}

.star {
  font-size: 24px;
  filter: grayscale(1) opacity(0.3);
  transition: all 0.3s ease;
}

.star.filled {
  filter: none;
}

.smoothness-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bar-label {
  font-size: 12px;
  opacity: 0.8;
  min-width: 50px;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.bar-value {
  font-size: 12px;
  font-weight: bold;
  min-width: 35px;
  text-align: right;
}

/* Metrics Card */
.metrics-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
}

.metric-row {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.metric-row:last-child {
  margin-bottom: 0;
}

.metric {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.metric-value {
  font-size: 28px;
  font-weight: bold;
  display: block;
}

.metric-value.time-diff {
  font-size: 16px;
}

.metric-value.time-diff.ahead {
  color: #4ade80;
}

.metric-value.time-diff.on-time {
  color: #fbbf24;
}

.metric-value.time-diff.delayed {
  color: #f87171;
}

.metric-unit {
  font-size: 12px;
  opacity: 0.6;
}

.metric-label {
  display: block;
  font-size: 11px;
  opacity: 0.7;
  margin-top: 4px;
}

/* Events Card */
.events-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
}

.events-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 12px;
}

.total-badge {
  margin-left: auto;
  background: rgba(248, 113, 113, 0.3);
  color: #fca5a5;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px 12px;
  transition: all 0.3s ease;
}

.event-item.flash {
  background: rgba(248, 113, 113, 0.4);
  transform: scale(1.02);
}

.event-icon {
  font-size: 18px;
}

.event-name {
  font-size: 12px;
  flex: 1;
}

.event-count {
  font-size: 18px;
  font-weight: bold;
  color: #fca5a5;
}

/* Actions */
.actions-container {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 56px;
}

.action-btn.pause {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.action-btn.resume {
  background: rgba(74, 222, 128, 0.3);
  color: #4ade80;
}

.action-btn.end {
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: white;
}

.action-btn:active {
  transform: scale(0.98);
}

.action-btn .icon {
  font-size: 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
}

.modal-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.modal-stats .stat {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
}

.modal-stats .value {
  display: block;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}

.modal-stats .label {
  font-size: 11px;
  opacity: 0.7;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  flex: 1;
  padding: 14px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.confirm-btn {
  flex: 1;
  padding: 14px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

/* Permission Modal */
.permission-modal {
  text-align: left;
}

.permission-modal p {
  margin: 12px 0;
  font-size: 14px;
  opacity: 0.9;
}

.permission-list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.permission-list li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.permission-list li:last-child {
  border-bottom: none;
}

.permission-modal .confirm-btn {
  width: 100%;
  margin-top: 12px;
}

/* Responsive */
@media (max-width: 480px) {
  .score-number {
    font-size: 44px;
  }
  
  .metric-value {
    font-size: 24px;
  }
  
  .events-grid {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .event-item {
    padding: 8px 10px;
  }
}
</style>
