import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 司机端路由
    {
      path: '/',
      name: 'home',
      component: () => import('./views/driver/Home.vue'),
      meta: { title: '首页', requiresAuth: false }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('./views/driver/TaskList.vue'),
      meta: { title: '任务列表', requiresAuth: false }
    },
    {
      path: '/navigation/:tripId',
      name: 'navigation',
      component: () => import('./views/driver/Navigation.vue'),
      meta: { title: '导航中', requiresAuth: false }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/driver/Profile.vue'),
      meta: { title: '个人中心', requiresAuth: false }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('./views/driver/History.vue'),
      meta: { title: '历史行程', requiresAuth: false }
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('./views/driver/Leaderboard.vue'),
      meta: { title: '排行榜', requiresAuth: false }
    },
    
    // 管理端路由
    {
      path: '/admin',
      name: 'admin-login',
      component: () => import('./views/admin/Login.vue'),
      meta: { title: '管理员登录', requiresAuth: false }
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('./views/admin/Dashboard.vue'),
      meta: { title: '管理后台', requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/drivers',
      name: 'admin-drivers',
      component: () => import('./views/admin/Drivers.vue'),
      meta: { title: '司机管理', requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/vehicles',
      name: 'admin-vehicles',
      component: () => import('./views/admin/Vehicles.vue'),
      meta: { title: '车辆管理', requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/tasks',
      name: 'admin-tasks',
      component: () => import('./views/admin/Tasks.vue'),
      meta: { title: '任务管理', requiresAuth: true, isAdmin: true }
    },
    {
      path: '/admin/analytics',
      name: 'admin-analytics',
      component: () => import('./views/admin/Analytics.vue'),
      meta: { title: '数据分析', requiresAuth: true, isAdmin: true }
    },
    
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('./views/NotFound.vue'),
      meta: { title: '页面未找到' }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '数采车队助手'} - 数采助手`
  
  // 检查管理员权限
  if (to.meta.isAdmin) {
    const isAdmin = localStorage.getItem('admin_token')
    if (!isAdmin) {
      return next('/admin')
    }
  }
  
  next()
})

export default router
