<template>
  <div class="task-list-page" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- Pull to refresh indicator -->
    <div class="refresh-indicator" :style="{ transform: `translateY(${refreshDistance}px)` }">
      <span v-if="isRefreshing">🔄 刷新中...</span>
      <span v-else>↓ 下拉刷新</span>
    </div>

    <!-- Header -->
    <div class="header">
      <h1>📋 任务列表</h1>
      <div class="task-count" v-if="tasks.length > 0">
        {{ tasks.length }} 个可用任务
      </div>
    </div>

    <!-- Filter & Sort Controls -->
    <div class="controls">
      <div class="filter-group">
        <button 
          class="filter-btn" 
          :class="{ active: filterType === 'all' }"
          @click="filterType = 'all'"
        >
          全部
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filterType === 'route' }"
          @click="filterType = 'route'"
        >
          🛣️ 路线
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filterType === 'cruise' }"
          @click="filterType = 'cruise'"
        >
          🚗 巡航
        </button>
        <button 
          class="filter-btn" 
          :class="{ active: filterType === 'scenario' }"
          @click="filterType = 'scenario'"
        >
          🎯 场景
        </button>
      </div>
      
      <div class="sort-group">
        <select v-model="sortBy" class="sort-select">
          <option value="priority">按优先级</option>
          <option value="distance">按距离</option>
          <option value="time">按时间</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>加载任务中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <span class="error-icon">⚠️</span>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchTasks">重试</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTasks.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>暂无可用任务</h3>
      <p>请稍后再来查看，或联系调度中心</p>
      <button class="refresh-btn" @click="fetchTasks">刷新任务</button>
    </div>

    <!-- Task List -->
    <div v-else class="task-list">
      <div 
        v-for="(task, index) in filteredTasks" 
        :key="task.id"
        class="task-card"
        :style="{ animationDelay: `${index * 0.05}s` }"
      >
        <!-- Task Header -->
        <div class="task-header">
          <div class="task-type-badge" :class="task.type">
            {{ getTypeEmoji(task.type) }} {{ getTypeLabel(task.type) }}
          </div>
          <div class="priority-badge" :class="getPriorityClass(task.priority)">
            {{ getPriorityLabel(task.priority) }}
          </div>
        </div>

        <!-- Route Visualization -->
        <div class="route-visual">
          <div class="route-line">
            <div class="point origin">
              <div class="dot"></div>
              <div class="label">
                <span class="prefix">从</span>
                <span class="name">{{ task.origin_name || '起点' }}</span>
              </div>
            </div>
            <div class="line"></div>
            <div class="point destination">
              <div class="dot"></div>
              <div class="label">
                <span class="prefix">到</span>
                <span class="name">{{ task.destination_name || '终点' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Meta Info -->
        <div class="task-meta">
          <div class="meta-item">
            <span class="icon">⏱</span>
            <span class="value">{{ task.estimated_duration || '--' }} 分钟</span>
          </div>
          <div class="meta-item">
            <span class="icon">📍</span>
            <span class="value">{{ task.estimated_distance?.toFixed(1) || '--' }} 公里</span>
          </div>
          <div class="meta-item status">
            <span class="status-dot" :class="task.status"></span>
            <span class="value">{{ getStatusLabel(task.status) }}</span>
          </div>
        </div>

        <!-- Quality Requirement (if any) -->
        <div v-if="task.min_quality_score" class="quality-requirement">
          <span class="icon">⭐</span>
          <span>要求评分 ≥ {{ task.min_quality_score }}</span>
        </div>

        <!-- Action Button -->
        <button 
          class="accept-btn"
          :class="{ accepted: task.status === 'assigned' && task.assigned_driver_id === currentDriverId }"
          :disabled="acceptingTaskId === task.id || (task.status === 'assigned' && task.assigned_driver_id !== currentDriverId)"
          @click="acceptTask(task)"
        >
          <span v-if="acceptingTaskId === task.id" class="loading-spinner"></span>
          <span v-else-if="task.status === 'assigned' && task.assigned_driver_id === currentDriverId">
            ✓ 已接单
          </span>
          <span v-else-if="task.status === 'assigned'">
            已被接走
          </span>
          <span v-else>
            接受任务
          </span>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <div class="nav-item" @click="goToHome">
        <span class="icon">🏠</span>
        <span class="text">首页</span>
      </div>
      <div class="nav-item active" @click="goToTasks">
        <span class="icon">📋</span>
        <span class="text">任务</span>
      </div>
      <div class="nav-item" @click="goToHistory">
        <span class="icon">📊</span>
        <span class="text">历史</span>
      </div>
      <div class="nav-item" @click="goToProfile">
        <span class="icon">👤</span>
        <span class="text">我的</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { taskApi } from '@/api/supabase'
import type { Task } from '@/utils/types'

const router = useRouter()

// State
const tasks = ref<Task[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const acceptingTaskId = ref<string | null>(null)
const filterType = ref<'all' | 'route' | 'cruise' | 'scenario'>('all')
const sortBy = ref<'priority' | 'distance' | 'time'>('priority')

// Pull to refresh
const isRefreshing = ref(false)
const refreshDistance = ref(0)
const touchStartY = ref(0)

// Mock driver ID - in real app, get from auth store
const currentDriverId = ref('driver-123')

// Computed
const filteredTasks = computed(() => {
  let result = [...tasks.value]

  // Filter by type
  if (filterType.value !== 'all') {
    result = result.filter(task => task.type === filterType.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'priority':
        return (b.priority || 0) - (a.priority || 0)
      case 'distance':
        return (a.estimated_distance || 0) - (b.estimated_distance || 0)
      case 'time':
        return (a.estimated_duration || 0) - (b.estimated_duration || 0)
      default:
        return 0
    }
  })

  return result
})

// Methods
const fetchTasks = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const data = await taskApi.getAvailableTasks(currentDriverId.value)
    tasks.value = data || []
  } catch (err: any) {
    console.error('Failed to fetch tasks:', err)
    error.value = err.message || '加载任务失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

const acceptTask = async (task: Task) => {
  if (acceptingTaskId.value || task.status === 'assigned') return
  
  acceptingTaskId.value = task.id
  
  try {
    await taskApi.acceptTask(task.id, currentDriverId.value)
    
    // Update local state
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = {
        ...tasks.value[index],
        status: 'assigned',
        assigned_driver_id: currentDriverId.value
      }
    }

    // Navigate to navigation page after short delay for visual feedback
    setTimeout(() => {
      router.push({
        path: '/navigation/new',
        query: { taskId: task.id }
      })
    }, 800)
    
  } catch (err: any) {
    console.error('Failed to accept task:', err)
    alert('接单失败: ' + (err.message || '请稍后重试'))
  } finally {
    acceptingTaskId.value = null
  }
}

const getTypeEmoji = (type: string) => {
  const emojis = {
    route: '🛣️',
    cruise: '🚗',
    scenario: '🎯'
  }
  return emojis[type as keyof typeof emojis] || '📍'
}

const getTypeLabel = (type: string) => {
  const labels = {
    route: '路线任务',
    cruise: '巡航任务',
    scenario: '场景任务'
  }
  return labels[type as keyof typeof labels] || type
}

const getPriorityClass = (priority?: number) => {
  if (!priority) return 'low'
  if (priority >= 8) return 'high'
  if (priority >= 5) return 'medium'
  return 'low'
}

const getPriorityLabel = (priority?: number) => {
  if (!priority) return '低'
  if (priority >= 8) return '高优先'
  if (priority >= 5) return '中优先'
  return '低优先'
}

const getStatusLabel = (status: string) => {
  const labels = {
    pending: '待接单',
    assigned: '已指派',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return labels[status as keyof typeof labels] || status
}

// Pull to refresh handlers
const handleTouchStart = (e: TouchEvent) => {
  touchStartY.value = e.touches[0].clientY
}

const handleTouchMove = (e: TouchEvent) => {
  const currentY = e.touches[0].clientY
  const diff = currentY - touchStartY.value
  
  if (diff > 0 && window.scrollY === 0) {
    refreshDistance.value = Math.min(diff * 0.5, 100)
  }
}

const handleTouchEnd = async () => {
  if (refreshDistance.value > 60 && !isRefreshing.value) {
    isRefreshing.value = true
    await fetchTasks()
    isRefreshing.value = false
  }
  refreshDistance.value = 0
}

// Navigation
const goToHome = () => router.push('/')
const goToTasks = () => router.push('/tasks')
const goToHistory = () => router.push('/history')
const goToProfile = () => router.push('/profile')

// Lifecycle
onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
.task-list-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-bottom: 80px;
  color: white;
  overflow-x: hidden;
  position: relative;
}

/* Refresh Indicator */
.refresh-indicator {
  position: absolute;
  top: -40px;
  left: 0;
  right: 0;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  opacity: 0.8;
  transition: transform 0.2s ease-out;
  pointer-events: none;
}

/* Header */
.header {
  margin-bottom: 20px;
}

.header h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 8px;
}

