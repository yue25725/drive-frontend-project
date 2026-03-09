# 🚗 数采车队助手

一个类似滴滴出行的车队数据采集管理系统，用于采集高质量自动驾驶训练数据。

## ✨ 核心特性

- 📱 **PWA应用** - 可安装到手机桌面，像原生APP一样使用
- 🎯 **任务系统** - 类似滴滴派单，系统分配路线任务
- 📊 **实时监控** - GPS轨迹、平顺性、驾驶评分实时显示
- ⭐ **五星评分** - 参考滴滴五星司机标准
- 🏆 **激励系统** - 积分、排行、奖励机制
- 🔗 **免登录** - 司机直接访问链接即可使用

---

## 🚀 快速开始（5分钟）

### 1. 安装依赖

```bash
cd /home/dy/drive/frontend
npm install
```

### 2. 配置Supabase（免费后端）

```bash
# 1. 访问 https://supabase.com 注册账号（免费）
# 2. 创建新项目
# 3. 在 SQL Editor 执行 database/supabase_init.sql
# 4. 获取 URL 和 anon key

# 创建环境变量文件
cat > .env.local << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
EOF
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

```
司机端：http://localhost:3000
管理端：http://localhost:3000/admin
```

---

## 📱 PWA安装指南

### iOS (iPhone/iPad)

```
1. Safari打开 http://your-domain.com
2. 点击分享按钮（方形带箭头）
3. 向下滚动，点击"添加到主屏幕"
4. 命名应用，点击"添加"
5. 主屏幕出现应用图标 ✅
```

### Android

```
1. Chrome打开 http://your-domain.com
2. 浏览器会自动提示"添加到主屏幕"
3. 或点击菜单 → "添加到主屏幕"
4. 点击"安装"
5. 应用出现在桌面 ✅
```

---

## 🎯 功能模块

### 司机端（/）

- **首页** - 查看任务、积分、排名
- **任务列表** - 查看可接任务、接单
- **导航监控** - 实时GPS、惯性球、评分
- **历史行程** - 查看历史记录
- **个人中心** - 积分、评级、排行

### 管理端（/admin）

- **仪表板** - 数据概览、实时监控
- **司机管理** - 司机信息、评分查看
- **车辆管理** - 车辆编号、状态管理
- **任务管理** - 路线规划、任务派发
- **数据分析** - 统计报表、数据导出

---

## ⭐ 五星评分算法

```javascript
// 综合评分（100分）
{
  平顺性得分: 40分,    // 基于不良事件扣分
  时间效率得分: 20分,   // 预估vs实际时间
  数据质量得分: 20分,   // GPS精度、传感器完整性
  路线完成度得分: 20分  // 距离覆盖率
}

// 星级标准
⭐⭐⭐⭐⭐ 五星: 90-100分
⭐⭐⭐⭐   四星: 80-89分
⭐⭐⭐     三星: 70-79分
⭐⭐       二星: 60-69分
```

---

## 🛠️ 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **后端**: Supabase (PostgreSQL + 实时订阅)
- **PWA**: vite-plugin-pwa + Workbox
- **地图**: 高德/百度地图API（可选）

---

## 📁 项目结构

```
/home/dy/drive/
├── frontend/                # Vue3前端应用
│   ├── src/
│   │   ├── views/
│   │   │   ├── driver/     # 司机端页面
│   │   │   │   ├── Home.vue
│   │   │   │   ├── TaskList.vue
│   │   │   │   ├── Navigation.vue  # 核心监控页面
│   │   │   │   ├── Profile.vue
│   │   │   │   ├── History.vue
│   │   │   │   └── Leaderboard.vue
│   │   │   └── admin/      # 管理端页面
│   │   │       ├── Login.vue
│   │   │       ├── Dashboard.vue
│   │   │       ├── Drivers.vue
│   │   │       ├── Vehicles.vue
│   │   │       ├── Tasks.vue
│   │   │       └── Analytics.vue
│   │   ├── utils/
│   │   │   ├── sensorCollector.ts  # 传感器采集
│   │   │   ├── scoreCalculator.ts  # 评分算法
│   │   │   └── deviceDetection.ts  # 设备检测
│   │   ├── api/
│   │   │   └── supabase.ts         # Supabase API
│   │   └── router.ts               # 路由配置
│   └── package.json
├── database/
│   └── supabase_init.sql   # 数据库初始化脚本
└── docs/
    ├── FLEET_ARCHITECTURE.md
    └── SUPABASE_QUICKSTART.md
```

---

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 类型检查
npm run type-check
```

---

## 📊 传感器采集

### 不良事件检测阈值

| 事件类型 | 触发条件 | 扣分 |
|---------|---------|-----|
| 急减速 | 纵向加速度 < -3.0 m/s² | -3分 |
| 急加速 | 纵向加速度 > 3.0 m/s² | -3分 |
| 急转向 | 横向加速度 > 3.0 m/s² | -2分 |
| 顿挫 | 加速度变化率 > 4.0 m/s³ | -1分 |

### 数据采集频率

- GPS位置: 1 Hz（每秒）
- 加速度: 10 Hz（每0.1秒）
- 不良事件: 即时检测

---

## 💰 费用说明

### Supabase免费额度

```
✅ 数据库: 500MB PostgreSQL
✅ 存储: 1GB 对象存储
✅ 带宽: 5GB/月
✅ API请求: 无限制

适用场景：
- 10-20辆车队
- 1个月数据保留
```

---

## 📖 详细文档

- [架构设计](docs/FLEET_ARCHITECTURE.md)
- [Supabase配置](docs/SUPABASE_QUICKSTART.md)
- [部署指南](FLEET_DEPLOYMENT_GUIDE.md)

---

## 🎉 开始使用

```bash
# 1. 进入项目目录
cd /home/dy/drive/frontend

# 2. 安装依赖
npm install

# 3. 配置Supabase（创建.env.local）

# 4. 启动应用
npm run dev

# 5. 在手机浏览器打开
http://your-server:3000

# 6. 添加到主屏幕
# iOS: 分享 → 添加到主屏幕
# Android: 菜单 → 添加到主屏幕
```

---

**打造高质量自动驾驶数据采集车队！** 🚀
