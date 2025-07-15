<template>
  <div class="user-layout">
    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobile && !isCollapse" 
      class="mobile-overlay" 
      @click="toggleCollapse"
    ></div>
    
    <!-- 侧边栏 -->
    <el-aside 
      :width="isCollapse ? '64px' : '200px'" 
      :class="['sidebar', { 'mobile-hidden': isMobile && isCollapse }]"
    >
      <div class="logo">
        <img src="/logo.svg" alt="Logo" v-if="!isCollapse" />
        <span v-if="!isCollapse">用户中心</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/user/welcome">
          <el-icon><House /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        
        <el-sub-menu index="finance">
          <template #title>
            <el-icon><CreditCard /></el-icon>
            <span>财务管理</span>
          </template>
          <el-menu-item index="/user/recharge">
            <el-icon><Money /></el-icon>
            <template #title>账户充值</template>
          </el-menu-item>
          <el-menu-item index="/user/recharge-records">
            <el-icon><Document /></el-icon>
            <template #title>充值记录</template>
          </el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="products">
          <template #title>
            <el-icon><ShoppingCart /></el-icon>
            <span>订购产品</span>
          </template>
          <el-menu-item index="/user/products/routes">
            <el-icon><Connection /></el-icon>
            <template #title>项目线路</template>
          </el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="business">
          <template #title>
            <el-icon><Management /></el-icon>
            <span>业务管理</span>
          </template>
          <el-menu-item index="/user/business/list">
            <el-icon><List /></el-icon>
            <template #title>业务列表</template>
          </el-menu-item>
          <el-menu-item index="/user/business/expired">
            <el-icon><Warning /></el-icon>
            <template #title>过期业务</template>
          </el-menu-item>
          <el-menu-item index="/user/orders">
            <el-icon><Document /></el-icon>
            <template #title>订单列表</template>
          </el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="promotion">
          <template #title>
            <el-icon><Share /></el-icon>
            <span>推广管理</span>
          </template>
          <el-menu-item index="/user/promotion/agent">
            <el-icon><UserFilled /></el-icon>
            <template #title>代理推广</template>
          </el-menu-item>
          <el-menu-item index="/user/promotion/users">
            <el-icon><User /></el-icon>
            <template #title>代理用户</template>
          </el-menu-item>
          <el-menu-item index="/user/promotion/settings">
            <el-icon><Setting /></el-icon>
            <template #title>提现设置</template>
          </el-menu-item>
          <el-menu-item index="/user/promotion/withdraw">
            <el-icon><Money /></el-icon>
            <template #title>订单结算</template>
          </el-menu-item>
          <el-menu-item index="/user/promotion/withdraw-list">
            <el-icon><List /></el-icon>
            <template #title>提现列表</template>
          </el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="account">
          <template #title>
            <el-icon><User /></el-icon>
            <span>账户管理</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <template #title>个人资料</template>
          </el-menu-item>

          <el-menu-item index="/user/logs">
            <el-icon><Document /></el-icon>
            <template #title>操作日志</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container class="main-container">
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            type="text"
            @click="toggleCollapse"
            class="collapse-btn"
          >
            <el-icon><Expand v-if="isCollapse" /><Fold v-else /></el-icon>
          </el-button>
          
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/user' }">用户中心</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <!-- 快捷操作 -->
          <el-button type="text" @click="$router.push('/admin')" v-if="userStore.isAdmin">
            <el-icon><Setting /></el-icon>
            管理后台
          </el-button>
          
          <!-- 用户信息 -->
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :src="getDefaultAvatar" class="avatar">
                {{ getUserAvatarLetter(userStore.userInfo) }}
              </el-avatar>
              <span class="username">{{ getUserDisplayName(userStore.userInfo) }}</span>
              <el-icon class="arrow-down"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人资料
                </el-dropdown-item>

                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 主要内容 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { getUserDisplayName, getUserAvatarLetter } from '@/utils/userHelper'
import {
  House,
  User,
  CreditCard,
  Lock,
  Document,
  Setting,
  Fold,
  Expand,
  Bell,
  Connection,
  SwitchButton,
  ShoppingCart,
  Management,
  List,
  Warning,
  Money,
  Share,
  UserFilled
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 移动端检测
const isMobile = ref(false)

// 检测是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  // 移动端默认收起侧边栏
  if (isMobile.value) {
    isCollapse.value = true
  }
}

// 监听窗口大小变化
const handleResize = () => {
  checkMobile()
}

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 默认头像
const getDefaultAvatar = computed(() => {
  if (userStore.userInfo.avatar) {
    return userStore.userInfo.avatar
  }
  // 根据用户ID或手机号生成固定的默认头像
  const userId = userStore.userInfo.id || userStore.userInfo.phone || '1'
  const avatarIndex = (parseInt(userId.toString()) % 6) + 1
  return `/avatars/avatar${avatarIndex}.svg`
})