.task-count {
  font-size: 14px;
  opacity: 0.8;
}

/* Controls */
.controls {
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;
}

.filter-btn {
  flex-shrink: 0;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.filter-btn:active {
  transform: scale(0.95);
}

.sort-group {
  display: flex;
  justify-content: flex-end;
}

.sort-select {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.sort-select option {
  background: #764ba2;
  color: white;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 12px 24px;
  background: white;
  color: #764ba2;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 24px;
}

.refresh-btn {
  padding: 12px 24px;
  background: white;
  color: #764ba2;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideIn 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Task Header */
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.task-type-badge {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.task-type-badge.route {
  background: rgba(59, 130, 246, 0.3);
}

.task-type-badge.cruise {
  background: rgba(16, 185, 129, 0.3);
}

.task-type-badge.scenario {
  background: rgba(245, 158, 11, 0.3);
}

.priority-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
}

.priority-badge.high {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.priority-badge.medium {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.priority-badge.low {
  background: rgba(255, 255, 255, 0.2);
}

/* Route Visual */
.route-visual {
  margin-bottom: 16px;
}

.route-line {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.point {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.point.origin .dot {
  background: #4ade80;
  box-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
}

.point.destination .dot {
  background: #f87171;
  box-shadow: 0 0 10px rgba(248, 113, 113, 0.6);
}

.label {
  display: flex;
  flex-direction: column;
}

.prefix {
  font-size: 11px;
  opacity: 0.7;
  line-height: 1;
  margin-bottom: 2px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.line {
  position: absolute;
  left: 6px;
  top: 30px;
  width: 2px;
  height: calc(100% - 60px);
  background: linear-gradient(180deg, #4ade80 0%, #f87171 100%);
  opacity: 0.5;
}

/* Task Meta */
.task-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.meta-item .icon {
  font-size: 16px;
}

.meta-item.status {
  margin-left: auto;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.status-dot.pending {
  background: #fbbf24;
  box-shadow: 0 0 8px rgba(251, 191, 36, 0.6);
}

.status-dot.assigned {
  background: #60a5fa;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.6);
}

.status-dot.in_progress {
  background: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.6);
}

/* Quality Requirement */
.quality-requirement {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 12px;
}

/* Accept Button */
.accept-btn {
  width: 100%;
  padding: 14px;
  background: white;
  color: #764ba2;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.accept-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.accept-btn.accepted {
  background: #34d399;
  color: white;
}

.accept-btn:disabled {
  background: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.5);
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(118, 75, 162, 0.3);
  border-top-color: #764ba2;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item.active {
  color: #667eea;
}

.nav-item .icon {
  font-size: 24px;
}

.nav-item .text {
  font-size: 12px;
}

/* Responsive */
@media (max-width: 380px) {
  .task-meta {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .meta-item.status {
    margin-left: 0;
    width: 100%;
  }
}
</style>
