<template>
  <div class="home-container" :class="{ 'page-loaded': isPageLoaded }">
    <!-- 页面加载动画 -->
    <div class="page-loader" v-if="!isPageLoaded">
      <div class="loader-content">
        <div class="loader-logo">
          <img src="/logo.svg" alt="Logo" />
        </div>
        <div class="loader-text">XXX管理系统</div>
        <div class="loader-progress">
          <div class="progress-bar"></div>
        </div>
      </div>
    </div>
    
    <!-- 粒子背景 -->
    <div class="particles-background parallax-element">
      <div class="particle" v-for="i in 50" :key="i" :style="getParticleStyle(i)"></div>
    </div>
    
    <!-- 装饰性几何图形 -->
    <div class="geometric-decorations">
      <div class="decoration decoration-1"></div>
      <div class="decoration decoration-2"></div>
      <div class="decoration decoration-3"></div>
      <div class="decoration decoration-4"></div>
    </div>
    
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-left">
          <img src="/logo.svg" alt="Logo" class="nav-logo" />
          <span class="nav-title">XXX管理系统</span>
        </div>
        
        <!-- 中间导航菜单 -->
        <div class="nav-center">
          <div class="nav-menu">
            <a href="#" class="nav-item" @click="handleNavClick('download')">
              <el-icon><Download /></el-icon>
              <span>软件下载</span>
            </a>
            <a href="#" class="nav-item" @click="handleNavClick('purchase')">
              <el-icon><ShoppingCart /></el-icon>
              <span>业务购买</span>
            </a>
            <a href="#" class="nav-item" @click="handleNavClick('tutorial')">
              <el-icon><VideoPlay /></el-icon>
              <span>视频教程</span>
            </a>
          </div>
        </div>
        
        <div class="nav-right">
          <!-- 未登录状态 -->
          <template v-if="!userStore.isLoggedIn">
            <el-button text @click="$router.push('/register')">立即注册</el-button>
            <el-button type="primary" @click="$router.push('/login')">登录</el-button>
          </template>
          
          <!-- 已登录状态 -->
          <template v-else>
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-avatar :size="32" :src="userStore.userInfo.avatar">
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
                <span class="username">{{ userStore.userInfo.username || '用户' }}</span>
                <el-icon class="arrow-down"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>
                    个人资料
                  </el-dropdown-item>
                  <el-dropdown-item command="dashboard">
                    <el-icon><DataBoard /></el-icon>
                    {{ userStore.userInfo.role === 'admin' ? '管理后台' : '用户中心' }}
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <el-icon><Lock /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- Hero区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              提供<span class="highlight">原生住宅IP</span><br>
              突破性技术创新
            </h1>
            <div class="hero-features">
              <div class="feature-item">
                <el-icon><Monitor /></el-icon>
                <span>支持多游戏窗口加速</span>
              </div>
              <div class="feature-item">
                <el-icon><Trophy /></el-icon>
                <span>千款游戏极速畅玩</span>
              </div>
              <div class="feature-item">
          <el-icon><Key /></el-icon>
          <span>保证安全-多平台认证</span>
        </div>
            </div>
            <p class="hero-subtitle">全方位为硬核游戏玩家保驾护航</p>
            <div class="hero-actions">
              <!-- 未登录状态 -->
              <template v-if="!userStore.isLoggedIn">
                <el-button type="primary" size="large" class="register-btn" @click="$router.push('/register')">
                  注册免费赠送使用时长
                </el-button>
                <el-button size="large" class="trial-btn" @click="$router.push('/login')">
                  免费体验
                </el-button>
              </template>
              
              <!-- 已登录状态 -->
              <template v-else>
                <el-button type="primary" size="large" class="dashboard-btn" @click="goToDashboard">
                  <el-icon><DataBoard /></el-icon>
                  进入{{ userStore.userInfo.role === 'admin' ? '管理后台' : '用户中心' }}
                </el-button>
                <el-button size="large" class="business-btn" @click="$router.push('/user/business/list')">
                  <el-icon><Monitor /></el-icon>
                  我的业务
                </el-button>
              </template>
            </div>
          </div>
          <div class="hero-image">
            <!-- 主要浮动卡片 -->
            <div class="floating-card main-card">
              <div class="card-header">
                <div class="status-dot"></div>
                <span>独享IP加速模式</span>
              </div>
              <div class="card-content">
                <p>一人独享一个IP地址</p>
                <p>可有效避免锁区，封号</p>
              </div>
            </div>
            
            <!-- 装饰性小卡片 -->
            <div class="floating-card mini-card card-1">
              <div class="mini-icon">
                <el-icon><Lightning /></el-icon>
              </div>
              <span>极速连接</span>
            </div>
            
            <div class="floating-card mini-card card-2">
              <div class="mini-icon">
                <el-icon><Lock /></el-icon>
              </div>
              <span>安全防护</span>
            </div>
            
            <div class="floating-card mini-card card-3">
              <div class="mini-icon">
                <el-icon><Trophy /></el-icon>
              </div>
              <span>顶级体验</span>
            </div>
            
            <!-- 装饰性光环 -->
            <div class="glow-ring ring-1"></div>
            <div class="glow-ring ring-2"></div>
            <div class="glow-ring ring-3"></div>
          </div>
        </div>
      </section>

      <!-- 幻灯片区域 -->
      <section class="carousel-section">
        <div class="carousel-container">
          <div class="section-header">
            <h2>产品亮点</h2>
            <p>体验我们的核心优势与创新技术</p>
          </div>
          
          <div class="carousel-wrapper" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
            <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div class="carousel-slide" v-for="(slide, index) in slides" :key="index">
                <div class="slide-content">
                  <div class="slide-image">
                    <div class="slide-icon">
                      <el-icon><component :is="slide.icon" /></el-icon>
                    </div>
                  </div>
                  <div class="slide-text">
                    <h3>{{ slide.title }}</h3>
                    <p>{{ slide.description }}</p>
                    <div class="slide-features">
                      <div class="feature-tag" v-for="feature in slide.features" :key="feature">
                        {{ feature }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 导航按钮 -->
            <button class="carousel-btn carousel-btn-prev" @click="prevSlide">
              <el-icon><ArrowLeft /></el-icon>
            </button>
            <button class="carousel-btn carousel-btn-next" @click="nextSlide">
              <el-icon><ArrowRight /></el-icon>
            </button>
            
            <!-- 指示器 -->
            <div class="carousel-indicators">
              <button 
                v-for="(slide, index) in slides" 
                :key="index"
                class="indicator"
                :class="{ active: index === currentSlide }"
                @click="goToSlide(index)"
              ></button>
            </div>
          </div>
        </div>
      </section>

      <!-- 优势特色区域 -->
      <section class="advantages-section animate-on-scroll">
        <div class="section-header">
          <h2>我们的优势</h2>
          <p>专线护航 / 延迟更低 / 更稳定</p>
        </div>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="card-icon">
              <el-icon><Connection /></el-icon>
            </div>
            <h3>支持千款游戏</h3>
            <p>支持全平台游戏加速，实时更新热点游戏，千款游戏极速畅玩，新游上线同步支持</p>
          </div>
          <div class="advantage-card">
            <div class="card-icon">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <h3>金融级专线网</h3>
            <p>全程使用金融级内网传输专线，游戏联网光速传输，自研驱动先进技术只为打造极致加速体验</p>
          </div>
          <div class="advantage-card">
            <div class="card-icon">
              <el-icon><Check /></el-icon>
            </div>
            <h3>一号三端通用</h3>
            <p>支持电脑端、移动端、路由插件三端加速。全方位为硬核游戏玩家保驾护航</p>
          </div>
          <div class="advantage-card">
            <div class="card-icon">
              <el-icon><Search /></el-icon>
            </div>
            <h3>原生家庭宽带</h3>
            <p>全网统一规划"N+31+X"三层资源布局架构,满足属地化玩家需求,面向300多个地市按需建设</p>
          </div>
        </div>
      </section>

      <!-- 核心功能区域 -->
      <section class="features-section">
        <div class="features-content">
          <div class="features-text">
            <h2>支持千款游戏</h2>
            <h3>原生住宅独享IP</h3>
            <div class="feature-tags">
              <el-tag type="success">低延迟</el-tag>
              <el-tag type="primary">游戏多开</el-tag>
              <el-tag type="warning">独享IP</el-tag>
            </div>
            <p>采用原生住宅IP技术，为每位用户提供独享的IP地址，有效避免游戏锁区和封号风险，让您畅享游戏乐趣。</p>
          </div>
          <div class="features-visual">
            <div class="game-grid">
              <div class="game-item" v-for="i in 6" :key="i">
                <div class="game-icon"></div>
                <span>游戏 {{ i }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计数据区域 -->
      <section class="stats-section">
        <div class="stats-content">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">支持游戏数量</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">300+</div>
              <div class="stat-label">覆盖地市</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">服务稳定性</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">24/7</div>
              <div class="stat-label">在线客服</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>服务中心</h4>
          <ul>
            <li><a href="#">充值续费</a></li>
            <li><a href="#">网站地图</a></li>
            <li><a href="#">帮助中心</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>关于我们</h4>
          <ul>
            <li><a href="#">用户协议</a></li>
            <li><a href="#">隐私协议</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <p>客服时间：09:00 - 24:00</p>
          <p>客服QQ：800083637</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Copyright © 2020-2023 XXX管理系统. All Rights Reserved.</p>
      </div>
    </footer>

    <!-- 客服悬浮框 -->
    <div class="customer-service-float" :class="{ 'expanded': isServiceExpanded }">
      <div class="service-content" v-if="isServiceExpanded">
        <div class="service-header">
          <h4>在线客服</h4>
          <button class="close-btn" @click="toggleService">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        <div class="service-body">
          <div class="service-options">
            <div class="service-option" @click="contactQQ">
              <div class="option-icon qq-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="option-text">
                <h5>QQ客服</h5>
                <p>800083637</p>
              </div>
            </div>
            <div class="service-option" @click="contactPhone">
              <div class="option-icon phone-icon">
                <el-icon><Phone /></el-icon>
              </div>
              <div class="option-text">
                <h5>电话客服</h5>
                <p>400-123-4567</p>
              </div>
            </div>
            <div class="service-option" @click="openHelp">
              <div class="option-icon help-icon">
                <el-icon><QuestionFilled /></el-icon>
              </div>
              <div class="option-text">
                <h5>帮助中心</h5>
                <p>常见问题解答</p>
              </div>
            </div>
          </div>
          <div class="service-time">
            <p>服务时间：09:00 - 24:00</p>
          </div>
        </div>
      </div>
      <div class="service-trigger" @click="toggleService">
        <el-icon><Service /></el-icon>
        <span v-if="!isServiceExpanded">客服</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  User, Setting, UserFilled, DataBoard, Monitor, Lock,
  Trophy, Key, Connection, VideoPlay, Check, Search, ArrowDown,
  ArrowLeft, ArrowRight, Lightning, Cpu, Service, Close,
  ChatDotRound, Phone, QuestionFilled, Download, ShoppingCart
} from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ref, onMounted, onUnmounted } from 'vue'

