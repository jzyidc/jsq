<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-content">
        <!-- 错误图标 -->
        <div class="error-icon">
          <svg viewBox="0 0 200 200" class="error-svg">
            <!-- 盾牌背景 -->
            <path 
              d="M100 20 L160 40 L160 100 Q160 140 100 180 Q40 140 40 100 L40 40 Z" 
              fill="#ff6b6b" 
              opacity="0.1"
            />
            <!-- 盾牌边框 -->
            <path 
              d="M100 20 L160 40 L160 100 Q160 140 100 180 Q40 140 40 100 L40 40 Z" 
              fill="none" 
              stroke="#ff6b6b" 
              stroke-width="3"
            />
            <!-- 禁止符号 -->
            <circle cx="100" cy="100" r="35" fill="none" stroke="#ff6b6b" stroke-width="4" />
            <line x1="75" y1="75" x2="125" y2="125" stroke="#ff6b6b" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        
        <!-- 错误信息 -->
        <div class="error-info">
          <h1 class="error-code">403</h1>
          <h2 class="error-title">访问被拒绝</h2>
          <p class="error-description">
            抱歉，您没有权限访问此页面。请联系管理员获取相应权限，或返回到您有权限访问的页面。
          </p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="error-actions">
          <el-button type="primary" @click="goBack" size="large">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
          <el-button @click="goHome" size="large">
            <el-icon><HomeFilled /></el-icon>
            回到首页
          </el-button>
          <el-button type="info" @click="contactAdmin" size="large">
            <el-icon><Service /></el-icon>
            联系管理员
          </el-button>
        </div>
        
        <!-- 建议操作 -->
        <div class="error-suggestions">
          <h3>您可以尝试：</h3>
          <ul>
            <li>检查您的账户权限设置</li>
            <li>联系系统管理员申请相应权限</li>
            <li>确认您已正确登录账户</li>
            <li>返回到您有权限访问的页面</li>
          </ul>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="decoration">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

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

// 联系管理员
const contactAdmin = () => {
  ElMessage.info('请通过邮箱 admin@example.com 联系管理员')
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 600px;
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
    width: 120px;
    height: 120px;
    animation: float 3s ease-in-out infinite;
  }
}

.error-info {
  margin-bottom: 40px;
  
  .error-code {
    font-size: 72px;
    font-weight: 700;
    color: #ff6b6b;
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

.error-suggestions {
  text-align: left;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #ff6b6b;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
    
    li {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
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
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
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
      width: 100px;
      height: 100px;
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
  
  .error-actions {
    flex-direction: column;
    align-items: center;
    
    .el-button {
      width: 100%;
      max-width: 280px;
    }
  }
  
  .error-suggestions {
    padding: 20px;
    
    h3 {
      font-size: 16px;
    }
    
    ul li {
      font-size: 13px;
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
}
</style>