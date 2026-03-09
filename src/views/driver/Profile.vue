<template>
  <div class="profile-page">
    <div class="header">
      <div class="user-info">
        <div class="avatar">张</div>
        <div class="info">
          <div class="name">张师傅</div>
          <div class="rating">⭐⭐⭐⭐⭐ 五星司机</div>
        </div>
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="value">1250</div>
        <div class="label">总积分</div>
      </div>
      <div class="stat-card">
        <div class="value">156</div>
        <div class="label">总行程</div>
      </div>
      <div class="stat-card">
        <div class="value">92%</div>
        <div class="label">五星率</div>
      </div>
      <div class="stat-card">
        <div class="value">85.6</div>
        <div class="label">平均分</div>
      </div>
    </div>
    
    <div class="section">
      <h3>📊 星级分布</h3>
      <div class="star-bars">
        <div class="star-bar">
          <span class="stars">⭐⭐⭐⭐⭐</span>
          <div class="bar">
            <div class="fill" style="width: 92%"></div>
          </div>
          <span class="count">144</span>
        </div>
        <div class="star-bar">
          <span class="stars">⭐⭐⭐⭐</span>
          <div class="bar">
            <div class="fill" style="width: 6%"></div>
          </div>
          <span class="count">8</span>
        </div>
        <div class="star-bar">
          <span class="stars">⭐⭐⭐</span>
          <div class="bar">
            <div class="fill" style="width: 2%"></div>
          </div>
          <span class="count">3</span>
        </div>
        <div class="star-bar">
          <span class="stars">⭐⭐</span>
          <div class="bar">
            <div class="fill" style="width: 0.5%"></div>
          </div>
          <span class="count">1</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h3>🏆 最近积分</h3>
      <div class="points-list">
        <div class="point-item">
          <div class="info">
            <div class="reason">五星任务奖励</div>
            <div class="time">今天 14:30</div>
          </div>
          <div class="points positive">+50</div>
        </div>
        <div class="point-item">
          <div class="info">
            <div class="reason">连续7天作业奖励</div>
            <div class="time">今天 10:00</div>
          </div>
          <div class="points positive">+300</div>
        </div>
        <div class="point-item">
          <div class="info">
            <div class="reason">四星任务奖励</div>
            <div class="time">昨天 16:45</div>
          </div>
          <div class="points positive">+40</div>
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
      <div class="nav-item" @click="goToHistory">
        <span class="icon">📊</span>
        <span class="text">历史</span>
      </div>
      <div class="nav-item active" @click="goToProfile">
        <span class="icon">👤</span>
        <span class="text">我的</span>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => router.push('/')
const goToTasks = () => router.push('/tasks')
const goToHistory = () => router.push('/history')
const goToProfile = () => router.push('/profile')
</script>

<style scoped>
.profile-page {
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
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
}

.info .name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.rating {
  font-size: 14px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-card .value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-card .label {
  font-size: 14px;
  opacity: 0.8;
}

.section {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.star-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.star-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.star-bar .stars {
  font-size: 12px;
  width: 80px;
}

.star-bar .bar {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  overflow: hidden;
}

.star-bar .fill {
  height: 100%;
  background: white;
  border-radius: 4px;
}

.star-bar .count {
  width: 30px;
  text-align: right;
  font-size: 14px;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.point-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
}

.point-item .reason {
  font-size: 16px;
  margin-bottom: 5px;
}

.point-item .time {
  font-size: 12px;
  opacity: 0.7;
}

.point-item .points {
  font-size: 20px;
  font-weight: bold;
}

.point-item .points.positive {
  color: #4ade80;
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