const userStore = useUserStore()
const router = useRouter()

// 设置页面标题
document.title = 'XXX管理系统 - 首页'

// 幻灯片相关数据和逻辑
const currentSlide = ref(0)
let autoPlayTimer = null

// 客服悬浮框相关数据
const isServiceExpanded = ref(false)

// 页面加载状态
const isPageLoaded = ref(false)

// 滚动视差效果
const handleScroll = () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll('.parallax-element')
  
  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + (index * 0.1)
    const yPos = -(scrolled * speed)
    element.style.transform = `translateY(${yPos}px)`
  })
}

// 粒子背景样式生成函数
const getParticleStyle = (index) => {
  const size = Math.random() * 4 + 2
  const left = Math.random() * 100
  const animationDelay = Math.random() * 20
  const animationDuration = Math.random() * 10 + 10
  
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}

// 页面加载完成
const handlePageLoad = () => {
  setTimeout(() => {
    isPageLoaded.value = true
  }, 1000)
}

// 幻灯片数据
const slides = ref([
  {
    title: '极速网络加速',
    description: '采用金融级专线网络，为您提供毫秒级响应速度，让游戏体验更加流畅顺滑。',
    icon: Lightning,
    features: ['毫秒级延迟', '99.9%稳定性', '全球节点']
  },
  {
    title: '安全防护体系',
    description: '多重安全防护机制，保护您的游戏账号和个人信息安全，让您安心畅玩。',
    icon: Lock,
    features: ['账号保护', '数据加密', '隐私安全']
  },
  {
    title: '智能优化技术',
    description: '基于AI的智能路由优化，自动选择最佳网络路径，提供极致的游戏体验。',
    icon: Cpu,
    features: ['智能路由', 'AI优化', '自动调节']
  },
  {
    title: '多平台支持',
    description: '支持PC、移动端、路由器等多种设备，一个账号畅享全平台游戏加速服务。',
    icon: Monitor,
    features: ['多设备', '跨平台', '统一管理']
  }
])

