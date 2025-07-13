<template>
  <div class="expired-business">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>过期业务</span>
          <div class="header-actions">
            <el-button type="danger" @click="handleBatchDelete" :disabled="selectedRows.length === 0">
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-form :model="searchForm" inline>
          <el-form-item label="游戏">
            <el-select
              v-model="searchForm.game"
              placeholder="请选择游戏"
              clearable
              style="width: 200px"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="game in gameList"
                :key="game.Game"
                :label="game.Game"
                :value="game.Game"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="区域">
            <el-select
              v-model="searchForm.area"
              placeholder="请选择区域"
              clearable
              style="width: 200px"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="area in areaList"
                :key="area.Area"
                :label="area.Area"
                :value="area.Area"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="分组">
            <el-select
              v-model="searchForm.group"
              placeholder="请选择分组"
              clearable
              style="width: 120px"
            >
              <el-option label="全部" value="" />
              <el-option
                v-for="group in groupList"
                :key="group"
                :label="group"
                :value="group"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="IP/链接">
            <el-input
              v-model="searchForm.screenNode"
              placeholder="请输入IP或链接地址"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          
          <el-form-item label="过期时间">
            <el-select
              v-model="searchForm.expiredDays"
              placeholder="过期天数"
              clearable
              style="width: 120px"
            >
              <el-option label="1天内" value="1" />
              <el-option label="3天内" value="3" />
              <el-option label="7天内" value="7" />
              <el-option label="30天内" value="30" />
              <el-option label="全部" value="" />
            </el-select>
          </el-form-item>
          
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
        </el-form>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-area">
        <el-row :gutter="16">
          <el-col :span="6">
            <div class="stat-card expired">
              <div class="stat-number">{{ stats.expired }}</div>
              <div class="stat-label">已过期</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card expiring">
              <div class="stat-number">{{ stats.expiring }}</div>
              <div class="stat-label">即将释放</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card total">
              <div class="stat-number">{{ stats.total }}</div>
              <div class="stat-label">总计</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card selected">
              <div class="stat-number">{{ selectedRows.length }}</div>
              <div class="stat-label">已选择</div>
            </div>
          </el-col>
        </el-row>
      </div>
      
      <!-- 表格区域 -->
      <div class="table-area">
        <el-table
          :data="tableData"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          stripe
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="Game" label="游戏" width="120" />
          <el-table-column prop="Area" label="地区" width="100" />
          <el-table-column prop="Group" label="分组" width="80" />
          <el-table-column prop="Isp" label="线路" width="60" />
          <el-table-column prop="IpAddress" label="节点IP" width="125" />
          <el-table-column label="代理信息" width="200">
            <template #default="{ row }">
              <div class="proxy-info">
                <div>用户: {{ row.User || `user${row.Id}` }}</div>
                <div>密码: {{ row.Pass || `pass${row.Id}` }}</div>
                <div>链接: {{ row.Connect_IpAddress || row.IpAddress }}</div>
                <div class="proxy-port">端口: {{ row.Port || '8080' }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="StartTime" label="开始时间" width="120" />
          <el-table-column prop="EndTime" label="到期时间" width="120" />
          <el-table-column label="过期天数" width="100">
            <template #default="{ row }">
              <el-tag :type="getExpiredTagType(row.ExpiredDays)" size="small">
                {{ row.ExpiredDays }}天
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template #default="{ row }">
              <el-tag type="danger" size="small">已过期</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button size="small" type="danger" @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-area">
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
      </div>
    </el-card>
    

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Delete
} from '@element-plus/icons-vue'
import { getNodeExpiredData, deleteNode } from '@/api/auth'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const selectedRows = ref([])
const gameList = ref([])
const areaList = ref([])
const groupList = ref([])

// 搜索表单
const searchForm = reactive({
  game: '',
  area: '',
  group: '',
  screenNode: '',
  expiredDays: ''
})

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 统计数据
const stats = computed(() => {
  const expired = tableData.value.filter(item => item.ExpiredDays > 0).length
  const expiring = tableData.value.filter(item => item.ExpiredDays <= 3 && item.ExpiredDays >= 0).length
  return {
    expired,
    expiring,
    total: tableData.value.length,
    selected: selectedRows.value.length
  }
})



