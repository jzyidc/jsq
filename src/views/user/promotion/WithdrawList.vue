<template>
  <div class="withdraw-list-container">
    <el-card class="withdraw-card">
      <template #header>
        <div class="card-header">
          <h3>提现列表</h3>
          <p>查看您的提现记录和状态</p>
        </div>
      </template>
      
      <div class="withdraw-content">
        <!-- 提现统计 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :xs="24" :sm="12" :md="8">
            <div class="stat-item">
              <div class="stat-icon total">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ formatAmount(stats.query_total_amount) }}</div>
                <div class="stat-label">总提现金额</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="stat-item">
              <div class="stat-icon success">
                <el-icon><Check /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ successCount }}</div>
                <div class="stat-label">成功提现笔数</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <div class="stat-item">
              <div class="stat-icon pending">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ pendingCount }}</div>
                <div class="stat-label">处理中笔数</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 提现订单列表 -->
        <el-card class="orders-card" shadow="never">
          <template #header>
            <div class="orders-header">
              <h4>提现订单列表</h4>
              <div class="header-actions">
                <el-button @click="refreshOrders" :loading="loading">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="table-container">
            <el-table 
              :data="withdrawOrders" 
              v-loading="loading" 
              style="width: 100%"
              stripe
            >
              <el-table-column prop="id" label="订单ID" width="120">
                <template #default="scope">
                  <el-link type="primary" @click="viewOrderDetail(scope.row)">
                    {{ scope.row.id }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="提现金额" width="120">
                <template #default="scope">
                  <span class="withdraw-amount">¥{{ formatAmount(scope.row.amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="account_bank" label="提现账户" width="120" />
              <el-table-column prop="account_number" label="账户号码" width="150" show-overflow-tooltip>
                <template #default="scope">
                  {{ scope.row.account_number || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="order_submit" label="提交订单号" width="200" show-overflow-tooltip />
              <el-table-column prop="order_complete" label="完成订单号" width="200" show-overflow-tooltip>
                <template #default="scope">
                  {{ scope.row.order_complete || '-' }}
                </template>
              </el-table-column>
              <el-table-column prop="time_submit" label="提交时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.time_submit) }}
                </template>
              </el-table-column>
              <el-table-column prop="time_complete" label="完成时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.time_complete) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)" size="small">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 分页 -->
            <div class="pagination-wrapper" v-if="total > 0">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <!-- 订单详情弹窗 -->
    <el-dialog v-model="orderDetailVisible" title="提现订单详情" width="700px">
      <div v-if="selectedOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="提现金额">¥{{ formatAmount(selectedOrder.amount) }}</el-descriptions-item>
          <el-descriptions-item label="提现账户">{{ selectedOrder.account_bank }}</el-descriptions-item>
          <el-descriptions-item label="账户号码">{{ selectedOrder.account_number || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交订单号">{{ selectedOrder.order_submit }}</el-descriptions-item>
          <el-descriptions-item label="完成订单号">{{ selectedOrder.order_complete || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ formatDate(selectedOrder.time_submit) }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ formatDate(selectedOrder.time_complete) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedOrder.status)">{{ selectedOrder.status }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="orderDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Clock, Check, Money, Refresh } from '@element-plus/icons-vue'
import { getSettlementOrder } from '@/api/finance'

// 响应式数据
const loading = ref(false)
const orderDetailVisible = ref(false)
const selectedOrder = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 统计数据
const stats = reactive({
  query_total_amount: 0
})

// 提现订单列表
const withdrawOrders = ref([])

// 计算成功提现笔数
const successCount = computed(() => {
  return withdrawOrders.value.filter(order => order.status === '已提现').length
})

// 计算处理中笔数
const pendingCount = computed(() => {
  return withdrawOrders.value.filter(order => ['未提现', '提现中'].includes(order.status)).length
})

// 获取提现订单数据
const fetchWithdrawOrders = async () => {
  loading.value = true
  try {
    const response = await getSettlementOrder({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.Code === 1000) {
      // 更新统计数据
      stats.query_total_amount = response.query_total_amount || 0
      
      // 更新订单列表
      withdrawOrders.value = response.List || []
      
      // 更新分页信息
      currentPage.value = response.NowPage || 1
      pageSize.value = response.PageSize || 20
      total.value = response.RowCount || 0
      
    } else {
      ElMessage.error(response.Msg || '获取提现订单失败')
    }
    
  } catch (error) {
    ElMessage.error('获取提现订单失败')
    console.error('获取提现订单失败:', error)
  } finally {
    loading.value = false
  }
}

// 格式化金额显示
const formatAmount = (amount) => {
  if (amount === null || amount === undefined || amount === '') {
    return '0.00'
  }
  return parseFloat(amount).toFixed(2)
}

// 查看订单详情
const viewOrderDetail = (order) => {
  selectedOrder.value = order
  orderDetailVisible.value = true
}

// 刷新订单
const refreshOrders = () => {
  fetchWithdrawOrders()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchWithdrawOrders()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchWithdrawOrders()
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '已提现':
      return 'success'  // 绿色 - 表示已完成
    case '未提现':
      return 'warning'  // 橙色 - 表示待处理
    case '提现中':
      return 'info'     // 蓝色 - 表示处理中
    case '提现失败':
      return 'danger'   // 红色 - 表示失败
    default:
      return 'info'
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchWithdrawOrders()
})
</script>

<style lang="scss" scoped>
.withdraw-list-container {
  padding: 20px;
  
  .withdraw-card {
    .card-header {
      text-align: center;
      
      h3 {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 20px;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }
  
  .withdraw-content {
    .stats-row {
      margin-bottom: 24px;
      
      .stat-item {
        display: flex;
        align-items: center;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #409eff;
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          
          &.pending {
            background: #fdf6ec;
            color: #e6a23c;
          }
          
          &.success {
            background: #f0f9ff;
            color: #67c23a;
          }
          
          &.total {
            background: #f0f2f5;
            color: #409eff;
          }
          
          .el-icon {
            font-size: 24px;
          }
        }
        
        .stat-content {
          .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: #303133;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
    
    .orders-card {
      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #ebeef5;
        
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          h4 {
            margin: 0;
            color: #303133;
            font-size: 16px;
          }
          
          .header-actions {
            .el-button {
              margin-left: 8px;
              
              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
      
      .table-container {
        .withdraw-amount {
          color: #67c23a;
          font-weight: 600;
        }
        
        .pagination-wrapper {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }
      }
    }
  }
  
  .order-detail {
    .el-descriptions {
      :deep(.el-descriptions__label) {
        font-weight: 600;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .withdraw-list-container {
    padding: 12px;
    
    .stats-row {
      .el-col {
        margin-bottom: 12px;
      }
    }
    
    .orders-card {
      :deep(.el-card__header) {
        .orders-header {
          flex-direction: column;
          align-items: flex-start;
          
          .header-actions {
            margin-top: 12px;
            width: 100%;
            
            .el-button {
              width: 100%;
              margin-left: 0;
              margin-bottom: 8px;
              
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>