// 幻灯片导航方法
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.value.length - 1 : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

// 自动播放功能
const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    nextSlide()
  }, 5000) // 每5秒切换一次
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 生命周期钩子
onMounted(() => {
  startAutoPlay()
  handlePageLoad()
  window.addEventListener('scroll', handleScroll)
  
  // 添加页面进入动画
  const animatedElements = document.querySelectorAll('.animate-on-scroll')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
      }
    })
  }, { threshold: 0.1 })
  
  animatedElements.forEach(el => observer.observe(el))
})

onUnmounted(() => {
  stopAutoPlay()
  window.removeEventListener('scroll', handleScroll)
})

// 进入后台/用户中心
const goToDashboard = () => {
  if (userStore.userInfo.role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/user')
  }
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/user/profile')
      break
    case 'dashboard':
      goToDashboard()
      break
    case 'logout':
      await userStore.logoutAction()
      ElMessage.success('退出登录成功')
      // 刷新页面以更新导航栏状态
      window.location.reload()
      break
  }
}

// 客服悬浮框相关方法
const toggleService = () => {
  isServiceExpanded.value = !isServiceExpanded.value
}

const contactQQ = () => {
  // 打开QQ聊天
  window.open('tencent://message/?uin=800083637&Site=&Menu=yes', '_blank')
  ElMessage.success('正在打开QQ客服')
}

