<template>
  <div id="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 检测设备类型
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  document.body.classList.add(isMobile ? 'mobile' : 'desktop')
  
  // 请求传感器权限
  if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
    // iOS 13+ 需要请求权限
    (DeviceMotionEvent as any).requestPermission()
      .then((response: string) => {
        if (response === 'granted') {
          console.log('Device motion permission granted')
        }
      })
      .catch(console.error)
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 移动端样式 */
body.mobile #app-container {
  max-width: 100vw;
  overflow-x: hidden;
}

/* 桌面端样式 */
body.desktop #app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  box-shadow: 0 0 40px rgba(0,0,0,0.1);
}

/* PWA全屏模式 */
@media (display-mode: standalone) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
