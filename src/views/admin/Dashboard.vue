<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon user-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon active-icon">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.activeUsers }}</div>
            <div class="stat-label">活跃用户</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon order-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </div>
      </el-col>
      
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon revenue-icon">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-number">¥{{ stats.totalRevenue }}</div>
            <div class="stat-label">总收入</div>
          </div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-button type="text" size="small">查看详情</el-button>
            </div>
          </template>
          <div ref="userChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>收入统计</span>
              <el-button type="text" size="small">查看详情</el-button>
            </div>
          </template>
          <div ref="revenueChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近活动 -->
    <el-row :gutter="20" class="activity-row">
      <el-col :xs="24" :lg="16">
        <el-card class="activity-card">
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button type="text" size="small">查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in recentActivities"
              :key="activity.id"
              :timestamp="activity.time"
              :type="activity.type"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="8">
        <el-card class="quick-actions-card">
          <template #header>
            <span>快速操作</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" @click="$router.push('/admin/users')">
              <el-icon><User /></el-icon>
              用户管理
            </el-button>
            <el-button type="success" @click="handleAddUser">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
            <el-button type="warning" @click="$router.push('/admin/settings')">
              <el-icon><Setting /></el-icon>
              系统设置
            </el-button>
            <el-button type="info" @click="handleExportData">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// 图表引用
const userChartRef = ref()
const revenueChartRef = ref()

// 统计数据
const stats = ref({
  totalUsers: 1234,
  activeUsers: 856,
  totalOrders: 2468,
  totalRevenue: '125,680'
})

// 最近活动数据
const recentActivities = ref([
  {
    id: 1,
    content: '用户 张三 注册了账号',
    time: '2024-01-15 10:30',
    type: 'success'
  },
  {
    id: 2,
    content: '管理员 李四 修改了系统设置',
    time: '2024-01-15 09:15',
    type: 'warning'
  },
  {
    id: 3,
    content: '用户 王五 完成了订单支付',
    time: '2024-01-15 08:45',
    type: 'primary'
  },
  {
    id: 4,
    content: '系统自动备份数据完成',
    time: '2024-01-15 02:00',
    type: 'info'
  }
])

// 初始化用户增长图表
const initUserChart = () => {
  const chart = echarts.init(userChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230],
        itemStyle: {
          color: '#1890ff'
        }
      },
      {
        name: '活跃用户',
        type: 'line',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330],
        itemStyle: {
          color: '#52c41a'
        }
      }
    ],
    legend: {
      data: ['新增用户', '活跃用户']
    }
  }
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 初始化收入图表
const initRevenueChart = () => {
  const chart = echarts.init(revenueChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '收入来源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '产品销售' },
          { value: 735, name: '服务费用' },
          { value: 580, name: '广告收入' },
          { value: 484, name: '其他收入' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 快速操作
const handleAddUser = () => {
  ElMessage.info('添加用户功能开发中...')
}

const handleExportData = () => {
  ElMessage.info('数据导出功能开发中...')
}

// 组件挂载后初始化图表
onMounted(() => {
  nextTick(() => {
    initUserChart()
    initRevenueChart()
  })
})
</script>

<style lang="scss" scoped>
.dashboard {
  .stats-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      
      .el-icon {
        font-size: 24px;
        color: #fff;
      }
      
      &.user-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      
      &.active-icon {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      
      &.order-icon {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      
      &.revenue-icon {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
    
    .stat-content {
      .stat-number {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #666;
      }
    }
  }
  
  .charts-row {
    margin-bottom: 20px;
  }
  
  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .chart-container {
      height: 300px;
    }
  }
  
  .activity-row {
    .activity-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    
    .quick-actions-card {
      .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .el-button {
          justify-content: flex-start;
          
          .el-icon {
            margin-right: 8px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    .stat-card {
      padding: 15px;
      
      .stat-icon {
        width: 50px;
        height: 50px;
        margin-right: 12px;
        
        .el-icon {
          font-size: 20px;
        }
      }
      
      .stat-content {
        .stat-number {
          font-size: 20px;
        }
      }
    }
    
    .chart-container {
      height: 250px;
    }
  }
}
</style>