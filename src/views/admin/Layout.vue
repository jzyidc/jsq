<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <img src="/logo.svg" alt="Logo" v-if="!isCollapse" />
        <span v-if="!isCollapse">管理后台</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><Dashboard /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
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
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumbItems.length > 0">
              {{ breadcrumbItems[breadcrumbItems.length - 1] }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
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
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  设置
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessageBox } from 'element-plus'
import { getUserDisplayName, getUserAvatarLetter } from '@/utils/userHelper'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

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
    case '/admin/dashboard':
      items.push('仪表盘')
      break
    case '/admin/users':
      items.push('用户管理')
      break
    case '/admin/settings':
      items.push('系统设置')
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
    case 'settings':
      router.push('/admin/settings')
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
})

// 监听路由变化，自动收起移动端侧边栏
watch(
  () => route.path,
  () => {
    if (window.innerWidth <= 768) {
      isCollapse.value = true
    }
  }
)
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  background-color: #001529;
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
    background-color: #001529;
    
    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.65);
      
      &:hover {
        background-color: #1890ff;
        color: #fff;
      }
      
      &.is-active {
        background-color: #1890ff;
        color: #fff;
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
      color: #1890ff;
    }
  }
  
  .breadcrumb {
    font-size: 14px;
  }
}

.header-right {
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

// 响应式设计
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
  }
  
  .main-container {
    margin-left: 64px;
  }
  
  .header {
    padding: 0 15px;
  }
  
  .main-content {
    padding: 15px;
  }
}
</style>