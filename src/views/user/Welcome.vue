<template>
  <div class="welcome-container">
    <div class="welcome-header">
      <div class="avatar-section">
        <el-avatar 
          :size="80" 
          :src="getDefaultAvatar" 
          icon="User" 
        />
        <div class="user-info">
          <h2>欢迎回来，{{ getUserDisplayName(userStore.userInfo) }}！</h2>
          <p class="welcome-text">{{ userStore.userInfo.agent || '很高兴再次见到您' }}</p>
          <div class="user-details">
            <el-tag v-if="userStore.userInfo.phone" type="info" size="small">
              <el-icon><Phone /></el-icon>
              {{ userStore.userInfo.phone }}
            </el-tag>
            <el-tag v-if="userStore.userInfo.createTime" type="success" size="small">
              <el-icon><Calendar /></el-icon>
              注册于 {{ formatDate(userStore.userInfo.createTime) }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#67C23A"><Money /></el-icon>
              <div class="stat-content">
                <div class="stat-number">¥{{ formatBalance(userStore.userInfo.balance) }}</div>
                <div class="stat-label">账户余额</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#409EFF"><Monitor /></el-icon>
              <div class="stat-content">
                <div class="stat-number">{{ userStore.userInfo.nodeInfo?.total_num || 0 }}</div>
                <div class="stat-label">节点数量</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#E6A23C"><Warning /></el-icon>
              <div class="stat-content">
                <div class="stat-number">{{ userStore.userInfo.nodeInfo?.pause_num || 0 }}</div>
                <div class="stat-label">暂停节点数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#F56C6C"><Warning /></el-icon>
              <div class="stat-content">
                <div class="stat-number">{{ userStore.userInfo.nodeInfo?.expire_7_num || 0 }}</div>
                <div class="stat-label">7天到期节点数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
          <el-card class="stat-card">
            <div class="stat-item">
              <el-icon class="stat-icon" color="#909399"><Warning /></el-icon>
              <div class="stat-content">
                <div class="stat-number">{{ userStore.userInfo.nodeInfo?.expire_end_num || 0 }}</div>
                <div class="stat-label">已过期节点数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="quick-actions">
      <h3>快速操作</h3>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="action-card" @click="$router.push('/user/profile')">
            <div class="action-item">
              <el-icon class="action-icon"><Setting /></el-icon>
              <div class="action-content">
                <div class="action-title">个人资料</div>
                <div class="action-desc">查看和编辑个人信息</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="action-card" @click="$router.push('/user/logs')">
            <div class="action-item">
              <el-icon class="action-icon"><Document /></el-icon>
              <div class="action-content">
                <div class="action-title">操作日志</div>
                <div class="action-desc">查看账户操作记录</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="action-card" @click="$router.push('/user/products/routes')">
            <div class="action-item">
              <el-icon class="action-icon"><ShoppingCart /></el-icon>
              <div class="action-content">
                <div class="action-title">订购业务</div>
                <div class="action-desc">项目线路订购服务</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="action-card" @click="$router.push('/user/business/list')">
            <div class="action-item">
              <el-icon class="action-icon"><List /></el-icon>
              <div class="action-content">
                <div class="action-title">业务列表</div>
                <div class="action-desc">查看已订购的业务</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="action-card" @click="$router.push('/user/recharge')">
            <div class="action-item">
              <el-icon class="action-icon"><CreditCard /></el-icon>
              <div class="action-content">
                <div class="action-title">财务管理</div>
                <div class="action-desc">账户充值和财务记录</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <el-card class="action-card" @click="$router.push('/user/orders')">
            <div class="action-item">
              <el-icon class="action-icon"><Tickets /></el-icon>
              <div class="action-content">
                <div class="action-title">订单列表</div>
                <div class="action-desc">查看所有订单记录</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 代理推广栏目 -->
    <div class="referral-section">
      <h3>代理推广</h3>
      <el-row :gutter="20">
        <!-- 上级推荐人信息 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="referrer-card">
            <template #header>
              <div class="card-header">
                <el-icon class="header-icon"><UserFilled /></el-icon>
                <span>上级推荐人</span>
              </div>
            </template>
            <div class="referrer-info">
              <div class="info-item" v-if="userStore.userInfo.referrerInfo?.referrer_phone">
                <el-icon class="info-icon"><Phone /></el-icon>
                <span class="info-label">手机号：</span>
                <span class="info-value">{{ userStore.userInfo.referrerInfo.referrer_phone }}</span>
              </div>
              <div class="info-item" v-if="userStore.userInfo.referrerInfo?.referrer_qq">
                <el-icon class="info-icon"><ChatDotRound /></el-icon>
                <span class="info-label">QQ：</span>
                <span class="info-value">{{ userStore.userInfo.referrerInfo.referrer_qq }}</span>
              </div>
              <div class="info-item" v-if="userStore.userInfo.referrerInfo?.referrer_wx">
                <el-icon class="info-icon"><ChatLineRound /></el-icon>
                <span class="info-label">微信：</span>
                <span class="info-value">{{ userStore.userInfo.referrerInfo.referrer_wx }}</span>
              </div>
              <div class="no-referrer" v-if="!userStore.userInfo.referrerInfo?.referrer_phone && !userStore.userInfo.referrerInfo?.referrer_qq && !userStore.userInfo.referrerInfo?.referrer_wx">
                <el-icon class="empty-icon"><InfoFilled /></el-icon>
                <span>暂无上级推荐人信息</span>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 我的推广数据 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-card class="promotion-card">
            <template #header>
              <div class="card-header">
                <el-icon class="header-icon"><TrendCharts /></el-icon>
                <span>我的推广</span>
              </div>
            </template>
            <div class="promotion-stats">
              <el-row :gutter="16">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <div class="stat-box">
                    <div class="stat-number">{{ userStore.userInfo.myUserInfo?.today_num || 0 }}</div>
                    <div class="stat-label">今天注册数</div>
                  </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <div class="stat-box">
                    <div class="stat-number">{{ userStore.userInfo.myUserInfo?.month_num || 0 }}</div>
                    <div class="stat-label">本月注册数</div>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="16" style="margin-top: 15px;">
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <div class="stat-box">
                    <div class="stat-number">{{ userStore.userInfo.myUserInfo?.year_num || 0 }}</div>
                    <div class="stat-label">本年注册数</div>
                  </div>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                  <div class="stat-box">
                    <div class="stat-number">{{ userStore.userInfo.myUserInfo?.total_num || 0 }}</div>
                    <div class="stat-label">总注册数</div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>



    <!-- 公告弹窗 -->
    <el-dialog
      v-model="showNoticeDialog"
      title="系统公告"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div v-if="currentNotice" class="notice-content">
        <div class="notice-header">
          <h3 class="notice-title">{{ currentNotice.title }}</h3>
          <div class="notice-time">
            <el-icon><Calendar /></el-icon>
            {{ currentNotice.create_time }}
          </div>
        </div>
        <div class="notice-body">
          <p class="notice-text">{{ currentNotice.content }}</p>
        </div>
      </div>
      
      <template #footer>
        <div class="notice-footer">
          <div class="notice-pagination" v-if="userStore.noticeList.length > 1">
            <el-button 
              :disabled="currentNoticeIndex === 0" 
              @click="prevNotice"
              size="small"
            >
              上一条
            </el-button>
            <span class="pagination-info">
              {{ currentNoticeIndex + 1 }} / {{ userStore.noticeList.length }}
            </span>
            <el-button 
              :disabled="currentNoticeIndex === userStore.noticeList.length - 1" 
              @click="nextNotice"
              size="small"
            >
              下一条
            </el-button>
          </div>
          <el-button type="primary" @click="closeNotice">
            <el-icon><Close /></el-icon>
            我知道了
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { getUserDisplayName, formatBalance } from '@/utils/userHelper'
import {
  User,
  Calendar,
  Bell,
  Star,
  Setting,
  Lock,
  Document,
  Money,
  Monitor,
  Warning,
  Phone,
  Close,
  ShoppingCart,
  List,
  CreditCard,
  Tickets,
  UserFilled,
  ChatDotRound,
  ChatLineRound,
  InfoFilled,
  TrendCharts
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

// 公告弹窗相关
const showNoticeDialog = ref(false)
const currentNotice = ref(null)
const currentNoticeIndex = ref(0)

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

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  
  // 如果是字符串，转换为Date对象
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // 检查是否是有效的日期
  if (isNaN(dateObj.getTime())) return ''
  
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 显示公告弹窗
const showNotice = async () => {
  const result = await userStore.getNoticeAction()
  if (result.success && result.data && result.data.length > 0) {
    currentNoticeIndex.value = 0
    currentNotice.value = result.data[0]
    showNoticeDialog.value = true
  }
}

// 下一条公告
const nextNotice = () => {
  if (currentNoticeIndex.value < userStore.noticeList.length - 1) {
    currentNoticeIndex.value++
    currentNotice.value = userStore.noticeList[currentNoticeIndex.value]
  }
}

// 上一条公告
const prevNotice = () => {
  if (currentNoticeIndex.value > 0) {
    currentNoticeIndex.value--
    currentNotice.value = userStore.noticeList[currentNoticeIndex.value]
  }
}

// 关闭公告弹窗
const closeNotice = () => {
  showNoticeDialog.value = false
  userStore.resetFirstLogin()
}

// 监听首次登录状态
watch(() => userStore.isFirstLogin, (newVal) => {
  if (newVal) {
    // 延迟显示公告，确保页面已加载完成
    setTimeout(() => {
      showNotice()
    }, 1000)
  }
})

// 组件挂载时检查是否需要显示公告
onMounted(() => {
  if (userStore.isFirstLogin) {
    showNotice()
  }
})
</script>

<style lang="scss" scoped>
.welcome-container {
  padding: 8px 15px;
  margin: 0 auto;
}

.welcome-header {
  margin-bottom: 30px;
  
  .avatar-section {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
    
    .user-info {
      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
      }
      
      .welcome-text {
        margin: 0 0 12px 0;
        opacity: 0.9;
        font-size: 16px;
      }
      
      .user-details {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        
        .el-tag {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          
          .el-icon {
            margin-right: 4px;
          }
        }
      }
    }
  }
}

.stats-section {
  margin-bottom: 30px;
  
  .stat-card {
    .stat-item {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .stat-icon {
        font-size: 32px;
      }
      
      .stat-content {
        .stat-number {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}

.quick-actions {
  margin-bottom: 30px;
  
  h3 {
    margin-bottom: 20px;
    color: #303133;
    font-size: 18px;
  }
  
  .action-card {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .action-item {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .action-icon {
        font-size: 28px;
        color: #409EFF;
      }
      
      .action-content {
        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }
        
        .action-desc {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}

.referral-section {
  margin-bottom: 30px;
  
  h3 {
    margin-bottom: 20px;
    color: #303133;
    font-size: 18px;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #303133;
    
    .header-icon {
      font-size: 18px;
      color: #409EFF;
    }
  }
  
  .referrer-card {
    .referrer-info {
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding: 8px 0;
        
        .info-icon {
          font-size: 16px;
          color: #409EFF;
          min-width: 16px;
        }
        
        .info-label {
          font-weight: 500;
          color: #606266;
          min-width: 60px;
        }
        
        .info-value {
          color: #303133;
          font-weight: 600;
        }
      }
      
      .no-referrer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 20px;
        color: #909399;
        font-size: 14px;
        
        .empty-icon {
          font-size: 18px;
        }
      }
    }
  }
  
  .promotion-card {
    .promotion-stats {
      .stat-box {
        text-align: center;
        padding: 15px 10px;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        border-radius: 8px;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #409EFF;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #606266;
          font-weight: 500;
        }
      }
    }
  }
}



// 公告弹窗样式
.notice-content {
  .notice-header {
    text-align: center;
    margin-bottom: 20px;
    
    .notice-title {
      font-size: 20px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 10px 0;
    }
    
    .notice-time {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      color: #909399;
      font-size: 14px;
    }
  }
  
  .notice-body {
    .notice-text {
      font-size: 16px;
      line-height: 1.6;
      color: #606266;
      margin: 0;
      text-align: left;
      white-space: pre-wrap;
    }
  }
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .notice-pagination {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .pagination-info {
      font-size: 14px;
      color: #909399;
      min-width: 60px;
      text-align: center;
    }
  }
}

@media (max-width: 768px) {
  .welcome-container {
    padding: 6px 10px;
  }
  
  .welcome-header {
    margin-bottom: 20px;
    
    .avatar-section {
      flex-direction: column;
      text-align: center;
      gap: 15px;
      padding: 20px 15px;
      
      .user-info {
        h2 {
          font-size: 20px;
        }
        
        .welcome-text {
          font-size: 14px;
        }
        
        .user-details {
          justify-content: center;
          
          .el-tag {
            font-size: 12px;
          }
        }
      }
    }
  }
  
  .stats-section {
    margin-bottom: 20px;
    
    .el-row {
      margin: 0 -5px !important;
      
      .el-col {
        padding: 0 5px;
        margin-bottom: 10px;
        
        &:nth-child(n+3) {
          margin-top: 0;
        }
      }
    }
    
    .stat-card {
      .stat-item {
        gap: 10px;
        
        .stat-icon {
          font-size: 24px;
        }
        
        .stat-content {
          .stat-number {
            font-size: 18px;
          }
          
          .stat-label {
            font-size: 12px;
          }
        }
      }
    }
  }
  
  .quick-actions {
    margin-bottom: 20px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 15px;
    }
    
    .el-row {
      margin: 0 -5px !important;
      
      .el-col {
        padding: 0 5px;
        margin-bottom: 10px;
      }
    }
    
    .action-card {
      .action-item {
        gap: 10px;
        
        .action-icon {
          font-size: 22px;
        }
        
        .action-content {
          .action-title {
            font-size: 14px;
          }
          
          .action-desc {
            font-size: 12px;
          }
        }
      }
    }
  }
  
  .referral-section {
    margin-bottom: 20px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 15px;
    }
    
    .el-row {
      margin: 0 -5px !important;
      
      .el-col {
        padding: 0 5px;
        margin-bottom: 15px;
      }
    }
    
    .referrer-card {
      .referrer-info {
        .info-item {
          margin-bottom: 8px;
          padding: 6px 0;
          
          .info-label {
            min-width: 50px;
            font-size: 13px;
          }
          
          .info-value {
            font-size: 13px;
          }
        }
        
        .no-referrer {
          padding: 15px;
          font-size: 13px;
        }
      }
    }
    
    .promotion-card {
      .promotion-stats {
        .el-row {
          margin: 0 -3px !important;
          
          .el-col {
            padding: 0 3px;
            margin-bottom: 8px;
          }
        }
        
        .stat-box {
          padding: 10px 5px;
          
          .stat-number {
            font-size: 18px;
          }
          
          .stat-label {
            font-size: 11px;
          }
        }
      }
    }
  }
  
  // 移动端公告弹窗适配
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 0 auto;
  }
  
  .notice-content {
    .notice-header {
      .notice-title {
        font-size: 18px;
      }
      
      .notice-time {
        font-size: 13px;
      }
    }
    
    .notice-body {
      .notice-text {
        font-size: 14px;
      }
    }
  }
  
  .notice-footer {
    flex-direction: column;
    gap: 15px;
    
    .notice-pagination {
      order: 2;
      
      .pagination-info {
        font-size: 13px;
      }
    }
  }
}
</style>