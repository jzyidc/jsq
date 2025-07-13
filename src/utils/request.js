import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/user'
import router from '@/router'
import Cookies from 'js-cookie'

// 防止重复弹出登录过期提示
let isShowingLoginExpiredDialog = false

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = Cookies.get('token')
    const currentPath = window.location.pathname
    
    // 如果不在登录页面且有token，才添加token到请求头
    // 避免在登录页面发送带token的请求触发登录失效检查
    if (token && !currentPath.includes('/login')) {
      config.headers.Token = token
    }
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 处理新的响应格式：Code为1000表示成功，其他值表示失败
    if (res.Code === 1000) {
      return res
    }
    
    // 处理Token错误 - Code为-1000表示Token错误
    if (res.Code === -1000) {
      // 如果已经在登录页面，不需要再次提示
      const currentPath = window.location.pathname
      if (currentPath.includes('/login')) {
        return Promise.reject(new Error(res.Msg || 'Token错误'))
      }
      
      // token错误，防止重复弹出对话框
      if (!isShowingLoginExpiredDialog) {
        isShowingLoginExpiredDialog = true
        ElMessageBox.confirm(
          '登录失效，请重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          try {
            const userStore = useUserStore()
            // 立即跳转到登录页面，提升用户体验
            router.replace('/login')
            // 在后台执行登出操作
            userStore.logoutAction().catch(error => {
              console.error('后台登出操作失败:', error)
            })
          } catch (error) {
            console.error('跳转失败:', error)
            // 确保能够跳转到登录页
            router.replace('/login')
          }
        }).catch(() => {
          // 用户点击取消，也跳转到登录页面
          router.replace('/login')
        }).finally(() => {
          // 延迟重置标志，确保跳转完成后再允许下次弹出
          setTimeout(() => {
            isShowingLoginExpiredDialog = false
          }, 1000)
        })
      }
      return Promise.reject(new Error(res.Msg || 'Token错误'))
    }
    
    // 处理业务错误 - 使用新的响应格式
    if (res.Code === 401 || res.Code === -401 || res.Code === -4) {
      // 如果已经在登录页面，不需要再次提示
      const currentPath = window.location.pathname
      if (currentPath.includes('/login')) {
        return Promise.reject(new Error(res.Msg || '登录状态已过期'))
      }
      
      // token过期或无效，防止重复弹出对话框
      if (!isShowingLoginExpiredDialog) {
        isShowingLoginExpiredDialog = true
        ElMessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          try {
            const userStore = useUserStore()
            // 立即跳转到登录页面，提升用户体验
            router.replace('/login')
            // 在后台执行登出操作
            userStore.logoutAction().catch(error => {
              console.error('后台登出操作失败:', error)
            })
          } catch (error) {
            console.error('跳转失败:', error)
            // 确保能够跳转到登录页
            router.replace('/login')
          }
        }).catch(() => {
          // 用户点击取消，也跳转到登录页面
          router.replace('/login')
        }).finally(() => {
          // 延迟重置标志，确保跳转完成后再允许下次弹出
          setTimeout(() => {
            isShowingLoginExpiredDialog = false
          }, 1000)
        })
      }
      return Promise.reject(new Error(res.Msg || '登录状态已过期'))
    }
    
    if (res.Code === 403 || res.Code === -403) {
      ElMessage.error('权限不足')
      router.push('/403')
      return Promise.reject(new Error('权限不足'))
    }
    
    // 兼容旧的响应格式
    if (res.code === 200) {
      return res
    }
    
    if (res.code === 401) {
      // 如果已经在登录页面，不需要再次提示
      const currentPath = window.location.pathname
      if (currentPath.includes('/login')) {
        return Promise.reject(new Error(res.message || '登录状态已过期'))
      }
      
      // 防止重复弹出对话框
      if (!isShowingLoginExpiredDialog) {
        isShowingLoginExpiredDialog = true
        ElMessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(async () => {
          try {
            const userStore = useUserStore()
            // 立即跳转到登录页面，提升用户体验
            router.replace('/login')
            // 在后台执行登出操作
            userStore.logoutAction().catch(error => {
              console.error('后台登出操作失败:', error)
            })
          } catch (error) {
            console.error('跳转失败:', error)
            // 确保能够跳转到登录页
            router.replace('/login')
          }
        }).catch(() => {
          // 用户点击取消，也跳转到登录页面
          router.replace('/login')
        }).finally(() => {
          // 延迟重置标志，确保跳转完成后再允许下次弹出
          setTimeout(() => {
            isShowingLoginExpiredDialog = false
          }, 1000)
        })
      }
      return Promise.reject(new Error(res.message || '登录状态已过期'))
    }
    
    if (res.code === 403) {
      ElMessage.error('权限不足')
      router.push('/403')
      return Promise.reject(new Error('权限不足'))
    }
    
    // 其他业务错误 - 不在拦截器中显示提示，让业务代码自己处理
    // 直接返回响应数据，让业务代码根据Code判断成功或失败
    return res
  },
  error => {
    console.error('响应错误:', error)
    
    let message = '网络错误'
    
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 使用异步处理确保登出完成后再跳转
          ;(async () => {
            try {
              const userStore = useUserStore()
              // 立即跳转到登录页面，提升用户体验
              router.replace('/login')
              // 在后台执行登出操作
              userStore.logoutAction().catch(error => {
                console.error('后台登出操作失败:', error)
              })
            } catch (error) {
              console.error('跳转失败:', error)
              router.replace('/login')
            }
          })()
          break
        case 403:
          message = '权限不足'
          router.push('/403')
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    } else if (error.code === 'ECONNABORTED') {
      message = '请求超时'
    } else if (error.message.includes('Network Error')) {
      message = '网络连接异常'
    }
    
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service