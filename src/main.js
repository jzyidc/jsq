import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import Cookies from 'js-cookie'

import App from './App.vue'
import router from './router'
import './styles/index.scss'

const app = createApp(App)
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn
})

// 应用初始化时检查登录状态并获取用户信息
app.mount('#app')

// 在应用挂载后初始化用户信息
const initUserInfo = async () => {
  const token = Cookies.get('token')
  if (token) {
    const { useUserStore } = await import('@/store/user')
    const userStore = useUserStore()
    try {
      await userStore.getUserInfoAction()
    } catch (error) {
      console.error('初始化用户信息失败:', error)
    }
  }
}

initUserInfo()