const contactPhone = () => {
  // 复制电话号码到剪贴板
  const phoneNumber = '400-123-4567'
  
  try {
    // 优先使用现代API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        ElMessage.success('电话号码已复制到剪贴板')
      }).catch(() => {
        // 现代API失败时的降级方案
        fallbackCopyPhone(phoneNumber)
      })
    } else {
      // 降级方案：使用传统方法
      fallbackCopyPhone(phoneNumber)
    }
  } catch (error) {
    ElMessage.info('电话号码：400-123-4567')
  }
}

// 降级复制方案
const fallbackCopyPhone = (phoneNumber) => {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = phoneNumber
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('电话号码已复制到剪贴板')
  } catch (error) {
    ElMessage.info('电话号码：400-123-4567')
  }
}

const openHelp = () => {
  // 打开帮助中心（这里可以根据实际情况修改链接）
  window.open('#/help', '_blank')
  ElMessage.success('正在打开帮助中心')
}

// 导航菜单点击处理
const handleNavClick = (type) => {
  switch (type) {
    case 'download':
      // 跳转到软件下载页面
      window.open('/download', '_blank')
      ElMessage.success('正在打开软件下载页面')
      break
    case 'purchase':
      // 跳转到业务购买页面
      if (userStore.isLoggedIn) {
        router.push('/user/business/purchase')
      } else {
        ElMessage.warning('请先登录后再购买业务')
        router.push('/login')
      }
      break
    case 'tutorial':
      // 跳转到视频教程页面
      window.open('/tutorial', '_blank')
      ElMessage.success('正在打开视频教程页面')
      break
  }
}


</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: #0a0e27;
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
}

// 粒子背景
.particles-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  
  .particle {
    position: absolute;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, rgba(102, 126, 234, 0.2) 70%, transparent 100%);
    border-radius: 50%;
    animation: particleFloat linear infinite;
    
    &:nth-child(odd) {
      background: radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.1) 70%, transparent 100%);
    }
    
    &:nth-child(3n) {
      background: radial-gradient(circle, rgba(118, 75, 162, 0.7) 0%, rgba(118, 75, 162, 0.2) 70%, transparent 100%);
    }
  }
}

// 装饰性几何图形
.geometric-decorations {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  
  .decoration {
    position: absolute;
    opacity: 0.1;
    animation: geometricFloat 15s ease-in-out infinite;
    
    &.decoration-1 {
      top: 10%;
      left: 5%;
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, #667eea, transparent);
      border-radius: 20px;
      transform: rotate(45deg);
      animation-delay: 0s;
    }
    
    &.decoration-2 {
      top: 60%;
      right: 10%;
      width: 80px;
      height: 80px;
      border: 3px solid #ffd700;
      border-radius: 50%;
      animation-delay: 5s;
    }
    
    &.decoration-3 {
      bottom: 20%;
      left: 15%;
      width: 0;
      height: 0;
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      border-bottom: 50px solid #764ba2;
      animation-delay: 10s;
    }
    
    &.decoration-4 {
      top: 30%;
      right: 25%;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #ff6b6b, transparent);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      animation-delay: 7s;
    }
  }
}

