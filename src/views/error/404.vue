<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <!-- 错误图标 -->
        <div class="error-icon">
          <svg viewBox="0 0 200 200" class="error-svg">
            <!-- 404数字背景 -->
            <text x="100" y="80" text-anchor="middle" class="error-number-bg">404</text>
            <!-- 404数字前景 -->
            <text x="100" y="80" text-anchor="middle" class="error-number">404</text>
            <!-- 搜索图标 -->
            <circle cx="140" cy="120" r="15" fill="none" stroke="#409eff" stroke-width="3" />
            <line x1="152" y1="132" x2="165" y2="145" stroke="#409eff" stroke-width="3" stroke-linecap="round" />
            <!-- 问号 -->
            <circle cx="60" cy="130" r="20" fill="none" stroke="#e6a23c" stroke-width="3" />
            <path d="M52 125 Q60 115 68 125 Q60 135 60 140" fill="none" stroke="#e6a23c" stroke-width="3" stroke-linecap="round" />
            <circle cx="60" cy="148" r="2" fill="#e6a23c" />
          </svg>
        </div>
        
        <!-- 错误信息 -->
        <div class="error-info">
          <h1 class="error-code">404</h1>
          <h2 class="error-title">页面未找到</h2>
          <p class="error-description">
            抱歉，您访问的页面不存在。可能是页面地址错误，或者页面已被移动或删除。
          </p>
        </div>
        
        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索您要找的内容..."
            size="large"
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch" :loading="searching">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" @click="goHome" size="large">
            <el-icon><HomeFilled /></el-icon>
            回到首页
          </el-button>
          <el-button @click="goBack" size="large">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
          <el-button type="info" @click="reportProblem" size="large">
            <el-icon><Warning /></el-icon>
            报告问题
          </el-button>
        </div>
        
        <!-- 快速链接 -->
        <div class="quick-links">
          <h3>您可能在寻找：</h3>
          <div class="links-grid">
            <div class="link-item" @click="navigateTo('/login')">
              <el-icon><User /></el-icon>
              <span>用户登录</span>
            </div>
            <div class="link-item" @click="navigateTo('/register')">
              <el-icon><UserFilled /></el-icon>
              <span>用户注册</span>
            </div>
            <div class="link-item" @click="navigateTo('/admin')">
              <el-icon><Setting /></el-icon>
              <span>管理后台</span>
            </div>
            <div class="link-item" @click="navigateTo('/user')">
              <el-icon><Avatar /></el-icon>
              <span>用户中心</span>
            </div>
          </div>
        </div>
        
        <!-- 帮助信息 -->
        <div class="help-section">
          <h3>常见问题：</h3>
          <div class="help-list">
            <div class="help-item">
              <el-icon><QuestionFilled /></el-icon>
              <div class="help-content">
                <div class="help-title">链接地址错误</div>
                <div class="help-desc">请检查URL地址是否正确</div>
              </div>
            </div>
            <div class="help-item">
              <el-icon><QuestionFilled /></el-icon>
              <div class="help-content">
                <div class="help-title">页面已移动</div>
                <div class="help-desc">页面可能已经移动到新位置</div>
              </div>
            </div>
            <div class="help-item">
              <el-icon><QuestionFilled /></el-icon>
              <div class="help-content">
                <div class="help-title">权限不足</div>
                <div class="help-desc">您可能没有访问该页面的权限</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
        <div class="floating-shape shape-5"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')
const searching = ref(false)

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

// 回到首页
const goHome = () => {
  router.push('/')
}

// 搜索功能
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  searching.value = true
  try {
    // 模拟搜索
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.info(`搜索"${searchKeyword.value}"的功能开发中...`)
  } finally {
    searching.value = false
  }
}

// 导航到指定页面
const navigateTo = (path) => {
  router.push(path)
}

