<template>
  <div class="leaderboard-page">
    <div class="header">
      <h2>🏆 排行榜</h2>
      <div class="tabs">
        <button :class="{ active: period === 'week' }" @click="period = 'week'">本周</button>
        <button :class="{ active: period === 'month' }" @click="period = 'month'">本月</button>
      </div>
    </div>
    
    <div class="top-three">
      <div class="rank-item second">
        <div class="medal">🥈</div>
        <div class="name">李师傅</div>
        <div class="score">{{ period === 'week' ? '92%' : '94%' }}五星率</div>
      </div>
      <div class="rank-item first">
        <div class="medal">🥇</div>
        <div class="name">张师傅</div>
        <div class="score">{{ period === 'week' ? '95%' : '93%' }}五星率</div>
      </div>
      <div class="rank-item third">
        <div class="medal">🥉</div>
        <div class="name">王师傅</div>
        <div class="score">{{ period === 'week' ? '90%' : '89%' }}五星率</div>
      </div>
    </div>
    
    <div class="rank-list">
      <div class="rank-item" v-for="(driver, index) in drivers" :key="driver.id">
        <div class="rank">{{ index + 4 }}</div>
        <div class="name">{{ driver.name }}</div>
        <div class="score">{{ driver.score }}分</div>
        <div class="star-rate">{{ driver.starRate }}%</div>
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
const period = ref('week')

const drivers = ref([
  { id: '4', name: '赵师傅', score: 84, starRate: 88 },
  { id: '5', name: '刘师傅', score: 82, starRate: 86 },
  { id: '6', name: '陈师傅', score: 80, starRate: 84 },
  { id: '7', name: '孙师傅', score: 78, starRate: 82 },
  { id: '8', name: '周师傅', score: 76, starRate: 80 },
])

const goToHome = () => router.push('/')
const goToTasks = () => router.push('/tasks')
const goToHistory = () => router.push('/history')
const goToProfile = () => router.push('/profile')
</script>

<style scoped>
.leaderboard-page {
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

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  flex: 1;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.tabs button.active {
  background: white;
  color: #667eea;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 15px;
  margin-bottom: 30px;
}

.top-three .rank-item {
  background: rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  flex: 1;
}

.top-three .first {
  padding: 30px 20px;
}

.medal {
  font-size: 40px;
  margin-bottom: 10px;
}

.name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.score {
  font-size: 14px;
  opacity: 0.8;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rank-list .rank-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 15px;
}

.rank-list .rank {
  width: 30px;
  font-size: 18px;
  font-weight: bold;
}

.rank-list .name {
  flex: 1;
  font-size: 16px;
}

.rank-list .score, .rank-list .star-rate {
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
}

.nav-item .icon {
  font-size: 24px;
}

.nav-item .text {
  font-size: 12px;
}
</style>
