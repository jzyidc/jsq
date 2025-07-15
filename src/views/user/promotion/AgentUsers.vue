<template>
  <div class="agent-users-container">
    <el-card class="users-card">
      <template #header>
        <div class="card-header">
          <h3>代理用户</h3>
          <p>管理您推广的用户信息</p>
        </div>
      </template>
      
      <div class="users-content">
        <!-- 筛选条件 -->
        <el-card class="filter-card" shadow="never">
          <el-form :model="filterForm" :inline="true" class="filter-form">
            <el-form-item label="用户手机号">
              <el-input
                v-model="filterForm.screenPhone"
                placeholder="请输入用户手机号"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="推荐人手机号">
              <el-input
                v-model="filterForm.screenReferrerPhone"
                placeholder="请输入推荐人手机号"
                clearable
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="filterForm.dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                style="width: 350px"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch" :loading="loading">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              <el-button @click="handleReset">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 用户统计 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.totalUsers }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.todayUsers }}</div>
                <div class="stat-label">今日新增</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.monthUsers }}</div>
                <div class="stat-label">本月新增</div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="stat-item">
              <div class="stat-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.activeUsers }}</div>
                <div class="stat-label">活跃用户</div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 用户列表 -->
        <el-card class="table-card" shadow="never">
          <template #header>
            <h4>用户列表</h4>
          </template>
          <div class="table-container">
            <el-table :data="userList" v-loading="loading" style="width: 100%">
              <el-table-column prop="phone" label="手机号" width="130" />
              <el-table-column prop="referrer_phone" label="推荐人手机号" width="130" />
              <el-table-column prop="reg_time" label="注册时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.reg_time) }}
                </template>
              </el-table-column>
              <el-table-column prop="total_payment" label="累计充值" width="120">
                <template #default="scope">
                  <span class="amount">¥{{ scope.row.total_payment || '0.00' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="balance" label="账户余额" width="120">
                <template #default="scope">
                  <span class="balance">¥{{ scope.row.balance || '0.00' }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="discount" label="折扣" width="100">
                <template #default="scope">
                  <el-tag type="success" size="small">
                    {{ scope.row.discount }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="node_count" label="节点数" width="100" />
              <el-table-column prop="reg_ip" label="注册IP" width="140" />
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button type="primary" size="small" @click="viewUserDetail(scope.row)">
                    查看详情
                  </el-button>
                  <el-button type="warning" size="small" @click="openDiscountDialog(scope.row)">
                    设置折扣
                  </el-button>
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

    <!-- 用户详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="用户详情" width="600px">
      <div v-if="selectedUser" class="user-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户ID">{{ selectedUser.id }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ selectedUser.phone }}</el-descriptions-item>
          <el-descriptions-item label="推荐人手机号">{{ selectedUser.referrer_phone }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ formatDate(selectedUser.reg_time) }}</el-descriptions-item>
          <el-descriptions-item label="累计充值">¥{{ selectedUser.total_payment || '0.00' }}</el-descriptions-item>
          <el-descriptions-item label="账户余额">¥{{ selectedUser.balance || '0.00' }}</el-descriptions-item>
          <el-descriptions-item label="折扣">
            <el-tag type="success" size="small">
              {{ selectedUser.discount }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="节点数">{{ selectedUser.node_count }}</el-descriptions-item>
          <el-descriptions-item label="注册IP" :span="2">{{ selectedUser.reg_ip }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 设置折扣弹窗 -->
    <el-dialog v-model="discountDialogVisible" title="设置用户折扣" width="400px">
      <el-form :model="discountForm" :rules="discountRules" ref="discountFormRef" label-width="80px">
        <el-form-item label="用户">
          <el-input v-model="discountForm.phone" disabled />
        </el-form-item>
        <el-form-item label="折扣值" prop="discount">
          <el-input-number
            v-model="discountForm.discount"
            :min="0.1"
            :max="1.0"
            :step="0.01"
            :precision="2"
            placeholder="请输入折扣值"
            style="width: 100%"
          />
          <div class="form-tip">折扣值范围：0.1 - 1.0</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="discountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSetDiscount" :loading="discountLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, User, Calendar, TrendCharts, UserFilled } from '@element-plus/icons-vue'
import { getMyUser, setUserDiscount } from '@/api/finance'

// 响应式数据
const loading = ref(false)
const userList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const detailDialogVisible = ref(false)
const selectedUser = ref(null)

// 设置折扣相关
const discountDialogVisible = ref(false)
const discountLoading = ref(false)
const discountFormRef = ref(null)
const discountForm = reactive({
  phone: '',
  discount: 0.5
})

// 折扣表单验证规则
const discountRules = {
  discount: [
    { required: true, message: '请输入折扣值', trigger: 'blur' },
    { type: 'number', min: 0.1, max: 1.0, message: '折扣值必须在0.1-1.0之间', trigger: 'blur' }
  ]
}

// 筛选表单
const filterForm = reactive({
  screenPhone: '',
  screenReferrerPhone: '',
  dateRange: []
})

// 统计数据
const stats = ref({
  totalUsers: 0,
  todayUsers: 0,
  monthUsers: 0,
  activeUsers: 0
})

// 计算属性
const searchParams = computed(() => {
  const params = {
    page: currentPage.value,
    pageSize: pageSize.value,
    screenPhone: filterForm.screenPhone,
    screenReferrerPhone: filterForm.screenReferrerPhone
  }
  
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    params.screenStartTime = filterForm.dateRange[0]
    params.screenEndTime = filterForm.dateRange[1]
  }
  
  return params
})

// 方法
const fetchUserList = async () => {
  try {
    loading.value = true
    const response = await getMyUser(searchParams.value)
    
    if (response.Code === 1000) {
      userList.value = response.List || []
      total.value = response.RowCount || 0
      
      // 更新统计数据
      updateStats()
    } else {
      ElMessage.error(response.Msg || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const updateStats = () => {
  const today = new Date().toDateString()
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  
  stats.value.totalUsers = total.value
  stats.value.todayUsers = userList.value.filter(user => {
    const registerDate = new Date(user.reg_time)
    return registerDate.toDateString() === today
  }).length
  
  stats.value.monthUsers = userList.value.filter(user => {
    const registerDate = new Date(user.reg_time)
    return registerDate.getMonth() === thisMonth && registerDate.getFullYear() === thisYear
  }).length
  
  stats.value.activeUsers = userList.value.filter(user => parseFloat(user.balance) > 0).length
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUserList()
}

const handleReset = () => {
  filterForm.screenPhone = ''
  filterForm.screenReferrerPhone = ''
  filterForm.dateRange = []
  currentPage.value = 1
  fetchUserList()
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchUserList()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchUserList()
}

const viewUserDetail = (user) => {
  selectedUser.value = user
  detailDialogVisible.value = true
}

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

// 打开设置折扣弹窗
const openDiscountDialog = (user) => {
  discountForm.phone = user.phone
  discountForm.discount = parseFloat(user.discount) || 0.5
  discountDialogVisible.value = true
}

// 处理设置折扣
const handleSetDiscount = async () => {
  if (!discountFormRef.value) return
  
  try {
    await discountFormRef.value.validate()
    
    // 这里可以添加检查折扣值是否低于代理折扣值的逻辑
    // 假设代理折扣值为0.8，可以根据实际情况调整
    const agentDiscount = 0.8 // 这个值应该从用户信息或配置中获取
    if (discountForm.discount < agentDiscount) {
      ElMessage.warning(`折扣值不能低于代理折扣值 ${agentDiscount}`)
      return
    }
    
    discountLoading.value = true
    const response = await setUserDiscount(discountForm.phone, discountForm.discount.toString())
    
    if (response.Code === 1000) {
      ElMessage.success(response.Msg || '设置成功')
      discountDialogVisible.value = false
      // 刷新用户列表
      fetchUserList()
    } else {
      ElMessage.error(response.Msg || '设置失败')
    }
  } catch (error) {
    console.error('设置折扣失败:', error)
    ElMessage.error('设置折扣失败')
  } finally {
    discountLoading.value = false
  }
}

// 移除了getStatusType函数，因为不再需要状态映射

// 生命周期
onMounted(() => {
  fetchUserList()
})
</script>

<style lang="scss" scoped>
.agent-users-container {
  padding: 20px;
  
  .users-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    
    :deep(.el-card__header) {
      padding: 20px;
      border-bottom: 1px solid #ebeef5;
      
      .card-header {
        h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #303133;
        }
        
        p {
          margin: 0;
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
  
  .users-content {
    padding: 20px;
    
    .filter-card {
      margin-bottom: 20px;
      
      :deep(.el-card__body) {
        padding: 16px;
      }
      
      .filter-form {
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    
    .stats-row {
      margin-bottom: 24px;
      
      .stat-item {
        display: flex;
        align-items: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
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
            font-weight: 600;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 14px;
            opacity: 0.9;
          }
        }
        
        &:nth-child(2) .stat-item {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        &:nth-child(3) .stat-item {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        &:nth-child(4) .stat-item {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }
    }
    
    .table-card {
      :deep(.el-card__header) {
        padding: 16px 20px;
        border-bottom: 1px solid #ebeef5;
        
        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }
      
      .table-container {
        .amount {
          color: #67c23a;
          font-weight: 500;
        }
        
        .balance {
          color: #409eff;
          font-weight: 500;
        }
        
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      }
    }
  }
}

.user-detail {
  :deep(.el-descriptions__label) {
    font-weight: 600;
  }
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

// 响应式设计
@media (max-width: 768px) {
  .agent-users-container {
    padding: 10px;
    
    .users-content {
      padding: 10px;
      
      .filter-form {
        :deep(.el-form-item) {
          display: block;
          margin-bottom: 16px;
          
          .el-form-item__content {
            margin-left: 0 !important;
          }
        }
      }
      
      .stats-row {
        .stat-item {
          margin-bottom: 16px;
        }
      }
      
      .table-container {
        overflow-x: auto;
      }
    }
  }
}
</style>