// 报告问题
const reportProblem = () => {
  ElMessage.info('问题报告功能开发中，请联系技术支持')
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 700px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.error-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-icon {
  margin-bottom: 30px;
  
  .error-svg {
    width: 150px;
    height: 150px;
    animation: float 3s ease-in-out infinite;
    
    .error-number-bg {
      font-size: 36px;
      font-weight: 700;
      fill: rgba(64, 158, 255, 0.1);
      font-family: 'Arial', sans-serif;
    }
    
    .error-number {
      font-size: 36px;
      font-weight: 700;
      fill: #409eff;
      font-family: 'Arial', sans-serif;
    }
  }
}

.error-info {
  margin-bottom: 30px;
  
  .error-code {
    font-size: 72px;
    font-weight: 700;
    color: #409eff;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    animation: pulse 2s ease-in-out infinite;
  }
  
  .error-title {
    font-size: 28px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
  }
  
  .error-description {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.search-section {
  margin-bottom: 30px;
  
  .search-input {
    max-width: 400px;
    
    :deep(.el-input__wrapper) {
      border-radius: 25px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    :deep(.el-input-group__append) {
      border-radius: 0 25px 25px 0;
      
      .el-button {
        border-radius: 0 25px 25px 0;
      }
    }
  }
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  
  .el-button {
    min-width: 120px;
    height: 44px;
    border-radius: 22px;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
  }
}

.quick-links {
  margin-bottom: 40px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 20px 0;
  }
  
  .links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
    
    .link-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 16px;
      background: #f8f9fa;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      border: 2px solid transparent;
      
      &:hover {
        background: #e3f2fd;
        border-color: #409eff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }
      
      .el-icon {
        font-size: 24px;
        color: #409eff;
      }
      
      span {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
    }
  }
}

.help-section {
  text-align: left;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #409eff;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
    text-align: center;
  }
  
  .help-list {
    .help-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .el-icon {
        color: #409eff;
        font-size: 18px;
        margin-top: 2px;
        flex-shrink: 0;
      }
      
      .help-content {
        .help-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }
        
        .help-desc {
          font-size: 13px;
          color: #666;
          line-height: 1.4;
        }
      }
    }
  }
}

.decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
  
  &.shape-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }
  
  &.shape-2 {
    width: 60px;
    height: 60px;
    top: 20%;
    right: 15%;
    animation-delay: 1s;
  }
  
  &.shape-3 {
    width: 100px;
    height: 100px;
    bottom: 15%;
    left: 15%;
    animation-delay: 2s;
  }
  
  &.shape-4 {
    width: 40px;
    height: 40px;
    bottom: 25%;
    right: 10%;
    animation-delay: 3s;
  }
  
  &.shape-5 {
    width: 70px;
    height: 70px;
    top: 50%;
    left: 5%;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 768px) {
  .error-page {
    padding: 20px 16px;
  }
  
  .error-content {
    padding: 40px 24px;
  }
  
  .error-icon {
    .error-svg {
      width: 120px;
      height: 120px;
    }
  }
  
  .error-info {
    .error-code {
      font-size: 56px;
    }
    
    .error-title {
      font-size: 24px;
    }
    
    .error-description {
      font-size: 14px;
    }
  }
  
  .search-section {
    .search-input {
      max-width: 100%;
    }
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    
    .el-button {
      width: 100%;
      max-width: 280px;
    }
  }
  
  .quick-links {
    .links-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      
      .link-item {
        padding: 16px 12px;
        
        .el-icon {
          font-size: 20px;
        }
        
        span {
          font-size: 12px;
        }
      }
    }
  }
  
  .help-section {
    padding: 20px;
    
    h3 {
      font-size: 16px;
    }
    
    .help-list {
      .help-item {
        .help-content {
          .help-title {
            font-size: 13px;
          }
          
          .help-desc {
            font-size: 12px;
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 30px 20px;
  }
  
  .error-info {
    .error-code {
      font-size: 48px;
    }
    
    .error-title {
      font-size: 20px;
    }
  }
  
  .quick-links {
    .links-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>