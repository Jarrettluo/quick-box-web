import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initStorage } from './utils/storage'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化 IndexedDB
initStorage().then(() => {
  console.log('IndexedDB 初始化完成')
}).catch(error => {
  console.error('IndexedDB 初始化失败:', error)
}).finally(() => {
  app.mount('#app')
})
