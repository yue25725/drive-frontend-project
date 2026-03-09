<template>
  <div class="admin-dashboard">
    <header>
      <h1>管理后台</h1>
      <button class="logout-btn" @click="handleLogout">退出</button>
    </header>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon">🚗</div>
        <div class="content">
          <div class="value">{{ stats.vehicles }}</div>
          <div class="label">车辆总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon">👥</div>
        <div class="content">
          <div class="value">{{ stats.drivers }}</div>
          <div class="label">司机总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon">📋</div>
        <div class="content">
          <div class="value">{{ stats.activeTasks }}</div>
          <div class="label">进行中任务</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="icon">✅</div>
        <div class="content">
          <div class="value">{{ stats.todayCompleted }}</div>
          <div class="label">今日完成</div>
        </div>
      </div>
    </div>
    
    <nav class="admin-nav">
      <router-link to="/admin/drivers" class="nav-card">
        <span class="icon">👥</span>
        <span class="text">司机管理</span>
      </router-link>
      <router-link to="/admin/vehicles" class="nav-card">
        <span class="icon">🚗</span>
        <span class="text">车辆管理</span>
      </router-link>
      <router-link to="/admin/tasks" class="nav-card">
        <span class="icon">📋</span>
        <span class="text">任务管理</span>
      </router-link>
      <router-link to="/admin/analytics" class="nav-card">
        <span class="icon">📊</span>
        <span class="text">数据分析</span>
      </router-link>
    </nav>
    
    <div class="recent-section">
      <h3>最近行程</h3>
      <div class="trip-list">
        <div class="trip-item" v-for="trip in recentTrips" :key="trip.id">
          <div class="driver">{{ trip.driver }}</div>
          <div class="route">{{ trip.route }}</div>
          <div class="score">{{ trip.score }}分</div>
          <div class="stars">{{ '⭐'.repeat(trip.stars) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  vehicles: 35,
  drivers: 28,
  activeTasks: 12,
  todayCompleted: 87
})

const recentTrips = ref([
  { id: '1', driver: '张师傅', route: '科技园 → 机场', score: 92, stars: 5 },
  { id: '2', driver: '李师傅', route: '市中心 → 火车站', score: 85, stars: 4 },
  { id: '3', driver: '王师傅', route: '大学城 → 商业区', score: 88, stars: 4 }
])

const handleLogout = () => {
  localStorage.removeItem('admin_token')
  router.push('/admin')
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 28px;
  color: #333;
}

.logout-btn {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-card .icon {
  font-size: 40px;
}

.stat-card .value {
  font-size: 28px;
  font-weight: bold;
  color: #667eea;
}

.stat-card .label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.admin-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.nav-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.nav-card:hover {
  transform: translateY(-3px);
}

.nav-card .icon {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}

.nav-card .text {
  font-size: 16px;
  font-weight: 500;
}

.recent-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.recent-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trip-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.trip-item .driver {
  font-weight: 500;
  width: 70px;
}

.trip-item .route {
  flex: 1;
  color: #666;
}

.trip-item .score {
  font-weight: bold;
  color: #667eea;
}

.trip-item .stars {
  font-size: 14px;
}
</style>
