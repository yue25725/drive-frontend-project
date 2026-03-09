<template>
  <div class="admin-page">
    <header>
      <button @click="$router.back()">← 返回</button>
      <h1>司机管理</h1>
      <button class="add-btn">+ 添加</button>
    </header>
    
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="搜索司机姓名或电话" />
    </div>
    
    <div class="driver-list">
      <div class="driver-card" v-for="driver in drivers" :key="driver.id">
        <div class="driver-info">
          <div class="avatar">{{ driver.name[0] }}</div>
          <div class="details">
            <div class="name">{{ driver.name }}</div>
            <div class="phone">{{ driver.phone }}</div>
            <div class="rating">⭐{{ driver.rating }} | {{ driver.trips }}次行程</div>
          </div>
        </div>
        <div class="actions">
          <button @click="viewDetails(driver)">查看</button>
          <button class="edit">编辑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const drivers = ref([
  { id: '1', name: '张师傅', phone: '138****1234', rating: 5.0, trips: 156 },
  { id: '2', name: '李师傅', phone: '139****5678', rating: 4.8, trips: 142 },
  { id: '3', name: '王师傅', phone: '137****9012', rating: 4.9, trips: 138 },
  { id: '4', name: '赵师傅', phone: '136****3456', rating: 4.7, trips: 125 }
])

const viewDetails = (driver: any) => {
  console.log('View driver:', driver)
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

.driver-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.driver-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.driver-info {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.details .name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}

.details .phone {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.details .rating {
  color: #999;
  font-size: 12px;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  flex: 1;
  padding: 10px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.actions button.edit {
  background: #667eea;
  color: white;
}
</style>
