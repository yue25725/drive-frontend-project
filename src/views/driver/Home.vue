<template>
  <div class="home-page">
    <div class="header">
      <div class="user-info">
        <div class="avatar">张</div>
        <div class="info">
          <div class="name">张师傅</div>
          <div class="rating">⭐⭐⭐⭐⭐ 五星司机</div>
        </div>
      </div>
      <div class="stats">
        <div class="points">
          <div class="value">1250</div>
          <div class="label">积分</div>
        </div>
        <div class="divider"></div>
        <div class="today">
          <div class="value">5</div>
          <div class="label">今日完成</div>
        </div>
      </div>
    </div>
    
    <div class="quick-actions">
      <button class="action-btn primary" @click="goToTasks">
        <span class="icon">🎯</span>
        <span class="text">查看任务</span>
      </button>
    </div>
    
    <div class="current-task" v-if="currentTask">
      <h3>当前任务</h3>
      <div class="task-card">
        <div class="route">
          <div class="point">
            <span class="dot origin"></span>
            <span class="text">{{ currentTask.origin }}</span>
          </div>
          <div class="point">
            <span class="dot destination"></span>
            <span class="text">{{ currentTask.destination }}</span>
          </div>
        </div>
        <div class="meta">
          <span>预估 {{ currentTask.estimatedTime }}分钟</span>
          <span>{{ currentTask.distance }}公里</span>
        </div>
        <button class="start-btn" @click="startNavigation">开始导航</button>
      </div>
    </div>
    
    <div class="ranking">
      <h3>今日排名</h3>
      <div class="rank-info">
        <div class="rank">第 3 名</div>
        <div class="percent">超过 85% 的司机</div>
      </div>
    </div>
    
    <nav class="bottom-nav">
      <div class="nav-item active" @click="goToHome">
        <span class="icon">🏠</span>
        <span class="text">首页</span>
      </div>
      <div class="nav-item" @click="goToTasks">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentTask = ref({
  origin: '科技园A区',
  destination: '机场T3航站楼',
  estimatedTime: 45,
  distance: 32.5
})

const goToHome = () => router.push('/')
const goToTasks = () => router.push('/tasks')
const goToHistory = () => router.push('/history')
const goToProfile = () => router.push('/profile')
const startNavigation = () => router.push('/navigation/new')
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-bottom: 80px;
  color: white;
}

.header {
  margin-bottom: 30px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

.info .name {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
}

.rating {
  font-size: 14px;
  opacity: 0.9;
}

.stats {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 15px;
}

.stats .value {
  font-size: 28px;
  font-weight: bold;
}

.stats .label {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
}

.divider {
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.3);
}

.quick-actions {
  margin-bottom: 30px;
}

.action-btn {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s;
}

.action-btn.primary {
  background: white;
  color: #667eea;
}

.action-btn:active {
  transform: scale(0.98);
}

.current-task, .ranking {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  font-size: 16px;
  margin-bottom: 15px;
  opacity: 0.9;
}

.task-card {
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 15px;
}

.route {
  margin-bottom: 15px;
}

.point {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.origin {
  background: #4ade80;
}

.dot.destination {
  background: #f87171;
}

.meta {
  display: flex;
  gap: 15px;
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 15px;
}

.start-btn {
  width: 100%;
  padding: 12px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.rank-info .rank {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.rank-info .percent {
  font-size: 14px;
  opacity: 0.8;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
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
</style>