// 导航栏样式
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(15, 20, 45, 0.95) 50%, rgba(20, 25, 55, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      rgba(102, 126, 234, 0.1) 0%, 
      rgba(118, 75, 162, 0.1) 25%, 
      rgba(255, 215, 0, 0.05) 50%, 
      rgba(118, 75, 162, 0.1) 75%, 
      rgba(102, 126, 234, 0.1) 100%);
    animation: shimmer 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2, #ffd700, #667eea);
    background-size: 200% 100%;
    animation: gradientMove 3s ease-in-out infinite;
  }
  
  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  
  .nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .nav-logo {
      width: 45px;
      height: 45px;
      border-radius: 12px;
      padding: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05) rotate(5deg);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }
    }
    
    .nav-title {
      font-size: 1.6rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea, #764ba2, #ffd700);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: gradientShift 4s ease-in-out infinite;
      text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
    }
  }
  
  .nav-center {
    flex: 1;
    display: flex;
    justify-content: center;
    
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.05);
      padding: 8px;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      
      .nav-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.9);
        text-decoration: none;
        padding: 12px 20px;
        border-radius: 25px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        
        &:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
          color: #ffffff;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          
          &::before {
            left: 100%;
          }
          
          .el-icon {
            transform: scale(1.2) rotate(10deg);
            color: #ffd700;
          }
        }
        
        .el-icon {
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        span {
          white-space: nowrap;
          position: relative;
        }
      }
    }
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .el-button {
      border-radius: 25px;
      padding: 10px 20px;
      font-weight: 500;
      transition: all 0.3s ease;
      
      &[type="primary"] {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        
        &:hover {
          background: linear-gradient(135deg, #5a6fd8, #6a4190);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
      }
      
      &[text] {
        color: rgba(255, 255, 255, 0.9);
        
        &:hover {
          color: #ffd700;
          background: rgba(255, 215, 0, 0.1);
        }
      }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 10px 16px;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        
        .arrow-down {
          transform: rotate(180deg);
          color: #ffd700;
        }
      }
      
      .el-avatar {
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        
        &:hover {
          border-color: #ffd700;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }
      }
      
      .username {
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      
      .arrow-down {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        transition: all 0.3s ease;
      }
    }
  }
}

// 导航栏动画
@keyframes shimmer {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(-100%);
  }
  50% {
    opacity: 0.8;
    transform: translateX(100%);
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// 主要内容区域
.main-content {
  padding-top: 80px;
}

// Hero区域样式
.hero-section {
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
    opacity: 0.3;
  }
  
  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .hero-text {
    .hero-title {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 30px;
      
      .highlight {
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    
    .hero-features {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 30px;
      
      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 1.1rem;
        
        .el-icon {
          font-size: 1.5rem;
          color: #ffd700;
        }
      }
    }
    
    .hero-subtitle {
      font-size: 1.3rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }
    
    .hero-actions {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      
      .register-btn {
        background: linear-gradient(135deg, #ff6b6b, #ee5a24);
        border: none;
        padding: 16px 32px;
        font-size: 1.1rem;
        border-radius: 50px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
        }
      }
      
      .trial-btn {
        background: transparent;
        border: 2px solid #ffffff;
        color: #ffffff;
        padding: 14px 32px;
        font-size: 1.1rem;
        border-radius: 50px;
        transition: all 0.3s ease;
        
        &:hover {
          background: #ffffff;
          color: #667eea;
          transform: translateY(-2px);
        }
      }
      
      .dashboard-btn {
        background: linear-gradient(135deg, #409eff, #67c23a);
        border: none;
        color: #ffffff;
        padding: 16px 32px;
        font-size: 1.1rem;
        border-radius: 50px;
        transition: all 0.3s ease;
        
        &:hover {
          background: linear-gradient(135deg, #337ecc, #529b2e);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(64, 158, 255, 0.4);
        }
      }
      
      .business-btn {
        background: transparent;
        border: 2px solid #ffffff;
        color: #ffffff;
        padding: 14px 32px;
        font-size: 1.1rem;
        border-radius: 50px;
        transition: all 0.3s ease;
        
        &:hover {
          background: #ffffff;
          color: #667eea;
          transform: translateY(-2px);
        }
      }
    }
  }
  
  .hero-image {
    display: flex;
    justify-content: center;
    position: relative;
    
    .floating-card {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      
      &.main-card {
        padding: 30px;
        animation: float 6s ease-in-out infinite;
        z-index: 10;
        position: relative;
        
        &:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          
          .status-dot {
            width: 12px;
            height: 12px;
            background: #00ff88;
            border-radius: 50%;
            animation: pulse 2s infinite;
            box-shadow: 0 0 10px #00ff88;
          }
          
          span {
            font-weight: 600;
            font-size: 1.1rem;
          }
        }
        
        .card-content {
          p {
            margin: 8px 0;
            opacity: 0.9;
          }
        }
      }
      
      &.mini-card {
        position: absolute;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        
        &:hover {
          transform: translateY(-3px) scale(1.05);
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
        }
        
        .mini-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          
          .el-icon {
            font-size: 16px;
            color: #ffffff;
          }
        }
        
        &.card-1 {
          top: -20px;
          left: -80px;
          animation: float 6s ease-in-out infinite 1s;
          
          .mini-icon {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            
            .el-icon {
              color: #333;
            }
          }
        }
        
        &.card-2 {
          top: 50%;
          right: -100px;
          animation: float 6s ease-in-out infinite 2s;
          
          .mini-icon {
            background: linear-gradient(135deg, #67c23a, #85ce61);
          }
        }
        
        &.card-3 {
          bottom: -30px;
          left: -60px;
          animation: float 6s ease-in-out infinite 3s;
          
          .mini-icon {
            background: linear-gradient(135deg, #e6a23c, #f0a020);
          }
        }
      }
    }
    
    .glow-ring {
      position: absolute;
      border-radius: 50%;
      border: 2px solid;
      animation: ringPulse 4s ease-in-out infinite;
      
      &.ring-1 {
        width: 200px;
        height: 200px;
        border-color: rgba(102, 126, 234, 0.3);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: 0s;
      }
      
      &.ring-2 {
        width: 300px;
        height: 300px;
        border-color: rgba(255, 215, 0, 0.2);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: 1.5s;
      }
      
      &.ring-3 {
        width: 400px;
        height: 400px;
        border-color: rgba(118, 75, 162, 0.2);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: 3s;
      }
    }
  }
}

// 幻灯片区域
.carousel-section {
  padding: 100px 20px;
  background: #0f1419;
  
  .carousel-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 60px;
    
    h2 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: 1.3rem;
      opacity: 0.8;
    }
  }
  
  .carousel-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .carousel-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }
  
  .carousel-slide {
    min-width: 100%;
    padding: 60px 40px;
  }
  
  .slide-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 60px;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
  }
  
  .slide-image {
    display: flex;
    justify-content: center;
    
    .slide-icon {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: float 6s ease-in-out infinite;
      
      .el-icon {
        font-size: 4rem;
        color: #ffffff;
      }
    }
  }
  
  .slide-text {
    h3 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #ffffff;
    }
    
    p {
      font-size: 1.2rem;
      line-height: 1.8;
      opacity: 0.9;
      margin-bottom: 30px;
    }
    
    .slide-features {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      
      .feature-tag {
        background: rgba(102, 126, 234, 0.2);
        color: #667eea;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        border: 1px solid rgba(102, 126, 234, 0.3);
      }
    }
  }
  
  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.5);
      transform: translateY(-50%) scale(1.1);
    }
    
    .el-icon {
      font-size: 1.5rem;
    }
    
    &.carousel-btn-prev {
      left: 20px;
    }
    
    &.carousel-btn-next {
      right: 20px;
    }
  }
  
  .carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    
    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        background: #667eea;
        transform: scale(1.2);
      }
      
      &:hover {
        background: rgba(102, 126, 234, 0.7);
      }
    }
  }
}

