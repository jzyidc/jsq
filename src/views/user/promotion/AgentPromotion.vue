<template>
  <div class="agent-promotion-container">
    <el-card class="promotion-card">
      <template #header>
        <div class="card-header">
          <h3>代理推广</h3>
          <p>通过推广获得佣金收益</p>
        </div>
      </template>
      
      <div class="promotion-content">
        <!-- 推广统计 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.totalUsers }}</div>
                <div class="stat-label">推广用户数</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ stats.totalCommission }}</div>
                <div class="stat-label">累计佣金</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Wallet /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ stats.availableCommission }}</div>
                <div class="stat-label">已结算佣金</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.monthlyUsers }}</div>
                <div class="stat-label">本月新增</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 佣金详情和用户统计 -->
        <div class="details-section">
          <!-- 佣金详情 -->
          <el-card class="commission-details-card" shadow="never">
            <template #header>
              <h4>佣金详情</h4>
            </template>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8">
                <div class="detail-item">
                  <div class="detail-label">确认中金额</div>
                  <div class="detail-value confirming">¥{{ commissionDetails.confirmingAmount }}</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8">
                <div class="detail-item">
                  <div class="detail-label">未结算金额</div>
                  <div class="detail-value unsettled">¥{{ commissionDetails.unsettledAmount }}</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8">
                <div class="detail-item">
                  <div class="detail-label">当月佣金</div>
                  <div class="detail-value current-month">¥{{ commissionDetails.currentMonthAmount }}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 用户统计详情 -->
          <el-card class="user-stats-card" shadow="never">
            <template #header>
              <h4>用户统计详情</h4>
            </template>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8">
                <div class="detail-item">
                  <div class="detail-label">今日新增</div>
                  <div class="detail-value today">{{ userDetails.todayNum }}人</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8">
                <div class="detail-item">
                  <div class="detail-label">上月新增</div>
                  <div class="detail-value last-month">{{ userDetails.lastMonthNum }}人</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8">
                <div class="detail-item">
                  <div class="detail-label">本年新增</div>
                  <div class="detail-value year">{{ userDetails.yearNum }}人</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>

        <!-- 佣金规则和推广链接 -->
        <el-row :gutter="20" class="rules-link-row">
          <el-col :xs="24" :lg="14">
            <!-- 佣金规则 -->
            <el-card class="commission-rules-card" shadow="never">
              <template #header>
                <h4>佣金规则</h4>
              </template>
              <div class="rules-content">
                <el-table :data="commissionRules" style="width: 100%">
                  <el-table-column prop="level" label="推广等级" width="120" />
                  <el-table-column prop="condition" label="达成条件" />
                  <el-table-column prop="rate" label="佣金比例" width="120">
                    <template #default="scope">
                      <el-tag type="success">{{ scope.row.rate }}%</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="description" label="说明" />
                </el-table>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :lg="10">
            <!-- 推广链接 -->
        <el-card class="promotion-link-card" shadow="never">
          <template #header>
            <h4>我的推广链接</h4>
          </template>
          <div class="link-content">
            <el-input
              v-model="promotionLink"
              readonly
              class="link-input"
              placeholder="推广链接生成中..."
            >
              <template #append>
                <el-button @click="copyLink" type="primary" :disabled="!promotionLink">
                  <el-icon><DocumentCopy /></el-icon>
                  复制链接
                </el-button>
              </template>
            </el-input>
            <div class="link-tip">
              <el-text size="small" type="info">
                <el-icon><InfoFilled /></el-icon>
                如果复制失败，请手动选择链接文本进行复制
              </el-text>
            </div>
            <div class="link-actions">
              <el-button @click="generateQRCode" type="success">
                <el-icon><Grid /></el-icon>
                生成二维码
              </el-button>
              <el-button @click="shareLink" type="info">
                <el-icon><Share /></el-icon>
                分享链接
              </el-button>
            </div>
          </div>
        </el-card>
          </el-col>
        </el-row>


      </div>
    </el-card>

    <!-- 二维码弹窗 -->
    <el-dialog
      v-model="qrCodeVisible"
      title="推广链接二维码"
      width="400px"
      align-center
    >
      <div class="qr-code-container">
        <div class="qr-code-wrapper">
          <canvas ref="qrCodeCanvas" class="qr-code-canvas"></canvas>
        </div>
        <div class="qr-code-info">
          <p class="qr-code-text">扫描二维码或复制链接分享给好友</p>
          <el-input
            v-model="promotionLink"
            readonly
            class="qr-link-input"
          >
            <template #append>
              <el-button @click="copyLink" type="primary" size="small" :disabled="!promotionLink">
                复制
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="downloadQRCode" type="success">
            <el-icon><Download /></el-icon>
            下载二维码
          </el-button>
          <el-button @click="qrCodeVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Money,
  Wallet,
  TrendCharts,
  DocumentCopy,
  Grid,
  Share,
  Download,
  InfoFilled
} from '@element-plus/icons-vue'
import { getPromotionInfo } from '@/api/auth'
import { useUserStore } from '@/store/user'
import QRCode from 'qrcode'

