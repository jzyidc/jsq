import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, loginUserWeb, register, getUserInfo, logout, getNotice } from '@/api/auth'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(Cookies.get('token') || '')
  const userInfo = ref({
    id: null,
    username: '',
    email: '',
    role: '',
    avatar: '',
    nickname: '',
    phone: '',
    createTime: '',
    // 新增字段
    officialQQ: '',
    qq: '',
    agent: '',
    balance: 0,
    totalRechargeAmount: 0,
    nodeQty: 0,
    onlineDeviceQty: 0,
    expireQty: 0,
    ipAddress: '',
    // 新增的详细信息
    wx: '',
    loginTime: '',
    realName: '',
    authentication: false,
    nodeInfo: {},
    referrerInfo: {},
    myUserInfo: {}
  })
  const loading = ref(false)
  const isFirstLogin = ref(false) // 首次登录标识
  const noticeList = ref([]) // 公告列表

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value.role === 'admin')
  const isUser = computed(() => userInfo.value.role === 'user')

  // 登录
  const loginAction = async (loginForm, isAdminLogin = false) => {
    try {
      loading.value = true
      
      // 统一使用LoginUserWeb接口
      const response = await loginUserWeb(loginForm)
      
      // 处理新的响应格式：Code为1000表示成功
      if (response.Code === 1000) {
        token.value = response.Token
        // 根据登录类型设置用户角色
        const userRole = isAdminLogin ? 'admin' : 'user'
        // 根据登录返回的参数设置用户信息
        userInfo.value = {
          id: null,
          username: loginForm.username,
          email: '',
          role: userRole,
          avatar: '',
          nickname: '',
          phone: '',
          createTime: '',
          // 新增字段
          officialQQ: '',
          qq: '',
          agent: '',
          balance: 0,
          totalRechargeAmount: 0,
          nodeQty: 0,
          onlineDeviceQty: 0,
          expireQty: 0,
          ipAddress: response.Ipaddress || ''
        }
        
        // 保存token到cookie
        Cookies.set('token', token.value, { expires: 7 })
        
        // 设置首次登录标识
        isFirstLogin.value = true
        
        ElMessage.success(response.Message || '登录成功')
        return { success: true, data: response }
      } else {
        // Code不等于1000表示失败，显示服务器返回的错误信息
        const errorMessage = response.Msg || response.Message || '登录失败'
        ElMessage.error(errorMessage)
        return { success: false, message: errorMessage }
      }
    } catch (error) {
      console.error('登录错误:', error)
      // 只处理真正的网络错误或其他异常，业务逻辑错误已在上面处理
      const errorMessage = error.message || '网络连接异常，请稍后重试'
      ElMessage.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 注册
  const registerAction = async (registerForm) => {
    try {
      loading.value = true
      const response = await register(registerForm)
      
      // 处理新的响应格式：Code为1000表示成功
      if (response.Code === 1000) {
        ElMessage.success('注册成功，请登录')
        return { success: true }
      } else {
        // Code不等于1000表示失败，显示服务器返回的错误信息
        const errorMessage = response.Msg || '注册失败'
        ElMessage.error(errorMessage)
        return { success: false, message: errorMessage }
      }
    } catch (error) {
      console.error('注册错误:', error)
      // 只处理真正的网络错误或其他异常，业务逻辑错误已在上面处理
      const errorMessage = error.message || '网络连接异常，请稍后重试'
      ElMessage.error(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      if (!token.value) return
      
      const response = await getUserInfo()
      // 处理新的响应格式：code为1000表示成功
      if (response.code === 1000) {
        // 新的响应格式：用户数据直接在response中
        const userData = {
          id: response.id || userInfo.value.id,
          username: response.phone || userInfo.value.username || '用户',
          email: userInfo.value.email,
          role: userInfo.value.role, // 保持登录时设置的角色
          avatar: userInfo.value.avatar,
          nickname: response.real_name || userInfo.value.nickname,
          phone: response.phone || '',
          createTime: response.reg_time || '',
          // 新增字段
          officialQQ: response.referrer_info?.referrer_qq || '',
          qq: response.qq || '',
          agent: '',
          balance: response.balance || 0,
          totalRechargeAmount: 0,
          nodeQty: response.node_info?.total_num || 0,
          onlineDeviceQty: 0,
          expireQty: response.node_info?.expire_end_num || 0,
          ipAddress: response.Ipaddress || '',
          // 新增的详细信息
          wx: response.wx || '',
          loginTime: response.login_time || '',
          realName: response.real_name || '',
          authentication: response.Authentication || false,
          nodeInfo: response.node_info || {},
          referrerInfo: response.referrer_info || {},
          myUserInfo: response.my_user_info || {}
        }
        userInfo.value = userData
      } else if (response.code === -4) {
        // Token错误，静默处理，让request拦截器统一处理登录失效
        console.warn('Token已失效，等待request拦截器处理')
        return
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 静默处理token相关错误，避免重复提示
      // 让request拦截器统一处理登录失效逻辑
      if (error.message && (error.message.includes('Token错误') || error.message.includes('登录状态已过期'))) {
        console.warn('Token相关错误，由request拦截器统一处理')
        return
      }
      // 如果获取用户信息失败，但token存在且用户信息中有角色，不要立即登出
      if (!userInfo.value.role) {
        console.warn('用户信息获取失败且无角色信息，等待统一处理')
      }
    }
  }

  // 登出
  const logoutAction = async () => {
    // 立即清除本地状态，避免任何可能的token验证请求
    token.value = ''
    userInfo.value = {
      id: null,
      username: '',
      email: '',
      role: '',
      avatar: '',
      nickname: '',
      phone: '',
      createTime: '',
      // 新增字段
      officialQQ: '',
      qq: '',
      agent: '',
      balance: 0,
      totalRechargeAmount: 0,
      nodeQty: 0,
      onlineDeviceQty: 0,
      expireQty: 0,
      ipAddress: '',
      // 新增的详细信息
      wx: '',
      loginTime: '',
      realName: '',
      authentication: false,
      nodeInfo: {},
      referrerInfo: {},
      myUserInfo: {}
    }
    Cookies.remove('token')
    
    // 不调用logout API，避免触发token验证导致登录失效弹窗
    // 直接清除本地数据即可完成登出操作
    
    ElMessage.success('已退出登录')
  }

  // 更新用户信息
  const updateUserInfo = (newUserInfo) => {
    userInfo.value = { ...userInfo.value, ...newUserInfo }
  }

  // 获取公告
  const getNoticeAction = async () => {
    try {
      const response = await getNotice()
      if (response.code === 1000) {
        noticeList.value = response.list || []
        return { success: true, data: response.list }
      } else {
        console.error('获取公告失败:', response.msg)
        return { success: false, message: response.msg }
      }
    } catch (error) {
      console.error('获取公告错误:', error)
      return { success: false, message: '获取公告失败' }
    }
  }

  // 重置首次登录标识
  const resetFirstLogin = () => {
    isFirstLogin.value = false
  }

  // 初始化时获取用户信息（避免在登录页面触发）
  if (token.value && !window.location.pathname.includes('/login')) {
    getUserInfoAction()
  }

  return {
    // 状态
    token,
    userInfo,
    loading,
    isFirstLogin,
    noticeList,
    
    // 计算属性
    isLoggedIn,
    isAdmin,
    isUser,
    
    // 方法
    loginAction,
    registerAction,
    getUserInfoAction,
    logoutAction,
    updateUserInfo,
    getNoticeAction,
    resetFirstLogin
  }
})