// 获取过期标签类型
const getExpiredTagType = (days) => {
  if (days <= 0) return 'success'
  if (days <= 3) return 'warning'
  if (days <= 7) return 'danger'
  return 'info'
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    game: '',
    area: '',
    group: '',
    screenNode: '',
    expiredDays: ''
  })
  pagination.page = 1
  fetchData()
}

// 分页变化
const handleSizeChange = (size) => {
  pagination.size = size
  fetchData()
}

const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}



// 删除操作
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除游戏 ${row.Game} 地区 ${row.Area} 的过期业务吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 调用删除API
      const response = await deleteNode({
        Id: [row.Id.toString()]
      })
      
      if (response.Code === 1000) {
        ElMessage.success('删除成功')
        fetchData()
      } else {
        ElMessage.error(response.Msg || '删除失败')
      }
    } catch (error) {
      console.error('删除节点失败:', error)
      ElMessage.error('删除失败')
    }
  })
}



// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的业务')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个过期业务吗？`,
    '确认批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 调用批量删除API
      const nodeIds = selectedRows.value.map(row => row.Id.toString())
      const response = await deleteNode({
        Id: nodeIds
      })
      
      if (response.Code === 1000) {
        ElMessage.success('批量删除成功')
        selectedRows.value = []
        fetchData()
      } else {
        ElMessage.error(response.Msg || '批量删除失败')
      }
    } catch (error) {
      console.error('批量删除节点失败:', error)
      ElMessage.error('批量删除失败')
    }
  })
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 调用真实的API获取过期业务数据
    const params = {
      page: pagination.page,
      pageSize: pagination.size
    }
    
    // 添加搜索条件
    if (searchForm.game) {
      params.game = searchForm.game
    }
    if (searchForm.area) {
      params.area = searchForm.area
    }
    if (searchForm.group) {
      params.group = searchForm.group
    }
    if (searchForm.screenNode) {
      params.ScreenNode = searchForm.screenNode
    }
    if (searchForm.expiredDays) {
      params.expiredDays = searchForm.expiredDays
    }
    
    const response = await getNodeExpiredData(params)
    
    if (response.Code === 1000) {
      // 处理API返回的数据
      const apiData = response.List || []
      
      // 计算过期天数并添加到数据中
      const processedData = apiData.map(item => {
        const endTime = new Date(item.EndTime)
        const now = new Date()
        const diffTime = endTime - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        return {
          ...item,
          ExpiredDays: diffDays > 0 ? 0 : Math.abs(diffDays), // 已过期的天数
          User: `user${item.Id}`, // 生成用户名
          Pass: `pass${item.Id}`, // 生成密码
          Connect_IpAddress: item.IpAddress, // 连接IP与节点IP相同
          Port: '8080' // 默认端口
        }
      })
      
      tableData.value = processedData
      pagination.total = response.RowCount || 0
      
      // 更新筛选选项
      const uniqueGames = [...new Set(processedData.map(item => item.Game))]
      const uniqueAreas = [...new Set(processedData.map(item => item.Area))]
      const uniqueGroups = [...new Set(processedData.map(item => item.Group).filter(group => group))]
      
      gameList.value = uniqueGames.map(game => ({ Game: game }))
      areaList.value = uniqueAreas.map(area => ({ Area: area }))
      groupList.value = uniqueGroups
    } else {
      ElMessage.error(response.Msg || '获取数据失败')
      tableData.value = []
      pagination.total = 0
    }
    
  } catch (error) {
    console.error('获取过期业务数据失败:', error)
    ElMessage.error('获取数据失败')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.expired-business {
  .page-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
  
  .search-area {
    margin-bottom: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .stats-area {
    margin-bottom: 20px;
    
    .stat-card {
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      color: #fff;
      
      .stat-number {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 8px;
      }
      
      .stat-label {
        font-size: 14px;
        opacity: 0.9;
      }
      
      &.expired {
        background: linear-gradient(135deg, #f56565, #e53e3e);
      }
      
      &.expiring {
        background: linear-gradient(135deg, #ed8936, #dd6b20);
      }
      
      &.total {
        background: linear-gradient(135deg, #4299e1, #3182ce);
      }
      
      &.selected {
        background: linear-gradient(135deg, #48bb78, #38a169);
      }
    }
  }
  
  .table-area {
    .proxy-info {
      font-size: 12px;
      line-height: 1.4;
      
      .proxy-port {
        color: #409eff;
        font-weight: 500;
      }
    }
  }
  
  .pagination-area {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  

}
</style>