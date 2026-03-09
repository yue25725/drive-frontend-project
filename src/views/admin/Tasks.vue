<template>
  <div class="admin-page">
    <header>
      <button @click="$router.back()">← 返回</button>
      <h1>任务管理</h1>
      <button class="add-btn">+ 新建任务</button>
    </header>
    
    <div class="filters">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
      <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">待分配</button>
      <button :class="{ active: filter === 'in_progress' }" @click="filter = 'in_progress'">进行中</button>
      <button :class="{ active: filter === 'completed' }" @click="filter = 'completed'">已完成</button>
    </div>
    
    <div class="task-list">
      <div class="task-card" v-for="task in tasks" :key="task.id">
        <div class="task-header">
          <span class="type">{{ taskTypeText(task.type) }}</span>
          <span class="status" :class="task.status">{{ statusText(task.status) }}</span>
        </div>
        
        <div class="route">
          <div class="point">
            <span class="dot origin"></span>
            <span>{{ task.origin }}</span>
          </div>
          <div class="point">
            <span class="dot destination"></span>
            <span>{{ task.destination }}</span>
          </div>
        </div>
        
        <div class="meta">
          <span>预估 {{ task.estimatedTime }}分钟</span>
          <span>{{ task.distance }}公里</span>
          <span class="priority" :class="'priority-' + task.priority">
            {{ priorityText(task.priority) }}
          </span>
        </div>
        
        <div class="assigned" v-if="task.driver">
          司机: {{ task.driver }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const filter = ref('all')

const tasks = ref([
  {
    id: '1',
    type: 'route',
    origin: '科技园A区',
    destination: '机场T3航站楼',
    estimatedTime: 45,
    distance: 32.5,
    priority: 8,
    status: 'in_progress',
    driver: '张师傅'
  },
  {
    id: '2',
    type: 'route',
    origin: '市中心',
    destination: '火车站',
    estimatedTime: 28,
    distance: 18.2,
    priority: 5,
    status: 'pending',
    driver: null
  },
  {
    id: '3',
    type: 'cruise',
    origin: '大学城',
    destination: '绕行巡航',
    estimatedTime: 60,
    distance: 40,
    priority: 3,
    status: 'completed',
    driver: '李师傅'
  }
])

const taskTypeText = (type: string) => {
  const map: Record<string, string> = {
    route: '路线任务',
    cruise: '巡航任务',
    scenario: '场景任务'
  }
  return map[type] || type
}

const statusText = (status: string) => {
  const map: Record<string, string> = {
    pending: '待分配',
    assigned: '已分配',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

const priorityText = (priority: number) => {
  if (priority >= 8) return '高优先级'
  if (priority >= 5) return '中优先级'
  return '低优先级'
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

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.filters button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}

.filters button.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.type {
  font-size: 12px;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
}

.status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
}

.status.pending {
  background: #fef3c7;
  color: #d97706;
}

.status.in_progress {
  background: #dbeafe;
  color: #2563eb;
}

.status.completed {
  background: #dcfce7;
  color: #16a34a;
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

.meta {
  display: flex;
  gap: 15px;
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.priority {
  font-weight: 500;
}

.priority.priority-8, .priority.priority-9, .priority.priority-10 {
  color: #dc2626;
}

.assigned {
  padding-top: 10px;
  border-top: 1px solid #eee;
  color: #666;
  font-size: 14px;
}
</style>