// 响应式数据

// 统计数据
const stats = reactive({
  totalUsers: 0,
  totalCommission: '0.00',
  availableCommission: '0.00',
  monthlyUsers: 0
})

// 佣金详情
const commissionDetails = reactive({
  confirmingAmount: '0.00',
  unsettledAmount: '0.00',
  currentMonthAmount: '0.00'
})

// 用户详情
const userDetails = reactive({
  todayNum: 0,
  lastMonthNum: 0,
  yearNum: 0
})

// 推广链接
const promotionLink = ref('')

// 二维码相关
const qrCodeVisible = ref(false)
const qrCodeCanvas = ref(null)

// 佣金规则
const commissionRules = ref([
  {
    level: '一级代理',
    condition: '直接推广用户',
    rate: 10,
    description: '用户通过您的链接注册并充值时，您可获得其充值金额10%的佣金'
  },
  {
    level: '二级代理',
    condition: '推广用户≥10人',
    rate: 15,
    description: '当您推广的用户达到10人时，佣金比例提升至15%'
  },
  {
    level: '三级代理',
    condition: '推广用户≥50人',
    rate: 20,
    description: '当您推广的用户达到50人时，佣金比例提升至20%'
  }
])



// 获取推广统计
const fetchStats = async () => {
  try {
    const response = await getPromotionInfo()
    if (response.code === 1000) {
      const { my_user_info, my_commission_info } = response
      
      // 更新统计数据
      Object.assign(stats, {
        totalUsers: my_user_info.total_num || 0,
        totalCommission: my_commission_info.total_amount?.toFixed(2) || '0.00',
        availableCommission: my_commission_info.settled_amount?.toFixed(2) || '0.00',
        monthlyUsers: my_user_info.month_num || 0
      })
      
      // 更新佣金详情
      Object.assign(commissionDetails, {
        confirmingAmount: my_commission_info.confirming_amount?.toFixed(2) || '0.00',
        unsettledAmount: my_commission_info.unsettled_amount?.toFixed(2) || '0.00',
        currentMonthAmount: my_commission_info.current_month_amount?.toFixed(2) || '0.00'
      })
      
      // 更新用户详情
      Object.assign(userDetails, {
        todayNum: my_user_info.today_num || 0,
        lastMonthNum: my_user_info.last_month_num || 0,
        yearNum: my_user_info.year_num || 0
      })
    } else {
      ElMessage.error(response.msg || '获取统计数据失败')
    }
  } catch (error) {
    console.error('获取推广统计失败:', error)
    ElMessage.error('获取统计数据失败')
  }
}

// 获取推广链接
const fetchPromotionLink = async () => {
  try {
    // 这里应该调用实际的API
    // const response = await api.getPromotionLink()
    // promotionLink.value = response.data.link
    
    // 使用真正的用户信息生成推广链接
    const userStore = useUserStore()
    const userId = userStore.userInfo.id || 'USER'
    promotionLink.value = `${window.location.origin}/register?ref=${userId}`
  } catch (error) {
    ElMessage.error('获取推广链接失败')
  }
}



// 复制推广链接
const copyLink = async () => {
  try {
    // 优先使用现代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(promotionLink.value)
      ElMessage.success('推广链接已复制到剪贴板')
      return
    }
    
    // 降级方案：使用传统的 document.execCommand
    const textArea = document.createElement('textarea')
    textArea.value = promotionLink.value
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    if (successful) {
      ElMessage.success('推广链接已复制到剪贴板')
    } else {
      throw new Error('复制命令执行失败')
    }
  } catch (error) {
    console.error('复制失败:', error)
    // 最终降级方案：显示选择提示
    ElMessageBox.alert(
      `复制失败，请手动复制以下链接：\n\n${promotionLink.value}`,
      '手动复制',
      {
        confirmButtonText: '我知道了',
        type: 'warning',
        showClose: false
      }
    )
  }
}

