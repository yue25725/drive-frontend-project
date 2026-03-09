<template>
  <div class="history-page">
    <div class="header">
      <h2>历史行程</h2>
    </div>
    
    <div class="trip-list">
      <div class="trip-card" v-for="trip in trips" :key="trip.id">
        <div class="trip-header">
          <div class="date">{{ trip.date }}</div>
          <div class="stars">{{ '⭐'.repeat(trip.stars) }}</div>
        </div>
        
        <div class="route">
          <div class="point">
            <span class="dot origin"></span>
            <span class="text">{{ trip.origin }}</span>
          </div>
          <div class="point">
            <span class="dot destination"></span>
            <span class="text">{{ trip.destination }}</span>
          </div>
        </div>
        
        <div class="stats">
          <div class="stat">
            <span class="label">距离</span>
            <span class="value">{{ trip.distance }} km</span>
          </div>
          <div class="stat">
            <span class="label">时长</span>
            <span class="value">{{ trip.duration }}</span>
          </div>
          <div class="stat">
            <span class="label">得分</span>
            <span class="value">{{ trip.score }}分</span>
          </div>
        </div>
      </div>
    </div>
    
    <nav class="bottom-nav">
      <div class="nav-item" @click="goToHome">
        <span class="icon">🏠</span>
        <span class="text">首页</span>
      </div>
      <div class="nav-item" @click="goToTasks">
        <span class="icon">📋</span>
        <span class="text">任务</span>
      </div>
      <div class="nav-item active" @click="goToHistory">
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

const trips = ref([
  {
    id: '1',
    date: '今天 14:30',
    origin: '科技园A区',
    destination: '机场T3航站楼',
    distance: 32.5,
    duration: '45分钟',
    score: 92,
    stars: 5
  },
  {
    id: '2',
    date: '昨天 16:45',
    origin: '市中心',
    destination: '火车站',
    distance: 18.2,
    duration: '28分钟',
    score: 85,
    stars: 4
  },
  {
    id: '3',
    date: '昨天 10:15',
    origin: '汽车站',
    destination: '大学城',
    distance: 25.8,
    duration: '38分钟',
    score: 88,
    stars: 4
  }
])

const goToHome = () => router.push('/')
const goToTasks = () => router.push('/tasks')
const goToHistory = () => router.push('/history')
const goToProfile = () => router.push('/profile')
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-bottom: 80px;
  color: white;
}

.header h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.trip-card {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.date {
  font-size: 14px;
  opacity: 0.8;
}

.stars {
  font-size: 16px;
}

.route {
  margin-bottom: 15px;
}

.point {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.origin {
  background: #4ade80;
}

.dot.destination {
  background: #f87171;
}

.point .text {
  font-size: 16px;
}

.stats {
  display: flex;
  justify-content: space-between;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat .label {
  font-size: 12px;
  opacity: 0.7;
}

.stat .value {
  font-size: 16px;
  font-weight: bold;
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