// 优势特色区域
.advantages-section {
  padding: 100px 20px;
  background: #0f1419;
  
  .section-header {
    text-align: center;
    margin-bottom: 80px;
    
    h2 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      font-size: 1.3rem;
      opacity: 0.8;
    }
  }
  
  .advantages-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 40px;
  }
  
  .advantage-card {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border-radius: 20px;
    padding: 40px 30px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }
    
    &:hover {
      transform: translateY(-15px) scale(1.02);
      box-shadow: 0 25px 50px rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.5);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
      
      &::before {
        left: 100%;
      }
      
      .card-icon {
        transform: scale(1.1) rotate(10deg);
        animation: glowPulse 2s ease-in-out infinite;
      }
      
      h3 {
        color: #ffd700;
      }
    }
    
    .card-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 30px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #667eea, #764ba2, #ffd700, #667eea);
        border-radius: 50%;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover::after {
        opacity: 1;
        animation: shimmerWave 2s linear infinite;
      }
      
      .el-icon {
        font-size: 2.5rem;
        color: #ffffff;
        transition: all 0.3s ease;
      }
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 20px;
      color: #ffffff;
    }
    
    p {
      opacity: 0.8;
      line-height: 1.6;
    }
  }
}

// 核心功能区域
.features-section {
  padding: 100px 20px;
  background: #0a0e27;
  
  .features-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  
  .features-text {
    h2 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
      color: #ffffff;
    }
    
    h3 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 30px;
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .feature-tags {
      margin-bottom: 30px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    p {
      font-size: 1.1rem;
      line-height: 1.8;
      opacity: 0.9;
    }
  }
  
  .features-visual {
    .game-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    
    .game-item {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(102, 126, 234, 0.1);
        border-color: rgba(102, 126, 234, 0.3);
      }
      
      .game-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 8px;
        margin: 0 auto 12px;
      }
      
      span {
        font-size: 0.9rem;
        opacity: 0.8;
      }
    }
  }
}