// 生成二维码
const generateQRCode = async () => {
  if (!promotionLink.value) {
    ElMessage.warning('推广链接为空，无法生成二维码')
    return
  }
  
  qrCodeVisible.value = true
  
  // 等待DOM更新
  await nextTick()
  
  try {
    const canvas = qrCodeCanvas.value
    if (canvas) {
      await QRCode.toCanvas(canvas, promotionLink.value, {
        width: 200,
        height: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
  } catch (error) {
    console.error('生成二维码失败:', error)
    ElMessage.error('生成二维码失败')
  }
}

// 下载二维码
const downloadQRCode = () => {
  const canvas = qrCodeCanvas.value
  if (canvas) {
    const link = document.createElement('a')
    link.download = '推广链接二维码.png'
    link.href = canvas.toDataURL()
    link.click()
    ElMessage.success('二维码已下载')
  } else {
    ElMessage.error('二维码未生成，无法下载')
  }
}

// 分享链接
const shareLink = () => {
  ElMessage.info('分享功能开发中...')
}



// 组件挂载时获取数据
onMounted(() => {
  fetchStats()
  fetchPromotionLink()
})
</script>

<style lang="scss" scoped>
.agent-promotion-container {
  padding: 20px;
  
  .promotion-card {
    .card-header {
      h3 {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 20px;
      }
      
      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }
  
  .promotion-content {
    .stats-row {
      margin-bottom: 24px;
      
      .stat-item {
        display: flex;
        align-items: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        color: white;
        height: 80px;
        
        .stat-icon {
          font-size: 32px;
          margin-right: 16px;
          opacity: 0.8;
        }
        
        .stat-content {
          .stat-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.9;
          }
        }
      }
    }
    
    .promotion-link-card,
    .commission-rules-card,
    .commission-details-card,
    .user-stats-card {
      margin-bottom: 24px;
      
      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #ebeef5;
        
        h4 {
          margin: 0;
          color: #303133;
          font-size: 16px;
        }
      }
    }
    
    .details-section {
      margin-bottom: 24px;
      
      .commission-details-card {
        margin-bottom: 12px;
      }
      
      .user-stats-card {
        margin-bottom: 0;
      }
    }
    
    .rules-link-row {
      margin-bottom: 24px;
      
      .promotion-link-card,
      .commission-rules-card {
        margin-bottom: 0;
        height: 100%;
      }
    }
    
    .commission-details-card,
    .user-stats-card {
      .detail-item {
        text-align: center;
        padding: 20px 10px;
        border-radius: 8px;
        background: #f8f9fa;
        
        .detail-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }
        
        .detail-value {
          font-size: 18px;
          font-weight: bold;
          
          &.confirming {
            color: #e6a23c;
          }
          
          &.unsettled {
            color: #f56c6c;
          }
          
          &.current-month {
            color: #67c23a;
          }
          
          &.today {
            color: #409eff;
          }
          
          &.last-month {
            color: #909399;
          }
          
          &.year {
            color: #606266;
          }
        }
      }
    }
    
    .link-content {
      .link-input {
        margin-bottom: 8px;
      }
      
      .link-tip {
        margin-bottom: 16px;
        padding: 8px 12px;
        background: #f0f9ff;
        border: 1px solid #e1f5fe;
        border-radius: 6px;
        
        .el-text {
          display: flex;
          align-items: center;
          gap: 6px;
          
          .el-icon {
            font-size: 14px;
          }
        }
      }
      
      .link-actions {
        display: flex;
        gap: 12px;
        
        .el-button {
          flex: 1;
        }
      }
    }
  }
}

// 二维码弹窗样式
.qr-code-container {
  text-align: center;
  
  .qr-code-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px dashed #e4e7ed;
    
    .qr-code-canvas {
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }
  
  .qr-code-info {
    .qr-code-text {
      margin: 0 0 16px 0;
      color: #606266;
      font-size: 14px;
    }
    
    .qr-link-input {
      margin-bottom: 0;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
}

// 响应式设计
@media (max-width: 768px) {
  .agent-promotion-container {
    padding: 12px;
    
    .stats-row {
      .el-col {
        margin-bottom: 12px;
      }
      
      .stat-item {
        height: 70px;
        padding: 16px;
        
        .stat-icon {
          font-size: 28px;
          margin-right: 12px;
        }
        
        .stat-content {
          .stat-value {
            font-size: 20px;
          }
          
          .stat-label {
            font-size: 12px;
          }
        }
      }
    }
    
    .link-actions {
      flex-direction: column;
      
      .el-button {
        width: 100%;
      }
    }
    
    .link-tip {
      padding: 6px 10px;
      
      .el-text {
        font-size: 12px;
        
        .el-icon {
          font-size: 12px;
        }
      }
    }
    
    .commission-details-card,
    .user-stats-card {
      .el-col {
        margin-bottom: 12px;
      }
      
      .detail-item {
        padding: 16px 8px;
        
        .detail-label {
          font-size: 12px;
        }
        
        .detail-value {
          font-size: 16px;
        }
      }
    }
    
    .rules-link-row {
      .el-col {
        margin-bottom: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .promotion-link-card,
      .commission-rules-card {
        height: auto;
      }
    }
  }
  
  // 移动端二维码弹窗适配
  .qr-code-container {
    .qr-code-wrapper {
      padding: 16px;
      
      .qr-code-canvas {
        width: 160px !important;
        height: 160px !important;
      }
    }
    
    .qr-code-info {
      .qr-code-text {
        font-size: 13px;
      }
    }
  }
  
  .dialog-footer {
    flex-direction: column;
    
    .el-button {
      width: 100%;
    }
  }
}
</style>