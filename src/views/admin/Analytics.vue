<template>
  <div class="admin-page">
    <header>
      <button @click="$router.back()">← 返回</button>
      <h1>数据分析</h1>
    </header>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>本周行程</h3>
        <div class="value">456</div>
        <div class="trend up">↑ 12%</div>
      </div>
      <div class="stat-card">
        <h3>平均评分</h3>
        <div class="value">85.6</div>
        <div class="trend up">↑ 3%</div>
      </div>
      <div class="stat-card">
        <h3>五星率</h3>
        <div class="value">89%</div>
        <div class="trend up">↑ 5%</div>
      </div>
      <div class="stat-card">
        <h3>数据质量</h3>
        <div class="value">94%</div>
        <div class="trend up">↑ 2%</div>
      </div>
    </div>
    
    <div class="chart-section">
      <h3>行程趋势</h3>
      <div class="chart-placeholder">
        [图表：最近7天行程数量]
      </div>
    </div>
    
    <div class="chart-section">
      <h3>评分分布</h3>
      <div class="chart-placeholder">
        [图表：五星/四星/三星/二星/一星占比]
      </div>
    </div>
    
    <div class="actions">
      <button class="export-btn">📥 导出数据 (CSV)</button>
    </div>
  </div>
</template>

<script setup lang="ts">
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

h1 {
  font-size: 20px;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.stat-card h3 {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.stat-card .value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.trend {
  font-size: 14px;
  font-weight: 500;
}

.trend.up {
  color: #16a34a;
}

.trend.down {
  color: #dc2626;
}

.chart-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.chart-section h3 {
  margin-bottom: 15px;
  color: #333;
}

.chart-placeholder {
  height: 200px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.actions {
  margin-top: 20px;
}

.export-btn {
  width: 100%;
  padding: 14px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