// 统计数据区域
.stats-section {
  padding: 100px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="stats-grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23stats-grain)"/></svg>') repeat;
    opacity: 0.3;
  }
  
  .stats-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 60px;
    text-align: center;
  }
  
  .stat-item {
    position: relative;
    padding: 30px 20px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s ease;
    
    &:hover {
      transform: translateY(-10px) scale(1.05);
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      
      .stat-number {
        animation: numberPulse 0.6s ease;
      }
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2, #ffd700);
      border-radius: 15px 15px 0 0;
    }
    
    .stat-number {
      font-size: 4rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      transition: all 0.3s ease;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;
        height: 2px;
        background: linear-gradient(90deg, #667eea, #ffd700);
        border-radius: 1px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
    }
    
    &:hover .stat-number::after {
      opacity: 1;
    }
    
    .stat-label {
      font-size: 1.3rem;
      color: #ffffff;
      opacity: 0.9;
      font-weight: 500;
      position: relative;
    }
  }
}

// 页脚样式
.footer {
  background: #050812;
  padding: 60px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
  }
  
  .footer-section {
    h4 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 20px;
      color: #ffffff;
    }
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        margin-bottom: 12px;
        
        a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
          
          &:hover {
            color: #667eea;
          }
        }
      }
    }
    
    p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 8px;
    }
  }
  
  .footer-bottom {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    
    p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.9rem;
    }
  }
}

// 动画效果
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
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes geometricFloat {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.1;
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.2;
  }
  75% {
    transform: translateY(-30px) rotate(270deg);
    opacity: 0.4;
  }
}

@keyframes ringPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.1;
  }
}

@keyframes shimmerWave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes glowPulse {
   0%, 100% {
     box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
   }
   50% {
     box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(102, 126, 234, 0.6);
   }
 }
 
 @keyframes numberPulse {
   0% {
     transform: scale(1);
   }
   50% {
     transform: scale(1.1);
   }
   100% {
     transform: scale(1);
   }
 }
 
 @keyframes slideInUp {
   from {
     opacity: 0;
     transform: translateY(30px);
   }
   to {
     opacity: 1;
     transform: translateY(0);
   }
 }
 
 @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes progressLoad {
    0% {
      width: 0%;
    }
    50% {
      width: 70%;
    }
    100% {
      width: 100%;
    }
  }
  
  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

