<template>
  <div class="logs">
    <!-- 筛选器 -->
    <el-card class="filter-card">
      <el-form :model="filterForm" inline class="filter-form">
        <el-form-item label="操作类型">
          <el-select 
            v-model="filterForm.type" 
            placeholder="全部类型" 
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="登录" value="login" />
            <el-option label="登出" value="logout" />
            <el-option label="密码修改" value="password_change" />
            <el-option label="资料更新" value="profile_update" />
            <el-option label="安全设置" value="security_setting" />
            <el-option label="财务操作" value="finance_operation" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间范围">
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
        
        <el-form-item label="IP地址">
          <el-input
            v-model="filterForm.ip"
            placeholder="请输入IP地址"
            clearable
            style="width: 150px"
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
          <el-button type="success" @click="handleExport" :loading="exporting">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon login">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.totalLogins }}</div>
              <div class="stat-label">总登录次数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon security">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.securityActions }}</div>
              <div class="stat-label">安全操作</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon profile">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.profileUpdates }}</div>
              <div class="stat-label">资料更新</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon finance">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.financeOperations }}</div>
              <div class="stat-label">财务操作</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 日志列表 -->
    <el-card class="logs-card">
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <div class="header-actions">
            <el-tooltip content="刷新">
              <el-button 
                circle 
                @click="handleRefresh" 
                :loading="loading"
              >
                <el-icon><Refresh /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </template>
      
      <div class="logs-list" v-loading="loading">
        <div 
          v-for="log in logs" 
          :key="log.id"
          class="log-item"
          @click="showLogDetail(log)"
        >
          <div class="log-icon">
            <el-icon 
              :class="getLogIconClass(log.type)"
            >
              <component :is="getLogIcon(log.type)" />
            </el-icon>
          </div>
          
          <div class="log-content">
            <div class="log-header">
              <div class="log-title">{{ log.title }}</div>
              <div class="log-time">{{ log.time }}</div>
            </div>
            
            <div class="log-description">{{ log.description }}</div>
            
            <div class="log-meta">
              <el-tag 
                :type="getLogTypeColor(log.type)"
                size="small"
              >
                {{ getLogTypeName(log.type) }}
              </el-tag>
              
              <span class="log-ip">
                <el-icon><Monitor /></el-icon>
                {{ log.ip }}
              </span>
            </div>
          </div>
          
          <div class="log-status">
            <el-tag 
              :type="log.status === 'success' ? 'success' : 'danger'"
              size="small"
            >
              {{ log.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </div>
        </div>
        
        <!-- 空状态 -->
        <el-empty 
          v-if="!loading && logs.length === 0" 
          description="暂无操作日志"
          :image-size="100"
        />
      </div>
      
      <!-- 分页 -->
      <div class="pagination-wrapper" v-if="logs.length > 0">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 日志详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="操作日志详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedLog" class="log-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="操作类型">
            <el-tag 
              :type="getLogTypeColor(selectedLog.type)"
              size="small"
            >
              {{ getLogTypeName(selectedLog.type) }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="操作标题">
            {{ selectedLog.title }}
          </el-descriptions-item>
          
          <el-descriptions-item label="操作描述">
            {{ selectedLog.description }}
          </el-descriptions-item>
          
          <el-descriptions-item label="操作时间">
            {{ selectedLog.time }}
          </el-descriptions-item>
          
          <el-descriptions-item label="IP地址">
            {{ selectedLog.ip }}
          </el-descriptions-item>
          

          
          <el-descriptions-item label="操作状态">
            <el-tag 
              :type="selectedLog.status === 'success' ? 'success' : 'danger'"
              size="small"
            >
              {{ selectedLog.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </el-descriptions-item>
          
          <el-descriptions-item label="详细信息" v-if="selectedLog.details">
            <pre class="log-details">{{ selectedLog.details }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getSysLog } from '@/api/auth'

// 响应式数据
const loading = ref(false)
const exporting = ref(false)
const detailDialogVisible = ref(false)
const selectedLog = ref(null)

// 筛选表单
const filterForm = reactive({
  type: '',
  dateRange: [],
  ip: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 统计数据
const stats = ref({
  totalLogins: 156,
  securityActions: 23,
  profileUpdates: 8,
  financeOperations: 45
})

// 日志列表
const logs = ref([])

// 获取日志图标
const getLogIcon = (type) => {
  const iconMap = {
    login: 'UserFilled',
    logout: 'SwitchButton',
    password_change: 'Lock',
    profile_update: 'Edit',
    security_setting: 'Lock',
    finance_operation: 'Money'
  }
  return iconMap[type] || 'InfoFilled'
}

// 获取日志图标样式类
const getLogIconClass = (type) => {
  const classMap = {
    login: 'icon-login',
    logout: 'icon-logout',
    password_change: 'icon-password',
    profile_update: 'icon-profile',
    security_setting: 'icon-security',
    finance_operation: 'icon-finance'
  }
  return classMap[type] || 'icon-default'
}

// 获取日志类型颜色
const getLogTypeColor = (type) => {
  const colorMap = {
    login: 'success',
    logout: 'info',
    password_change: 'warning',
    profile_update: 'primary',
    security_setting: 'danger',
    finance_operation: 'warning'
  }
  return colorMap[type] || 'info'
}

// 获取日志类型名称
const getLogTypeName = (type) => {
  const nameMap = {
    login: '登录',
    logout: '登出',
    password_change: '密码修改',
    profile_update: '资料更新',
    security_setting: '安全设置',
    finance_operation: '财务操作'
  }
  return nameMap[type] || '未知'
}

// 获取日志数据
const fetchLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }
    
    const response = await getSysLog(params)
    
    if (response.code === 1000) {
      // 转换API数据格式为组件需要的格式
      logs.value = response.list.map(item => ({
        id: item.id,
        type: getLogTypeFromDescription(item.log),
        title: item.log,
        description: item.log,
        time: item.time,
        ip: item.ip,
        location: '未知地区',
        device: 'Unknown',
        browser: 'Unknown',
        os: 'Unknown',
        status: 'success',
        details: JSON.stringify({
          originalLog: item.log,
          timestamp: item.time,
          ipAddress: item.ip
        }, null, 2)
      }))
      
      pagination.total = response.row_total
      pagination.currentPage = response.page_now
      
      // 更新统计数据
      updateStats()
    } else {
      ElMessage.error(response.msg || '获取日志失败')
    }
  } catch (error) {
    console.error('获取日志失败:', error)
    ElMessage.error('获取日志失败，请重试')
  } finally {
    loading.value = false
  }
}

// 根据日志描述判断日志类型
const getLogTypeFromDescription = (logDescription) => {
  if (logDescription.includes('登录')) {
    return 'login'
  } else if (logDescription.includes('注册')) {
    return 'profile_update'
  } else if (logDescription.includes('密码')) {
    return 'password_change'
  } else if (logDescription.includes('安全')) {
    return 'security_setting'
  } else if (logDescription.includes('财务') || logDescription.includes('充值') || logDescription.includes('提现') || logDescription.includes('转账')) {
    return 'finance_operation'
  } else if (logDescription.includes('登出') || logDescription.includes('退出')) {
    return 'logout'
  }
  return 'login' // 默认类型
}

// 更新统计数据
const updateStats = () => {
  const loginCount = logs.value.filter(log => log.type === 'login').length
  const securityCount = logs.value.filter(log => log.type === 'security_setting').length
  const profileCount = logs.value.filter(log => log.type === 'profile_update').length
  const financeCount = logs.value.filter(log => log.type === 'finance_operation').length
  
  stats.value = {
    totalLogins: loginCount,
    securityActions: securityCount,
    profileUpdates: profileCount,
    financeOperations: financeCount
  }
}

// 搜索日志
const handleSearch = () => {
  pagination.currentPage = 1
  fetchLogs()
}

// 重置筛选
const handleReset = () => {
  filterForm.type = ''
  filterForm.dateRange = []
  filterForm.ip = ''
  pagination.currentPage = 1
  fetchLogs()
}

// 刷新数据
const handleRefresh = () => {
  fetchLogs()
}

// 导出日志
const handleExport = async () => {
  exporting.value = true
  try {
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 创建CSV内容
    const headers = ['时间', '类型', '操作描述', 'IP地址']
    const csvContent = [
      headers.join(','),
      ...logs.value.map(log => [
        log.time,
        getLogTypeName(log.type),
        log.description,
        log.ip
      ].join(','))
    ].join('\n')
    
    // 下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `操作日志_${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('日志导出成功')
  } catch (error) {
    ElMessage.error('导出失败，请重试')
  } finally {
    exporting.value = false
  }
}

// 显示日志详情
const showLogDetail = (log) => {
  selectedLog.value = log
  detailDialogVisible.value = true
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  fetchLogs()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.currentPage = page
  fetchLogs()
}

// 组件挂载时加载数据
onMounted(() => {
  fetchLogs()
})
</script>

<style lang="scss" scoped>
.logs {
  .filter-card {
    margin-bottom: 20px;
    
    .filter-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  
  .stats-row {
    margin-bottom: 20px;
    
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .el-icon {
            font-size: 24px;
            color: #fff;
          }
          
          &.login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          &.security {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          
          &.profile {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
          
          &.finance {
            background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
          }
        }
        
        .stat-info {
          .stat-number {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
  
  .logs-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        display: flex;
        gap: 8px;
      }
    }
    
    .logs-list {
      .log-item {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 12px;
        background: #fafafa;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          background: #f0f9ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .log-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          .el-icon {
            font-size: 20px;
            color: #fff;
            
            &.icon-login {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 50%;
              padding: 10px;
            }
            
            &.icon-logout {
              background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
              border-radius: 50%;
              padding: 10px;
              color: #666;
            }
            
            &.icon-password {
              background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
              border-radius: 50%;
              padding: 10px;
              color: #666;
            }
            
            &.icon-profile {
              background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
              border-radius: 50%;
              padding: 10px;
            }
            
            &.icon-security {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              border-radius: 50%;
              padding: 10px;
            }
            
            &.icon-finance {
              background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
              border-radius: 50%;
              padding: 10px;
            }
            
            &.icon-default {
              background: linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%);
              border-radius: 50%;
              padding: 10px;
              color: #666;
            }
          }
        }
        
        .log-content {
          flex: 1;
          
          .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .log-title {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
            
            .log-time {
              font-size: 14px;
              color: #666;
            }
          }
          
          .log-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
            line-height: 1.5;
          }
          
          .log-meta {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
            
            .log-ip {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: #999;
              
              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
        
        .log-status {
          flex-shrink: 0;
        }
      }
    }
    
    .pagination-wrapper {
      margin-top: 20px;
      text-align: center;
    }
  }
  
  .log-detail {
    .log-details {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.5;
      max-height: 200px;
      overflow-y: auto;
    }
  }
}

@media (max-width: 768px) {
  .logs {
    .filter-card {
      .filter-form {
        .el-form-item {
          display: block;
          margin-bottom: 16px;
          
          .el-select,
          .el-input,
          .el-date-picker {
            width: 100% !important;
          }
        }
      }
    }
    
    .stats-row {
      .stat-card {
        margin-bottom: 12px;
        
        .stat-content {
          .stat-icon {
            width: 40px;
            height: 40px;
            
            .el-icon {
              font-size: 20px;
            }
          }
          
          .stat-info {
            .stat-number {
              font-size: 20px;
            }
            
            .stat-label {
              font-size: 12px;
            }
          }
        }
      }
    }
    
    .logs-card {
      .logs-list {
        .log-item {
          flex-direction: column;
          gap: 12px;
          
          .log-icon {
            align-self: flex-start;
          }
          
          .log-content {
            width: 100%;
            
            .log-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
            
            .log-meta {
              flex-direction: row;
              align-items: center;
              gap: 12px;
            }
          }
          
          .log-status {
            align-self: flex-end;
          }
        }
      }
    }
  }
}
</style>