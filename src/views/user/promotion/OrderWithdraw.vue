<template>
  <div class="order-withdraw-container">
    <el-card class="withdraw-card">
      <template #header>
        <div class="card-header">
          <h3>订单结算</h3>
          <p>管理您的订单佣金提现</p>
        </div>
      </template>
      
      <div class="withdraw-content">
        <!-- 佣金统计 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon total">
                <el-icon><Money /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ formatAmount(stats.total_commission_amount) }}</div>
                <div class="stat-label">总计佣金</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon success">
                <el-icon><Check /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ formatAmount(stats.settled_amount) }}</div>
                <div class="stat-label">已结算佣金</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon pending">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ formatAmount(stats.confirming_amount) }}</div>
                <div class="stat-label">结算中佣金</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon warning">
                <el-icon><Clock /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">¥{{ formatAmount(stats.unsettled_amount) }}</div>
                <div class="stat-label">未结算佣金</div>
              </div>
            </div>
          </el-col>
        </el-row>
        


        <!-- 批量操作已移除 -->

        <!-- 未结算订单列表 -->
        <el-card class="orders-card" shadow="never">
          <template #header>
            <div class="orders-header">
              <h4>佣金订单列表</h4>
              <div class="header-actions">
                <el-button 
                  type="primary" 
                  @click="handleSettlement" 
                  :loading="settlementLoading"
                  :disabled="stats.unsettled_amount <= 0"
                >
                  <el-icon><Money /></el-icon>
                  一键结算
                </el-button>
                <el-button @click="refreshOrders" :loading="loading">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="table-container">
            <el-table 
              :data="commissionOrders" 
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
              <el-table-column prop="user_phone" label="用户手机" width="130" />
              <el-table-column prop="type" label="类型" width="100" />
              <el-table-column prop="consume_amount" label="消费金额" width="120">
                <template #default="scope">
                  ¥{{ formatAmount(scope.row.consume_amount) }}
                </template>
              </el-table-column>
              <el-table-column prop="commission_amount" label="佣金金额" width="120">
                <template #default="scope">
                  <span class="commission-amount">¥{{ formatAmount(scope.row.commission_amount) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="commission_balance" label="佣金余额" width="120">
                <template #default="scope">
                  ¥{{ formatAmount(scope.row.commission_balance) }}
                </template>
              </el-table-column>
              <el-table-column prop="discount" label="折扣" width="80">
                <template #default="scope">
                  {{ scope.row.discount }}
                </template>
              </el-table-column>
              <el-table-column prop="linked_order_consume" label="关联消费订单" width="150" show-overflow-tooltip />
              <el-table-column prop="linked_order_settlement" label="关联结算订单" width="150" show-overflow-tooltip />
              <el-table-column prop="time" label="订单时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.time) }}
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)" size="small">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <!-- 操作列已移除 -->
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
    <el-dialog v-model="orderDetailVisible" title="佣金订单详情" width="700px">
      <div v-if="selectedOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ selectedOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="用户手机">{{ selectedOrder.user_phone }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ selectedOrder.type }}</el-descriptions-item>
          <el-descriptions-item label="消费金额">¥{{ formatAmount(selectedOrder.consume_amount) }}</el-descriptions-item>
          <el-descriptions-item label="佣金金额">¥{{ formatAmount(selectedOrder.commission_amount) }}</el-descriptions-item>
          <el-descriptions-item label="佣金余额">¥{{ formatAmount(selectedOrder.commission_balance) }}</el-descriptions-item>
          <el-descriptions-item label="折扣">{{ selectedOrder.discount }}</el-descriptions-item>
          <el-descriptions-item label="关联消费订单">{{ selectedOrder.linked_order_consume || '-' }}</el-descriptions-item>
          <el-descriptions-item label="关联结算订单">{{ selectedOrder.linked_order_settlement || '-' }}</el-descriptions-item>
          <el-descriptions-item label="订单时间">{{ formatDate(selectedOrder.time) }}</el-descriptions-item>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock, Check, Money, Refresh } from '@element-plus/icons-vue'
