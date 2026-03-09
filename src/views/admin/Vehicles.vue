<template>
  <div class="admin-page">
    <header>
      <button @click="$router.back()">← 返回</button>
      <h1>车辆管理</h1>
      <button class="add-btn">+ 添加</button>
    </header>
    
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="搜索车牌号" />
    </div>
    
    <div class="vehicle-list">
      <div class="vehicle-card" v-for="vehicle in vehicles" :key="vehicle.id">
        <div class="vehicle-info">
          <div class="icon">🚗</div>
          <div class="details">
            <div class="number">{{ vehicle.number }}</div>
            <div class="meta">{{ vehicle.type }} | {{ vehicle.model }}</div>
            <div class="status" :class="vehicle.status">{{ statusText(vehicle.status) }}</div>
          </div>
        </div>
        <div class="driver-info" v-if="vehicle.driver">
          <span>当前司机: {{ vehicle.driver }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const vehicles = ref([
  { id: '1', number: '京A12345', type: '轿车', model: 'Model 3', status: 'available', driver: null },
  { id: '2', number: '京B67890', type: 'SUV', model: 'Model Y', status: 'in_use', driver: '张师傅' },
  { id: '3', number: '京C11111', type: '轿车', model: 'Model S', status: 'maintenance', driver: null }
])

const statusText = (status: string) => {
  const map: Record<string, string> = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维修中'
  }
  return map[status] || status
}
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

header button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

header button.add-btn {
  background: #4ade80;
}

h1 {
  font-size: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.vehicle-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.vehicle-info {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.icon {
  font-size: 40px;
}

.number {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.meta {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status.available {
  background: #dcfce7;
  color: #16a34a;
}

.status.in_use {
  background: #fef3c7;
  color: #d97706;
}

.status.maintenance {
  background: #fee2e2;
  color: #dc2626;
}

.driver-info {
  padding-top: 10px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 14px;
}
</style>