// 面包屑导航
const breadcrumbItems = computed(() => {
  const items = []
  switch (route.path) {
    case '/user/welcome':
      items.push('首页')
      break
    case '/user/profile':
      items.push('账户管理', '个人资料')
      break

    case '/user/recharge':
      items.push('财务管理', '账户充值')
      break
    case '/user/recharge-records':
      items.push('财务管理', '充值记录')
      break

    case '/user/logs':
      items.push('账户管理', '操作日志')
      break
    case '/user/products/routes':
      items.push('订购产品', '项目线路')
      break
    case '/user/business/list':
      items.push('业务管理', '业务列表')
      break
    case '/user/business/expired':
      items.push('业务管理', '过期业务')
      break
    case '/user/orders':
      items.push('订单列表')
      break
    case '/user/promotion/agent':
      items.push('推广管理', '代理推广')
      break
    case '/user/promotion/settings':
      items.push('推广管理', '提现设置')
      break
  }
  return items
})

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理用户下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break

    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logoutAction().then(() => {
      router.push('/login')
    })
  })
}

// 组件挂载时获取用户信息
onMounted(() => {
  // 确保获取最新的用户信息
  userStore.getUserInfoAction()
  
  // 初始化移动端检测
  checkMobile()
  
  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听路由变化，移动端自动收起侧边栏
watch(
  () => route.path,
  () => {
    if (isMobile.value) {
      isCollapse.value = true
    }
  }
)
</script>

<style lang="scss" scoped>
.user-layout {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #1f1f1f;
    
    img {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }
  }
  
  .sidebar-menu {
    border-right: none;
    background-color: #304156;
    
    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.65);
      border-radius: 4px;
      margin: 4px 8px;
      
      &:hover {
        background-color: #409eff;
        color: #fff;
      }
      
      &.is-active {
        background-color: #409eff;
        color: #fff;
      }
    }
    
    :deep(.el-sub-menu) {
      .el-sub-menu__title {
        border-radius: 4px;
        margin: 4px 8px;
        color: #bfcbd9;
        &:hover {
          background-color: #409eff;
          color: #fff;
        }
      }
      
      .el-menu {
        background-color: #263445;
        
        .el-menu-item {
          border-radius: 4px;
          margin: 2px 16px;
          background-color: transparent;
          color: #bfcbd9;
          
          &.is-active {
            background-color: #409eff;
            color: #fff;
          }
          
          &:hover {
            background-color: #409eff;
            color: #fff;
          }
        }
      }
    }
  }
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  
  .collapse-btn {
    margin-right: 20px;
    font-size: 18px;
    color: #666;
    
    &:hover {
      color: #409eff;
    }
  }
  
  .breadcrumb {
    font-size: 14px;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 4px;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #f5f5f5;
    }
    
    .avatar {
      margin-right: 8px;
    }
    
    .username {
      margin-right: 8px;
      font-size: 14px;
      color: #333;
    }
    
    .arrow-down {
      font-size: 12px;
      color: #999;
    }
  }
}

.main-content {
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

// 移动端遮罩层
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

// 响应式设计
@media (max-width: 768px) {
  .user-layout {
    position: relative;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    width: 200px !important;
    transform: translateX(0);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    
    &.mobile-hidden {
      transform: translateX(-100%);
    }
    
    .logo {
      height: 50px;
      font-size: 16px;
      
      img {
        width: 28px;
        height: 28px;
      }
    }
    
    .sidebar-menu {
      :deep(.el-menu-item) {
        height: 45px;
        line-height: 45px;
        font-size: 14px;
      }
      
      :deep(.el-sub-menu) {
        .el-sub-menu__title {
          height: 45px;
          line-height: 45px;
          font-size: 14px;
        }
        
        .el-menu {
          .el-menu-item {
            height: 40px;
            line-height: 40px;
            font-size: 13px;
          }
        }
      }
    }
  }
  
  .main-container {
    width: 100%;
    margin-left: 0;
  }
  
  .header {
    padding: 0 15px;
    height: 50px;
    position: relative;
    z-index: 998;
    
    .header-left {
      .collapse-btn {
        margin-right: 15px;
        font-size: 16px;
      }
      
      .breadcrumb {
        font-size: 13px;
        
        :deep(.el-breadcrumb__item) {
          .el-breadcrumb__inner {
            font-size: 13px;
          }
        }
      }
    }
    
    .header-right {
      gap: 12px;
      
      .user-info {
        padding: 6px 8px;
        
        .username {
          font-size: 13px;
          max-width: 80px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .avatar {
          width: 28px;
          height: 28px;
        }
      }
    }
  }
  
  .main-content {
    padding: 15px 10px;
    width: 100%;
    overflow-x: hidden;
  }
}

// 超小屏幕适配
@media (max-width: 480px) {
  .header {
    .header-left {
      .breadcrumb {
        display: none;
      }
    }
    
    .header-right {
      .user-info {
        .username {
          display: none;
        }
      }
    }
  }
  
  .main-content {
    padding: 10px 8px;
  }
}
</style>