import { getCommissionOrder, submitSettlement } from '@/api/finance'

// 响应式数据
const loading = ref(false)
const settlementLoading = ref(false)
const orderDetailVisible = ref(false)
const selectedOrder = ref(null)
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 统计数据
const stats = reactive({
  query_total_amount: 0,
  total_commission_amount: 0,
  settled_amount: 0,
  confirming_amount: 0,
  unsettled_amount: 0,
  current_month_amount: 0
})

// 佣金订单列表
const commissionOrders = ref([])

// 计算选中订单总金额功能已移除

// 获取佣金订单数据
const fetchCommissionOrders = async () => {
  loading.value = true
  try {
    const response = await getCommissionOrder({
      page: currentPage.value,
      pageSize: pageSize.value
    })
    
    if (response.Code === 1000) {
      // 更新统计数据
      Object.assign(stats, {
        query_total_amount: response.query_total_amount || 0,
        total_commission_amount: response.total_commission_amount || 0,
        settled_amount: response.settled_amount || 0,
        confirming_amount: response.confirming_amount || 0,
        unsettled_amount: response.unsettled_amount || 0,
        current_month_amount: response.current_month_amount || 0
      })
      
      // 更新订单列表
      commissionOrders.value = response.List || []
      
      // 更新分页信息
      currentPage.value = response.NowPage || 1
      pageSize.value = response.PageSize || 20
      total.value = response.RowCount || 0
      
    } else {
      ElMessage.error(response.Msg || '获取佣金订单失败')
    }
    
  } catch (error) {
    ElMessage.error('获取佣金订单失败')
    console.error('获取佣金订单失败:', error)
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

// 一键结算功能
const handleSettlement = async () => {
  if (stats.unsettled_amount <= 0) {
    ElMessage.warning('暂无可结算的佣金')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认要结算所有未结算订单吗？\n结算金额：¥${formatAmount(stats.unsettled_amount)}`,
      '确认结算',
      {
        confirmButtonText: '确认结算',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    settlementLoading.value = true
    const response = await submitSettlement()
    
    if (response.Code === 1000) {
      ElMessage.success('结算成功')
      // 刷新数据
      await fetchCommissionOrders()
    } else {
      ElMessage.error(response.Msg || '结算失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('结算失败')
      console.error('结算失败:', error)
    }
  } finally {
    settlementLoading.value = false
  }
}

// 查看订单详情
const viewOrderDetail = (order) => {
  selectedOrder.value = order
  orderDetailVisible.value = true
}

// 刷新订单
const refreshOrders = () => {
  fetchCommissionOrders()
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchCommissionOrders()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchCommissionOrders()
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
    case '已结算':
      return 'success'  // 绿色 - 表示已完成
    case '未结算':
      return 'warning'  // 橙色 - 表示待处理
    case '结算中':
      return 'primary'  // 深蓝色 - 表示处理中
    case '未提现':
      return 'warning'
    case '已提现':
      return 'success'
    case '提现中':
      return 'info'
    case '提现失败':
      return 'danger'
    default:
      return 'info'
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCommissionOrders()
})
</script>

<style lang="scss" scoped>
.order-withdraw-container {
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
          
          &.warning {
            background: #fdf6ec;
            color: #e6a23c;
          }
          
          &.month {
            background: #f0f9ff;
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
    
    .month-stats {
      margin-bottom: 24px;
      
      .month-item {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-left: none;
        
        .stat-icon {
          &.month {
            background: rgba(255, 255, 255, 0.2);
            color: white;
          }
        }
        
        .stat-content {
          .stat-value {
            color: white;
          }
          
          .stat-label {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
    
    // 批量操作样式已移除
    
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
        .commission-amount {
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
  .order-withdraw-container {
    padding: 12px;
    
    .stats-row {
      .el-col {
        margin-bottom: 12px;
      }
    }
    
    // 批量操作响应式样式已移除
    
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