// 响应式设计
@media (max-width: 768px) {
  .navbar {
    .nav-content {
      padding: 0 15px;
      flex-wrap: wrap;
      height: auto;
      min-height: 70px;
    }
    
    .nav-title {
      font-size: 1.2rem !important;
    }
    
    .nav-center {
      order: 3;
      width: 100%;
      margin-top: 10px;
      
      .nav-menu {
        gap: 20px;
        justify-content: center;
        
        .nav-item {
          padding: 6px 12px;
          font-size: 13px;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
    }
    
    .nav-right {
      gap: 12px;
    }
  }
  
  .hero-section {
    padding: 60px 15px;
    
    .hero-content {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }
    
    .hero-title {
      font-size: 2.5rem !important;
    }
    
    .hero-actions {
      justify-content: center;
      
      .el-button {
        width: 100%;
        max-width: 280px;
      }
    }
  }
  
  .advantages-section {
    padding: 60px 15px;
    
    .section-header h2 {
      font-size: 2rem !important;
    }
    
    .advantages-grid {
      grid-template-columns: 1fr;
    }
  }
  
  .features-section {
    padding: 60px 15px;
    
    .features-content {
      grid-template-columns: 1fr;
      gap: 40px;
      text-align: center;
    }
    
    .features-text h2 {
      font-size: 2rem !important;
    }
    
    .features-text h3 {
      font-size: 1.5rem !important;
    }
  }
  
  .stats-section {
    padding: 60px 15px;
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
    
    .stat-item {
      .stat-number {
        font-size: 2.5rem !important;
      }
      
      .stat-label {
        font-size: 1rem !important;
      }
    }
  }
  
  .carousel-section {
    padding: 60px 15px;
    
    .section-header h2 {
      font-size: 2rem !important;
    }
    
    .carousel-slide {
      padding: 40px 20px;
    }
    
    .slide-content {
      grid-template-columns: 1fr;
      gap: 30px;
      text-align: center;
    }
    
    .slide-text {
      h3 {
        font-size: 1.8rem !important;
      }
      
      p {
        font-size: 1rem !important;
      }
    }
    
    .slide-image .slide-icon {
      width: 80px;
      height: 80px;
      
      .el-icon {
        font-size: 2.5rem !important;
      }
    }
    
    .carousel-btn {
      width: 40px;
      height: 40px;
      
      .el-icon {
        font-size: 1.2rem !important;
      }
      
      &.carousel-btn-prev {
        left: 10px;
      }
      
      &.carousel-btn-next {
        right: 10px;
      }
    }
  }
  
  .footer {
    padding: 40px 15px 20px;
    
    .footer-content {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
}

// 客服悬浮框样式
.customer-service-float {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  transition: all 0.3s ease;
  
  .service-content {
    position: absolute;
    bottom: 70px;
    right: 0;
    width: 320px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: slideUp 0.3s ease;
    
    .service-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: #ffffff;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .close-btn {
        background: none;
        border: none;
        color: #ffffff;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .el-icon {
          font-size: 16px;
        }
      }
    }
    
    .service-body {
      padding: 20px;
      
      .service-options {
        .service-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          
          &:hover {
            background: #f5f7fa;
            transform: translateX(4px);
          }
          
          .option-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .el-icon {
              font-size: 20px;
              color: #ffffff;
            }
            
            &.qq-icon {
              background: linear-gradient(135deg, #12b7f5, #0099ff);
            }
            
            &.phone-icon {
              background: linear-gradient(135deg, #67c23a, #85ce61);
            }
            
            &.help-icon {
              background: linear-gradient(135deg, #e6a23c, #f0a020);
            }
          }
          
          .option-text {
            flex: 1;
            
            h5 {
              margin: 0 0 4px 0;
              font-size: 14px;
              font-weight: 600;
              color: #303133;
            }
            
            p {
              margin: 0;
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
      
      .service-time {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #ebeef5;
        text-align: center;
        
        p {
          margin: 0;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
  
  .service-trigger {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;
    color: #ffffff;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }
    
    .el-icon {
      font-size: 24px;
      margin-bottom: 2px;
    }
    
    span {
      font-size: 10px;
      font-weight: 500;
    }
  }
  
  &.expanded {
    .service-trigger {
      background: linear-gradient(135deg, #f56c6c, #e6a23c);
      
      .el-icon {
        transform: rotate(45deg);
      }
    }
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 客服悬浮框响应式设计
@media (max-width: 768px) {
  .customer-service-float {
    bottom: 20px;
    right: 20px;
    
    .service-content {
      width: 280px;
      bottom: 65px;
    }
    
    .service-trigger {
      width: 50px;
      height: 50px;
      
      .el-icon {
        font-size: 20px;
      }
      
      span {
        font-size: 9px;
      }
    }
  }
}
</style>