<template>
  <div class="orders-container">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>订单列表</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" inline>
          <el-form-item label="订单号">
            <el-input
              v-model="searchForm.orderNumber"
              placeholder="请输入订单号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select
              v-model="searchForm.type"
              placeholder="请选择订单类型"
              clearable
              style="width: 150px"
            >
              <el-option label="全部" value="" />
              <el-option label="购买" value="购买" />
              <el-option label="续费" value="续费" />
              <el-option label="充值" value="充值" />
              <el-option label="赠送" value="赠送" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="handleResetSearch">
              <el-icon><RefreshLeft /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 订单表格 -->
      <div class="table-container">
        <el-table
          :data="tableData"
          v-loading="loading"
          stripe
          style="width: 100%"
        >
          <el-table-column prop="order_number" label="订单号" width="200" />
          <el-table-column prop="type" label="订单类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getOrderTypeTagType(row.type)" size="small">
                {{ row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="金额" width="120">
            <template #default="{ row }">
              <span v-if="parseFloat(row.amount) > 0" class="amount income">
                +¥{{ parseFloat(row.amount).toFixed(2) }}
              </span>
              <span v-else-if="parseFloat(row.amount) < 0" class="amount expenditure">
                ¥{{ parseFloat(row.amount).toFixed(2) }}
              </span>
              <span v-else class="text-muted">¥0.00</span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="余额" width="120">
            <template #default="{ row }">
              <span class="amount balance">¥{{ parseFloat(row.balance).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时间" width="180" />
          <el-table-column prop="describe" label="描述" min-width="200" />
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="handleViewDetail(row)"
              >
                查看详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
        />
      </div>
    </el-card>
    
    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="订单详情"
      width="600px"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单ID">{{ currentOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="订单号">{{ currentOrder.order_number }}</el-descriptions-item>
          <el-descriptions-item label="订单类型">
            <el-tag :type="getOrderTypeTagType(currentOrder.type)" size="small">
              {{ currentOrder.type }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="金额">
            <span v-if="parseFloat(currentOrder.amount) > 0" class="amount income">
              +¥{{ parseFloat(currentOrder.amount).toFixed(2) }}
            </span>
            <span v-else-if="parseFloat(currentOrder.amount) < 0" class="amount expenditure">
              ¥{{ parseFloat(currentOrder.amount).toFixed(2) }}
            </span>
            <span v-else class="text-muted">¥0.00</span>
          </el-descriptions-item>
          <el-descriptions-item label="余额">
            <span class="amount balance">¥{{ parseFloat(currentOrder.balance).toFixed(2) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="时间">{{ currentOrder.time }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ currentOrder.describe }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search,
  Refresh,
  RefreshLeft
} from '@element-plus/icons-vue'
import { getOrderData } from '@/api/finance'

// 响应式数据
const loading = ref(false)
const detailDialogVisible = ref(false)
const currentOrder = ref(null)

// 搜索表单
const searchForm = reactive({
  orderNumber: '',
  type: '',
  dateRange: null
})

// 分页信息
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 表格数据
const tableData = ref([])

// 获取订单类型标签类型
const getOrderTypeTagType = (type) => {
  const typeMap = {
    '充值': 'success',
    '购买': 'primary',
    '续费': 'warning',
    '赠送': 'info',
    '其他': 'info'
  }
  return typeMap[type] || 'info'
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.size
    }
    
    // 添加筛选条件
    if (searchForm.orderNumber) {
      params.orderNumber = searchForm.orderNumber
    }
    
    if (searchForm.type) {
      params.type = searchForm.type
    }
    
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    
    const response = await getOrderData(params)
    
    if (response.Code === 1000) {
      tableData.value = response.List || []
      pagination.total = response.RowCount || 0
      pagination.page = response.NowPage || 1
      pagination.size = response.PageSize || 20
      

    } else {
      ElMessage.error(response.Msg || '获取订单数据失败')
    }
    
  } catch (error) {
    console.error('获取订单数据失败:', error)
    ElMessage.error('获取订单数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置搜索
const handleResetSearch = () => {
  searchForm.orderNumber = ''
  searchForm.type = ''
  searchForm.dateRange = null
  pagination.page = 1
  fetchData()
}

// 刷新
const handleRefresh = () => {
  fetchData()
}

// 分页大小变化
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

// 当前页变化
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}

// 查看详情
const handleViewDetail = (row) => {
  currentOrder.value = row
  detailDialogVisible.value = true
}



// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.orders-container {
  padding: 20px;
}

.page-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
}

.search-area {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.table-container {
  .amount {
    font-weight: 600;
    
    &.income {
      color: #67c23a;
    }
    
    &.expenditure {
      color: #f56c6c;
    }
    
    &.balance {
      color: #e6a23c;
    }
  }
  
  .text-muted {
    color: #909399;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.order-detail {
  .amount {
    font-weight: 600;
    font-size: 16px;
    
    &.income {
      color: #67c23a;
    }
    
    &.expenditure {
      color: #f56c6c;
    }
    
    &.balance {
      color: #e6a23c;
    }
  }
  
  .text-muted {
    color: #909399;
  }
}

:deep(.el-descriptions__label) {
  font-weight: 600;
}
</style>