<template>
  <div class="records-container">
    <el-card class="records-card">
      <template #header>
        <div class="card-header">
          <h3>充值记录</h3>
          <p>查看您的所有充值记录和支付状态</p>
        </div>
      </template>
      
      <div class="records-content">
        <!-- 筛选条件 -->
        <div class="filter-section">
          <el-row :gutter="16">
            <el-col :span="6">
              <el-select v-model="filterStatus" placeholder="支付状态" clearable @change="handleFilterChange">
                <el-option label="全部" value="" />
                <el-option label="已支付" value="paid" />
                <el-option label="待支付" value="pending" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterType" placeholder="支付方式" clearable @change="handleFilterChange">
                <el-option label="全部" value="" />
                <el-option label="支付宝" value="支付宝" />
                <el-option label="微信" value="微信" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                @change="handleFilterChange"
              />
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="refreshRecords" :loading="loading">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </el-col>
          </el-row>
        </div>
        
        <!-- 统计信息 -->
        <div class="stats-section">
          <el-row :gutter="16">
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon success">
                  <el-icon><Money /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">¥{{ totalAmount }}</div>
                  <div class="stat-label">总充值金额</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon primary">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ totalCount }}</div>
                  <div class="stat-label">充值次数</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-card">
                <div class="stat-icon warning">
                  <el-icon><Clock /></el-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ pendingCount }}</div>
                  <div class="stat-label">待支付订单</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <!-- 充值记录表格 -->
        <div class="table-section">
          <el-table 
            :data="rechargeRecords" 
            style="width: 100%" 
            v-loading="loading"
            empty-text="暂无充值记录"
          >
            <el-table-column prop="my_order_number" label="订单号" width="200">
              <template #default="{ row }">
                <div class="order-number">
                  {{ row.my_order_number }}
                  <el-button 
                    type="text" 
                    size="small" 
                    @click="copyOrderNumber(row.my_order_number)"
                    class="copy-btn"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="amount" label="充值金额" width="120" sortable>
              <template #default="{ row }">
                <span class="amount">¥{{ row.amount }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="type" label="支付方式" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.type === '支付宝'" type="success">
                  <el-icon><Money /></el-icon>
                  支付宝
                </el-tag>
                <el-tag v-else-if="row.type === '微信'" type="primary">
                  <el-icon><ChatDotRound /></el-icon>
                  微信
                </el-tag>
                <el-tag v-else type="info">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="支付状态" width="120">
              <template #default="{ row }">
                <el-tag
                  :type="row.api_order_number ? 'success' : 'warning'"
                  :icon="row.api_order_number ? 'CircleCheck' : 'Clock'"
                >
                  {{ row.api_order_number ? '已支付' : '待支付' }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column prop="time" label="创建时间" width="180" sortable>
              <template #default="{ row }">
                <div class="time-info">
                  <div>{{ formatDate(row.time) }}</div>
                  <div class="time-ago">{{ getTimeAgo(row.time) }}</div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-button 
                    type="info" 
                    size="small"
                    @click="viewOrderDetail(row)"
                  >
                    详情
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        
        <!-- 分页组件 -->
        <div class="pagination-container" v-if="pagination.total > 0">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </el-card>
    
    <!-- 订单详情弹窗 -->
    <el-dialog
      v-model="showOrderDetail"
      title="订单详情"
      width="500px"
    >
      <div class="order-detail" v-if="selectedOrder">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">
            <span class="order-number">{{ selectedOrder.my_order_number }}</span>
            <el-button 
              type="text" 
              size="small" 
              @click="copyOrderNumber(selectedOrder.my_order_number)"
            >
              <el-icon><CopyDocument /></el-icon>
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="充值金额">
            <span class="amount">¥{{ selectedOrder.amount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            <el-tag v-if="selectedOrder.type === '支付宝'" type="success">支付宝</el-tag>
            <el-tag v-else-if="selectedOrder.type === '微信'" type="primary">微信</el-tag>
            <el-tag v-else type="info">{{ selectedOrder.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="支付状态">
            <el-tag
              :type="selectedOrder.api_order_number ? 'success' : 'warning'"
            >
              {{ selectedOrder.api_order_number ? '已支付' : '待支付' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(selectedOrder.time) }}
          </el-descriptions-item>
          <el-descriptions-item label="第三方订单号" v-if="selectedOrder.api_order_number">
            {{ selectedOrder.api_order_number }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showOrderDetail = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Money, 
  Document, 
  Clock, 
  Refresh, 
  CopyDocument,
  ChatDotRound
} from '@element-plus/icons-vue'
import { getRechargeRecords } from '@/api/finance'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const rechargeRecords = ref([])
const showOrderDetail = ref(false)
const selectedOrder = ref(null)

// 筛选条件
const filterStatus = ref('')
const filterType = ref('')
const dateRange = ref([])

// 分页相关数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageCount: 0
})

// 统计数据
const totalAmount = computed(() => {
  return rechargeRecords.value
    .filter(record => record.api_order_number) // 只统计已支付的
    .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0)
    .toFixed(2)
})

const totalCount = computed(() => {
  return rechargeRecords.value.length
})

const pendingCount = computed(() => {
  return rechargeRecords.value.filter(record => !record.api_order_number).length
})

// 加载充值记录
const loadRechargeRecords = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page: page,
      pageSize: pagination.pageSize
    }
    
    // 添加筛选条件
    if (filterStatus.value) {
      params.status = filterStatus.value
    }
    if (filterType.value) {
      params.type = filterType.value
    }
    if (dateRange.value && dateRange.value.length === 2) {
      params.startDate = dateRange.value[0]
      params.endDate = dateRange.value[1]
    }
    
    const response = await getRechargeRecords(params)
    
    if (response.Code === 1000) {
      rechargeRecords.value = response.List || []
      pagination.currentPage = response.NowPage || page
      pagination.total = response.RowCount || 0
      pagination.pageCount = response.PageCount || 0
    } else {
      ElMessage.error(response.Message || '加载充值记录失败')
    }
  } catch (error) {
    console.error('加载充值记录失败:', error)
    ElMessage.error('加载充值记录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 分页切换处理
const handlePageChange = (page) => {
  loadRechargeRecords(page)
}

// 每页条数变化处理
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadRechargeRecords(1)
}

// 筛选条件变化处理
const handleFilterChange = () => {
  pagination.currentPage = 1
  loadRechargeRecords(1)
}

// 刷新记录
const refreshRecords = () => {
  loadRechargeRecords(pagination.currentPage)
}

// 查看订单详情
const viewOrderDetail = (order) => {
  selectedOrder.value = order
  showOrderDetail.value = true
}

// 复制订单号
const copyOrderNumber = async (orderNumber) => {
  try {
    await navigator.clipboard.writeText(orderNumber)
    ElMessage.success('订单号已复制到剪贴板')
  } catch (error) {
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = orderNumber
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('订单号已复制到剪贴板')
  }
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取相对时间
const getTimeAgo = (dateString) => {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return '很久以前'
}

// 监听充值成功事件
const handleRechargeSuccess = () => {
  loadRechargeRecords(pagination.currentPage)
}

// 组件挂载时加载数据
onMounted(() => {
  loadRechargeRecords()
  // 监听充值成功事件
  window.addEventListener('recharge-success', handleRechargeSuccess)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('recharge-success', handleRechargeSuccess)
})
</script>

<style lang="scss" scoped>
.records-container {
  max-width: 100%;
  margin: 0;
  padding: 20px 0;
  width: 100%;
  
  @media (min-width: 1400px) {
    max-width: 100%;
    padding: 20px 0;
  }
  
  @media (max-width: 1200px) {
    max-width: 100%;
    padding: 20px 0;
  }
  
  @media (max-width: 992px) {
    max-width: 100%;
    padding: 20px 0;
  }
}

.records-card {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    padding: 24px;
    border-bottom: none;
  }
  
  :deep(.el-card__body) {
    padding: 24px 0;
  }
  
  .card-header {
    h3 {
      margin: 0 0 8px 0;
      color: white;
      font-size: 24px;
      font-weight: 600;
      display: flex;
      align-items: center;
      
      &::before {
        content: '📊';
        margin-right: 12px;
        font-size: 28px;
      }
    }
    
    p {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
    }
  }
}

.records-content {
  .filter-section {
    margin: 0 20px 24px 20px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }
  
  .stats-section {
    margin: 0 20px 24px 20px;
    
    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }
      
      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        font-size: 20px;
        
        &.success {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
        }
        
        &.primary {
          background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
          color: white;
        }
        
        &.warning {
          background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
          color: white;
        }
      }
      
      .stat-content {
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #718096;
        }
      }
    }
  }
  
  .table-section {
    margin: 0 20px 24px 20px;
    
    :deep(.el-table) {
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      
      .el-table__header {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        
        th {
          background: transparent;
          color: #2d3748;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }
      }
      
      .el-table__row {
        &:hover {
          background-color: rgba(66, 153, 225, 0.05);
        }
      }
    }
    
    .order-number {
      display: flex;
      align-items: center;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      
      .copy-btn {
        margin-left: 8px;
        padding: 2px;
        
        &:hover {
          color: #4299e1;
        }
      }
    }
    
    .amount {
      font-weight: 600;
      color: #48bb78;
      font-size: 16px;
    }
    
    .time-info {
      .time-ago {
        font-size: 12px;
        color: #a0aec0;
        margin-top: 2px;
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      
      .el-button {
        padding: 4px 8px;
        font-size: 12px;
      }
    }
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin: 24px 20px 0 20px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
  }
}

.order-detail {
  :deep(.el-descriptions) {
    .el-descriptions__label {
      font-weight: 600;
      color: #2d3748;
    }
    
    .order-number {
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
    
    .amount {
      font-weight: 600;
      color: #48bb78;
      font-size: 16px;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 动画效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.records-card {
  animation: fadeInUp 0.6s ease-out;
}

// 响应式设计
@media (max-width: 768px) {
  .records-container {
    padding: 16px 0;
    max-width: 100%;
    margin: 0;
    width: 100%;
    overflow-x: hidden;
  }
  
  .records-card {
    :deep(.el-card__body) {
      padding: 16px 0;
    }
  }
  
  .records-content {
    .filter-section {
      margin: 0 16px 24px 16px;
      padding: 16px;
      overflow-x: auto;
    }
    
    .stats-section {
      margin: 0 16px 24px 16px;
    }
    
    .table-section {
      margin: 0 16px 24px 16px;
    }
    
    .pagination-container {
      margin: 24px 16px 0 16px;
    }
  }
  
  .filter-section {
    padding: 16px;
    overflow-x: auto;
    
    .el-row {
      .el-col {
        margin-bottom: 12px;
      }
    }
  }
  
  .stats-section {
    .el-row {
      .el-col {
        margin-bottom: 12px;
      }
    }
    
    .stat-card {
      padding: 16px;
      
      .stat-icon {
        width: 40px;
        height: 40px;
        font-size: 18px;
      }
      
      .stat-content {
        .stat-value {
          font-size: 20px;
        }
      }
    }
  }
  
  .table-section {
    overflow-x: auto;
    width: 100%;
    
    :deep(.el-table) {
      font-size: 14px;
      min-width: 800px;
      
      .action-buttons {
        flex-direction: column;
        gap: 4px;
        
        .el-button {
          width: 100%;
          font-size: 12px;
        }
      }
      
      .order-number {
        font-size: 12px;
        word-break: break-all;
      }
    }
  }
  
  .pagination-container {
    overflow-x: auto;
    
    :deep(.el-pagination) {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}

@media (max-width: 480px) {
  .records-container {
    padding: 12px 0;
    width: 100%;
  }
  
  .card-header {
    h3 {
      font-size: 20px;
    }
  }
  
  .records-content {
    .filter-section {
      margin: 0 12px 24px 12px;
    }
    
    .stats-section {
      margin: 0 12px 24px 12px;
    }
    
    .table-section {
      margin: 0 12px 24px 12px;
    }
    
    .pagination-container {
      margin: 24px 12px 0 12px;
    }
  }
  
  .filter-section {
    padding: 12px;
    
    .el-row {
      .el-col {
        span: 24;
        margin-bottom: 8px;
      }
    }
  }
  
  .stats-section {
    .el-row {
      .el-col {
        span: 24;
        margin-bottom: 8px;
      }
    }
    
    .stat-card {
      padding: 12px;
      
      .stat-content {
        .stat-value {
          font-size: 18px;
        }
        
        .stat-label {
          font-size: 12px;
        }
      }
    }
  }
  
  .table-section {
    :deep(.el-table) {
      min-width: 600px;
      font-size: 12px;
      
      .el-table__cell {
        padding: 8px 4px;
      }
    }
  }
}
</style>