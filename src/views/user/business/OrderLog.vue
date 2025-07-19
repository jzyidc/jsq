<template>
  <div class="order-log-page">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>订单日志</span>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="节点ID">
                <el-input
                  v-model="searchForm.screenId"
                  placeholder="请输入节点ID"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="节点IP">
                <el-input
                  v-model="searchForm.screenIp"
                  placeholder="请输入节点IP地址"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单号">
                <el-input
                  v-model="searchForm.screenOrderNumber"
                  placeholder="请输入关联订单号"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型">
                <el-select
                  v-model="searchForm.screenType"
                  placeholder="请选择类型"
                  clearable
                  style="width: 100%"
                >
                  <el-option label="购买" value="购买" />
                  <el-option label="续费" value="续费" />
                  <el-option label="切换" value="切换" />
                  <el-option label="暂停" value="暂停" />
                  <el-option label="退订" value="退订" />
                  <el-option label="过期" value="过期" />
                  <el-option label="冻结" value="冻结" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="searchForm.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="handleSearch">
                  <el-icon><Search /></el-icon>
                  搜索
                </el-button>
                <el-button @click="handleReset">
                  <el-icon><Refresh /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <!-- 订单日志表格 -->
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="width: 100%"
        empty-text="暂无数据"
      >
        <el-table-column prop="id" label="订单ID" width="120" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getTypeTagType(row.type)"
              size="small"
            >
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="描述" min-width="120" show-overflow-tooltip />
        <el-table-column prop="time" label="操作时间" width="160" show-overflow-tooltip />
        <el-table-column prop="sold_id" label="节点ID" width="120" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" width="130" show-overflow-tooltip />
        <el-table-column prop="game" label="游戏" min-width="100" show-overflow-tooltip />
        <el-table-column prop="area" label="区域" width="100" show-overflow-tooltip />
        <el-table-column prop="start_time" label="开始时间" width="160" show-overflow-tooltip />
        <el-table-column prop="end_time" label="结束时间" width="160" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额变动" width="120" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getAmountType(row.amount)"
              size="small"
            >
              {{ formatAmount(row.amount) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getNodeOrder } from '@/api/finance'

// 响应式数据
const loading = ref(false)
const tableData = ref([])

// 搜索表单
const searchForm = reactive({
  screenId: '',
  screenIp: '',
  screenOrderNumber: '',
  screenType: '',
  startTime: '',
  endTime: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 获取订单日志数据
const fetchData = async () => {
  // 验证时间范围
  if (searchForm.startTime && searchForm.endTime) {
    if (new Date(searchForm.startTime) > new Date(searchForm.endTime)) {
      ElMessage.warning('开始时间不能大于结束时间')
      return
    }
  }
  
  loading.value = true
  try {
    const params = {
      screenId: searchForm.screenId || '',
      screenIp: searchForm.screenIp || '',
      screenOrderNumber: searchForm.screenOrderNumber || '',
      screenType: searchForm.screenType || '',
      screenStartTime: searchForm.startTime || '',
      screenEndTime: searchForm.endTime || '',
      page: pagination.page,
      pageSize: pagination.size
    }
    
    const response = await getNodeOrder(params)
    
    if (response.Code === 1000) {
      tableData.value = response.List || []
      pagination.total = response.RowCount || 0
    } else {
      ElMessage.error(response.Msg || '获取订单日志失败')
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取订单日志失败:', error)
    ElMessage.error('获取订单日志失败')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.screenId = ''
  searchForm.screenIp = ''
  searchForm.screenOrderNumber = ''
  searchForm.screenType = ''
  searchForm.startTime = ''
  searchForm.endTime = ''
  pagination.page = 1
  tableData.value = []
  pagination.total = 0
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

// 获取类型标签样式
const getTypeTagType = (type) => {
  const typeMap = {
    '购买': 'success',
    '续费': 'warning',
    '切换': 'info',
    '暂停': 'warning',
    '退订': 'danger',
    '过期': 'danger',
    '冻结': 'danger'
  }
  return typeMap[type] || 'info'
}

// 获取金额类型样式
const getAmountType = (amount) => {
  const num = parseFloat(amount || 0)
  if (num > 0) {
    return 'success' // 收入
  } else if (num < 0) {
    return 'danger' // 支出
  } else {
    return 'info' // 无变化
  }
}

// 格式化金额显示
const formatAmount = (amount) => {
  const num = parseFloat(amount || 0)
  if (num > 0) {
    return `+${num.toFixed(2)}`
  } else if (num < 0) {
    return num.toFixed(2)
  } else {
    return '0.00'
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.order-log-page {
  .page-card {
    .card-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;
      font-weight: 600;
      font-size: 16px;
    }
    
    .search-area {
      margin-bottom: 20px;
      padding: 24px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
      
      .el-form-item {
        margin-bottom: 16px;
      }
      
      .el-button {
        margin-right: 12px;
      }
    }
    
    .pagination-wrapper {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }
  }
  
  :deep(.el-table) {
    .el-table__header {
      th {
        background-color: #f8f9fa;
        color: #495057;
        font-weight: 600;
      }
    }
    
    .el-table__row {
      &:hover {
        background-color: #f8f9fa;
      }
    }
  }
  
  :deep(.el-tag) {
    font-weight: 500;
  }
}
</style>