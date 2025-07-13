import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '管理员登录',
      requiresAuth: false,
      adminLogin: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      title: '注册',
      requiresAuth: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: {
      title: '忘记密码',
      requiresAuth: false
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Layout.vue'),
    meta: {
      title: '管理员后台',
      requiresAuth: true,
      roles: ['admin']
    },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true,
          roles: ['admin']
        }
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          roles: ['admin']
        }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/Settings.vue'),
        meta: {
          title: '系统设置',
          requiresAuth: true,
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/Layout.vue'),
    meta: {
      title: '用户中心',
      requiresAuth: true,
      roles: ['user', 'admin']
    },
    children: [
      {
        path: '',
        redirect: '/user/welcome'
      },
      {
        path: 'welcome',
        name: 'UserWelcome',
        component: () => import('@/views/user/Welcome.vue'),
        meta: {
          title: '欢迎页',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/Profile.vue'),
        meta: {
          title: '个人资料',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },

      {
        path: 'recharge',
        name: 'UserRecharge',
        component: () => import('@/views/user/AccountRecharge.vue'),
        meta: {
          title: '账户充值',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },
      {
        path: 'recharge-records',
        name: 'UserRechargeRecords',
        component: () => import('@/views/user/RechargeRecords.vue'),
        meta: {
          title: '充值记录',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },

      {
        path: 'logs',
        name: 'UserLogs',
        component: () => import('@/views/user/Logs.vue'),
        meta: {
          title: '操作日志',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },
      {
        path: 'products/routes',
        name: 'UserProductRoutes',
        component: () => import('@/views/user/products/Routes.vue'),
        meta: {
          title: '项目线路订购',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },
      {
        path: 'business/list',
        name: 'UserBusinessList',
        component: () => import('@/views/user/business/List.vue'),
        meta: {
          title: '业务列表',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },
      {
        path: 'business/expired',
        name: 'UserBusinessExpired',
        component: () => import('@/views/user/business/Expired.vue'),
        meta: {
          title: '过期业务',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      },
      {
        path: 'orders',
        name: 'UserOrders',
        component: () => import('@/views/user/Orders.vue'),
        meta: {
          title: '订单列表',
          requiresAuth: true,
          roles: ['user', 'admin']
        }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '权限不足'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 中后台管理系统` : '中后台管理系统'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 如果访问管理员路径，跳转到管理员登录页面
      if (to.path.startsWith('/admin')) {
        next('/admin/login')
      } else {
        next('/login')
      }
      return
    }
    
    // 如果用户已登录但没有角色信息，尝试获取用户信息（避免在登录页面触发）
    if (!userStore.userInfo.role && !to.path.includes('/login')) {
      try {
        await userStore.getUserInfoAction()
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果是token相关错误，不在这里处理，让request拦截器统一处理
        if (error.message && (error.message.includes('Token错误') || error.message.includes('登录状态已过期'))) {
          return // 直接返回，等待request拦截器处理跳转
        }
      }
    }
    
    // 检查角色权限
    if (to.meta.roles && userStore.userInfo.role && !to.meta.roles.includes(userStore.userInfo.role)) {
      next('/403')
      return
    }
    
    // 如果仍然没有角色信息，根据访问路径推断角色
    if (!userStore.userInfo.role) {
      if (to.path.startsWith('/admin')) {
        userStore.updateUserInfo({ role: 'admin' })
      } else if (to.path.startsWith('/user')) {
        userStore.updateUserInfo({ role: 'user' })
      }
    }
  }
  
  // 已登录用户访问登录/注册页面时重定向
  if ((to.path === '/login' || to.path === '/register') && userStore.isLoggedIn) {
    const role = userStore.userInfo.role
    next(role === 'admin' ? '/admin' : '/')
    return
  }
  
  next()
})

export default router