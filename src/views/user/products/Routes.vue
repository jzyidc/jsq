<template>
  <div class="routes-page">
    <div class="page-header">
      <!-- 页面标题 -->
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><Connection /></el-icon>
            项目线路购买
          </h1>
          <p class="page-subtitle">选择适合您的线路节点，享受稳定高速的网络服务</p>
        </div>
        <div class="stats-info">
          <div class="stat-item">
            <span class="stat-number">{{ filteredNodes.length }}</span>
            <span class="stat-label">可用节点</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ orderList.length }}</span>
            <span class="stat-label">已选择</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="content-layout">
        <!-- 左侧地区选择 -->
        <div class="left-sidebar">
          <el-card class="region-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Location /></el-icon>
                <span>地区选择</span>
              </div>
            </template>
            
            <div class="region-buttons-vertical">
              <el-button 
                v-for="item in regions" 
                :key="item" 
                :type="selectedRegion === item ? 'primary' : 'default'" 
                :class="{ 'region-active': selectedRegion === item }"
                class="region-btn-vertical"
                @click="selectedRegion = item"
              >
                <div class="region-btn-content">
                  <span class="region-name">{{ item }}</span>
                  <span class="region-count">({{ regionNodeCounts[item] || 0 }})</span>
                </div>
              </el-button>
            </div>
          </el-card>
        </div>
        
        <!-- 右侧主要内容 -->
        <div class="right-content">
          <!-- 筛选器卡片 -->
          <el-card class="filter-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Filter /></el-icon>
                <span>筛选条件</span>
              </div>
            </template>
            
            <!-- 主要筛选条件 -->
            <div class="filter-section">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="filter-item">
                    <label class="filter-label">游戏类型</label>
                    <el-select v-model="selectedGameType" class="filter-select" @change="handleGameTypeChange">
                      <el-option label="全部" value="" />
                      <el-option label="端游" value="1" />
                      <el-option label="手游" value="2" />
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="filter-item">
                    <label class="filter-label">购买项目</label>
                    <el-select v-model="selectedProduct" class="filter-select" placeholder="请选择游戏" @change="handleProductChange">
                      <el-option v-for="item in gameList" :key="item.Id" :label="item.Game" :value="item.Game" />
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="filter-item">
                    <label class="filter-label">购买时长</label>
                    <el-select v-model="selectedDuration" class="filter-select">
                      <el-option v-for="item in durations" :key="item" :label="item" :value="item" />
                    </el-select>
                  </div>
                </el-col>
              </el-row>
            </div>
            
            <!-- 高级筛选条件 -->
            <el-divider><el-icon><Setting /></el-icon>高级筛选</el-divider>
            <div class="filter-section">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="filter-item">
                    <label class="filter-label">运营商</label>
                    <el-radio-group v-model="selectedOperator" class="filter-radio">
                      <el-radio-button v-for="item in operators" :key="item" :label="item" />
                    </el-radio-group>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="filter-item">
                    <label class="filter-label">线路类型</label>
                    <el-radio-group v-model="selectedLineType" class="filter-radio">
                       <el-radio-button v-for="item in lineTypes" :key="item" :label="item" />
                     </el-radio-group>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>

          <!-- 节点分配卡片 -->
          <el-card class="assign-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Setting /></el-icon>
                <span>智能分配</span>
              </div>
            </template>
            
            <div class="assign-content">
              <div class="assign-input">
                <label class="assign-label">需要购买的节点数量：</label>
                <el-input-number 
                  v-model="nodeCount" 
                  :min="1" 
                  :max="20" 
                  class="node-counter"
                />
                <el-button type="primary" @click="autoAssignNodes" class="assign-btn">
                   <el-icon><Star /></el-icon>
                   智能分配
                 </el-button>
                 <el-button type="warning" @click="resetAssignment" class="assign-btn" :disabled="orderList.length === 0">
                   <el-icon><Close /></el-icon>
                   重置分配
                 </el-button>
              </div>
              <div class="assign-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>系统将根据您的需求自动选择最优的节点组合</span>
              </div>
            </div>
          </el-card>

          <!-- 节点列表 -->
          <el-card class="nodes-card" shadow="hover" v-loading="isLoading">
            <template #header>
              <div class="card-header">
                <el-icon><Monitor /></el-icon>
                <span>可用节点 ({{ allFilteredNodes.length }})</span>
                <div class="header-actions">
                  <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
                </div>
              </div>
            </template>
            
            <div class="node-grid">
              <div 
                v-for="node in filteredNodes" 
                :key="node.id" 
                class="node-item"
                :class="{ 'node-selected': orderList.find(n => n.id === node.id) }"
              >
                <div class="node-header">
                  <div class="node-name">{{ node.name }}</div>
                  <div class="node-status">
                    <el-tag :type="node.stock === '99+' ? 'success' : 'warning'" size="small">
                      {{ node.stock === '99+' ? '充足' : '紧张' }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="node-details">
                  <div class="detail-item" v-if="node.operator">
                    <el-icon><Connection /></el-icon>
                    <span>{{ node.operator }}</span>
                  </div>
                  <div class="detail-item" v-if="node.region">
                    <el-icon><Location /></el-icon>
                    <span>{{ node.region }}</span>
                  </div>
                  <div class="detail-item">
                    <el-icon><Box /></el-icon>
                    <span>剩余: {{ node.stock }}</span>
                  </div>
                  <div class="detail-item" v-if="node.type">
                    <el-icon><Star /></el-icon>
                    <span>{{ node.type }}</span>
                  </div>
                  <div class="detail-item" v-if="node.stability">
                    <el-icon><Check /></el-icon>
                    <span>{{ node.stability }}</span>
                  </div>
                </div>
                
                <div class="node-footer">
                  <div class="node-price">
                    <span class="price-label">{{ getPriceLabelByDuration(selectedDuration) }}</span>
                    <span class="price-value">￥{{ getPriceByDuration(node, selectedDuration) }}</span>
                  </div>
                  
                  <!-- 数量选择器 -->
                  <div class="quantity-selector" v-if="!orderList.find(n => n.id === node.id)">
                    <span class="quantity-label">数量：</span>
                    <el-input-number 
                      v-model="node.selectedQuantity" 
                      :min="1" 
                      :max="20" 
                      size="small"
                      class="quantity-input-node"
                    />
                  </div>
                  
                  <el-button 
                    :type="orderList.find(n => n.id === node.id) ? 'success' : 'primary'"
                    :icon="orderList.find(n => n.id === node.id) ? 'Check' : 'Plus'"
                    @click="addToOrder(node)"
                    class="add-btn"
                  >
                    {{ orderList.find(n => n.id === node.id) ? '已添加' : '加入订单' }}
                  </el-button>
                </div>
              </div>
            </div>
            
            <!-- 分页组件 -->
            <div class="pagination-wrapper" v-if="totalPages > 1">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="allFilteredNodes.length"
                layout="prev, pager, next, jumper"
                :hide-on-single-page="false"
                small
                @current-change="handlePageChange"
              />
            </div>
          </el-card>
        </div>
      </div>
    </div>
    <div 
      class="order-summary" 
      :class="{ 'order-summary-hidden': isSummaryHidden }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- 隐藏状态下的图标显示 -->
      <div v-if="isSummaryHidden" class="summary-icon" @click="toggleSummary">
        <el-icon class="cart-icon"><ShoppingCart /></el-icon>
        <div class="icon-badge" v-if="orderList.length > 0">{{ orderList.length }}</div>
        <div class="icon-tooltip">订单汇总</div>
      </div>
      
      <!-- 正常状态下的卡片显示 -->
      <el-card v-else class="summary-card" shadow="always">
        <template #header>
          <div class="summary-header">
            <el-icon><ShoppingCart /></el-icon>
            <span>订单汇总</span>
            <el-button 
              type="text" 
              class="toggle-btn"
              @click="toggleSummary"
            >
              <el-icon>
                <ArrowRight />
              </el-icon>
            </el-button>
          </div>
        </template>
        
        <div class="summary-content">
          <div class="summary-item">
            <span class="item-label">选择项目：</span>
            <span class="item-value">{{ selectedProduct }}</span>
          </div>
          
          <div class="summary-item">
            <span class="item-label">购买时长：</span>
            <span class="item-value">{{ selectedDuration }}</span>
          </div>
          
          <div class="summary-item assign-group-item">
            <span class="item-label">分组：</span>
            <el-input 
              v-model="assignGroup" 
              placeholder="0000-9999"
              maxlength="4"
              class="assign-group-input"
              @input="validateAssignGroup"
            />
          </div>
          
          <el-divider />
          
          <div class="order-list">
            <div class="list-header">已选线路：</div>
            <div v-if="orderList.length === 0" class="empty-order">
              <el-icon><Box /></el-icon>
              <span>暂未选择任何线路</span>
            </div>
            <div v-else class="order-items">
              <div v-for="item in orderList" :key="item.id" class="order-item">
                <div class="order-info">
                  <span class="order-name">{{ item.name }}</span>
                  <div class="quantity-control">
                    <span class="quantity-label">数量：</span>
                    <el-input-number 
                      v-model="item.quantity" 
                      :min="1" 
                      :max="20" 
                      size="small"
                      class="quantity-input"
                      @change="updateOrderQuantity(item)"
                    />
                  </div>
                </div>
                <div class="order-actions">
                  <span class="order-price">￥{{ (getPriceByDuration(item, selectedDuration) * item.quantity).toFixed(2) }}</span>
                  <el-button 
                    type="text" 
                    size="small" 
                    @click="removeFromOrder(item)"
                    class="remove-btn"
                  >
                    <el-icon><Close /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          
          <el-divider />
          
          <div class="summary-total">
            <div class="total-item">
              <span class="total-label">总数量：</span>
              <span class="total-value">{{ totalQuantity }} 个</span>
            </div>
            <div class="total-item price-total">
              <span class="total-label">需支付：</span>
              <span class="total-price">￥{{ totalPrice.toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="balance-info">
            <span class="balance-label">账户余额：</span>
            <span class="balance-value">￥{{ (userStore.userInfo.balance || 0).toFixed(2) }}</span>
            <el-link type="primary" :underline="false" class="recharge-link" @click="handleRecharge">
              <el-icon><CreditCard /></el-icon>
              去充值
            </el-link>
          </div>
          
          <el-button 
            type="primary" 
            size="large"
            class="pay-btn"
            :disabled="orderList.length === 0"
            @click="handlePayment"
          >
            <el-icon><Money /></el-icon>
            立即支付
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, shallowRef, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getGameData, getAreaData, buyNode } from '@/api/auth'
import { useUserStore } from '@/store/user'
import {
  Connection,
  Filter,
  Setting,
  Location,
  Star,
  InfoFilled,
  Monitor,
  Box,
  Check,
  Plus,
  ShoppingCart,
  Close,
  CreditCard,
  Money,
  ArrowRight,
  ArrowLeft
} from '@element-plus/icons-vue'

// 游戏数据
const products = ref([])
const gameList = ref([])
const durations = ['一天', '一周', '一个月', '三个月', '半年', '一年']
const operators = ['全部', '移动', '电信', '多线']
const lineTypes = ref(['全部'])

const regions = ['全部', '福建', '四川', '广东', '河北', '江苏', '陕西', '湖南', '甘肃', '海南', '山西', '云南', '青海', '吉林', '广西', '黑龙江', '宁夏', '西藏', '辽宁', '安徽', '直辖市', '山东', '河南', '贵州', '浙江', '内蒙古', '江西', '湖北']

const selectedGameType = ref('')
const selectedProduct = ref('')
const selectedDuration = ref('一个月')
const selectedOperator = ref('全部')
const selectedLineType = ref('全部')
const selectedCountry = ref('中国')
const selectedRegion = ref('全部')
const nodeCount = ref(10)
const isSummaryHidden = ref(false)
const assignGroup = ref('0000')

// 路由实例
const router = useRouter()

// 用户store实例
const userStore = useUserStore()

// 订单隐藏优化：添加自动隐藏逻辑
const autoHideTimer = ref(null)
const isHovering = ref(false)

// 自动隐藏订单面板（5秒后）
const startAutoHide = () => {
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
  }
  autoHideTimer.value = setTimeout(() => {
    if (!isHovering.value && orderList.value.length === 0) {
      isSummaryHidden.value = true
    }
  }, 5000)
}

// 鼠标悬停时取消自动隐藏
const handleMouseEnter = () => {
  isHovering.value = true
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
  if (orderList.value.length === 0) {
    startAutoHide()
  }
}

// 使用 shallowRef 优化大数组性能
const allNodes = shallowRef([])

// 分页相关变量
const currentPage = ref(1)
const pageSize = ref(20) // 每页显示20个节点
const isLoading = ref(false)

// 数据缓存机制，避免重复API调用
const dataCache = ref(new Map())

// 防抖定时器
let debounceTimer = null

// 防抖函数
const debounce = (func, delay) => {
  return (...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 生成缓存键
const getCacheKey = (gameName, operator, lineType) => {
  return `${gameName}_${operator || 'all'}_${lineType || 'all'}`
}

// 过滤后的所有节点（不分页）
const allFilteredNodes = computed(() => {
  return allNodes.value.filter(node => {
    const opMatch = selectedOperator.value === '全部' || node.operator === selectedOperator.value
    
    // 地区匹配逻辑优化：支持省份名称的模糊匹配
    let regionMatch = selectedRegion.value === '全部'
    if (!regionMatch && selectedRegion.value && node.region) {
      // 如果选择的地区包含在节点的省份中，或者节点的省份包含选择的地区，则匹配
      regionMatch = node.region.includes(selectedRegion.value) || selectedRegion.value.includes(node.region)
    }
    
    const typeMatch = selectedLineType.value === '全部' || node.type === selectedLineType.value
    
    return opMatch && regionMatch && typeMatch
  })
})

// 当前页显示的节点（分页后）
const filteredNodes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allFilteredNodes.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(allFilteredNodes.value.length / pageSize.value)
})

// 计算每个地区的可用节点数量
// 性能优化：此计算属性只依赖于allNodes，不依赖于selectedRegion
// 这样切换地区时不会重新计算，提升性能
const regionNodeCounts = computed(() => {
  const counts = {}
  regions.forEach(region => {
    if (region === '全部') {
      counts[region] = allNodes.value.length
    } else {
      counts[region] = allNodes.value.filter(node => {
        return node.region && (node.region.includes(region) || region.includes(node.region))
      }).length
    }
  })
  return counts
})

const orderList = ref([])
const addToOrder = (node) => {
  if (!orderList.value.find(n => n.id === node.id)) {
    // 使用节点上选择的数量，如果没有选择则默认为1
    const quantity = node.selectedQuantity || 1
    const nodeWithQuantity = { ...node, quantity: quantity }
    orderList.value.push(nodeWithQuantity)
    ElMessage.success(`已添加 ${node.name} 到订单，数量：${quantity}`)
    // 添加节点时显示订单面板
    isSummaryHidden.value = false
    // 取消自动隐藏
    if (autoHideTimer.value) {
      clearTimeout(autoHideTimer.value)
    }
  } else {
    ElMessage.warning('该节点已在订单中')
  }
}

const removeFromOrder = (node) => {
  const index = orderList.value.findIndex(n => n.id === node.id)
  if (index > -1) {
    orderList.value.splice(index, 1)
    ElMessage.info(`已从订单中移除 ${node.name}`)
    // 如果订单为空，启动自动隐藏
    if (orderList.value.length === 0 && !isHovering.value) {
      startAutoHide()
    }
  }
}

// 根据购买时长获取价格
const getPriceByDuration = (node, duration) => {
  if (!node.priceInfo) return node.price
  
  switch (duration) {
    case '一天':
      return node.priceInfo.day
    case '一周':
      return node.priceInfo.week
    case '一个月':
      return node.priceInfo.month
    case '三个月':
      return node.priceInfo.threeMonth
    case '半年':
      return node.priceInfo.sixMonth
    case '一年':
      return node.priceInfo.year
    default:
      return node.priceInfo.month
  }
}

// 根据购买时长获取价格标签
const getPriceLabelByDuration = (duration) => {
  switch (duration) {
    case '一天':
      return '日付价格'
    case '一周':
      return '周付价格'
    case '一个月':
      return '月付价格'
    case '三个月':
      return '季付价格'
    case '半年':
      return '半年价格'
    case '一年':
      return '年付价格'
    default:
      return '月付价格'
  }
}

const totalPrice = computed(() => {
  return orderList.value.reduce((sum, node) => {
    return sum + (getPriceByDuration(node, selectedDuration.value) * (node.quantity || 1))
  }, 0)
})

const totalQuantity = computed(() => {
  return orderList.value.reduce((sum, node) => {
    return sum + (node.quantity || 1)
  }, 0)
})

// 更新订单项数量
const updateOrderQuantity = (item) => {
  // 确保数量在有效范围内
  if (item.quantity < 1) {
    item.quantity = 1
  } else if (item.quantity > 20) {
    item.quantity = 20
  }
  ElMessage.info(`已更新 ${item.name} 的数量为 ${item.quantity}`)
}

const autoAssignNodes = () => {
  // 根据节点剩余可用数量进行智能分配，使用所有过滤后的节点而不仅仅是当前页
  const availableNodes = allFilteredNodes.value
    .filter(node => {
      // 过滤掉库存为0或无效的节点
      if (node.stock === '99+') return true // '99+'表示库存充足
      const stock = parseInt(node.stock)
      return !isNaN(stock) && stock > 0
    })
    .sort((a, b) => {
      // 按剩余可用数量降序排序，优先分配库存多的节点
      // '99+'视为最高优先级（999）
      const stockA = a.stock === '99+' ? 999 : (parseInt(a.stock) || 0)
      const stockB = b.stock === '99+' ? 999 : (parseInt(b.stock) || 0)
      return stockB - stockA
    })
    .slice(0, nodeCount.value)
    .map(node => ({ ...node, quantity: 1 })) // 为每个节点添加quantity属性
  
  orderList.value = availableNodes
  ElMessage.success(`已智能分配 ${availableNodes.length} 个节点（按库存量优先）`)
  // 自动分配后显示订单面板
  isSummaryHidden.value = false
  // 取消自动隐藏
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
  }
}

const handlePayment = async () => {
  if (orderList.value.length === 0) {
    ElMessage.warning('请先选择要购买的节点')
    return
  }
  
  if (!selectedProduct.value) {
    ElMessage.warning('请先选择购买项目')
    return
  }
  
  // 检查余额是否足够
  if (userStore.userInfo.balance < totalPrice.value) {
    ElMessage.warning('账户余额不足，请先充值')
    return
  }
  
  try {
    ElMessage.info('正在处理支付请求...')
    
    // 构建购买信息数组
    const buyInfo = orderList.value.map(node => ({
      area: node.name, // 使用节点名称作为区域
      quantity: node.quantity.toString() // 使用用户设置的数量
    }))
    
    // 调用购买接口
    const response = await buyNode({
      BuyGame: selectedProduct.value, // 购买游戏
      BuyTime: selectedDuration.value, // 购买时长
      BuyInfo: buyInfo, // 购买信息数组
      AssignGroup: assignGroup.value // 用户自定义分组
    })
    
    if (response.Code === 1000) {
      // 显示成功消息，包含订单号信息
      const successMsg = response.OrderNumber 
        ? `支付成功！订单号：${response.OrderNumber}` 
        : '支付成功！节点已添加到您的账户'
      ElMessage.success(successMsg)
      
      // 如果返回了新的余额，直接更新用户信息中的余额
      if (response.Balance !== undefined) {
        userStore.updateUserInfo({ balance: response.Balance })
      } else {
        // 否则刷新完整的用户信息
        await userStore.getUserInfoAction()
      }
      
      // 清空订单
      orderList.value = []
      
      // 启动自动隐藏
      if (!isHovering.value) {
        startAutoHide()
      }
      
      // 支付完成后自动跳转到业务列表页面
      setTimeout(() => {
        router.push('/user/business/list')
      }, 1500) // 延迟1.5秒跳转，让用户看到成功消息
    } else {
      ElMessage.error(response.Msg || '支付失败，请重试')
    }
  } catch (error) {
    ElMessage.error('支付失败，请检查网络连接后重试')
  }
}

// 处理充值按钮点击
const handleRecharge = () => {
  router.push('/user/recharge')
}

// 重置分配
const resetAssignment = () => {
  orderList.value = []
  ElMessage.info('已重置分配，订单已清空')
  // 重置后启动自动隐藏
  if (!isHovering.value) {
    startAutoHide()
  }
}

// 验证分组编号
const validateAssignGroup = (value) => {
  // 只允许数字输入
  const numericValue = value.replace(/[^0-9]/g, '')
  
  // 限制长度为4位
  if (numericValue.length > 4) {
    assignGroup.value = numericValue.slice(0, 4)
  } else {
    assignGroup.value = numericValue
  }
  
  // 确保在0000-9999范围内
  const num = parseInt(assignGroup.value || '0')
  if (num > 9999) {
    assignGroup.value = '9999'
  }
}

const toggleSummary = () => {
  isSummaryHidden.value = !isSummaryHidden.value
  // 手动切换时取消自动隐藏
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
  }
  // 如果手动隐藏且订单为空，不启动自动隐藏
  // 如果手动显示，也不启动自动隐藏
}

// 获取游戏数据
const fetchGameData = async (type = '') => {
  try {
    const response = await getGameData(type)
    if (response.Code === 1000 && response.List) {
      gameList.value = response.List
      // 重置选中的游戏
      selectedProduct.value = ''
      // 设置默认选中第一个游戏
      if (gameList.value.length > 0) {
        selectedProduct.value = gameList.value[0].Game
        // 获取第一个游戏的节点数据
        fetchAreaData()
      }
    } else {
      ElMessage.error('获取游戏数据失败')
    }
  } catch (error) {
    ElMessage.error('获取游戏数据失败')
  }
}

// 获取区域节点数据
const fetchAreaData = async () => {
  if (!selectedProduct.value) {
    return
  }
  
  // 检查缓存
  const cacheKey = getCacheKey(selectedProduct.value, selectedOperator.value, selectedLineType.value)
  if (dataCache.value.has(cacheKey)) {
    allNodes.value = dataCache.value.get(cacheKey)
    return
  }
  
  isLoading.value = true
  
  try {
    const params = {
      GameName: selectedProduct.value
    }
    
    // 添加可选参数（地区筛选在前端进行，不传递给API）
    if (selectedOperator.value && selectedOperator.value !== '全部') {
      params.ScreenIsp = selectedOperator.value
    }
    
    if (selectedLineType.value && selectedLineType.value !== '全部') {
      params.ScreenType = selectedLineType.value
    }
    
    const response = await getAreaData(params)
    
     if (response.Code === 1000) {
       if (response.List && response.List.length > 0) {
         
         // 更新线路类型选项（仅在第一次获取时）
         if (response.ScreenTypeList && response.ScreenTypeList.length > 0 && lineTypes.value.length === 1) {
           lineTypes.value = ['全部', ...response.ScreenTypeList]
           // 如果当前选中的线路类型不在新的列表中，重置为"全部"
           if (!lineTypes.value.includes(selectedLineType.value)) {
             selectedLineType.value = '全部'
           }
         }
         
         // 转换API返回的数据格式为组件需要的格式
         const nodeData = response.List.map((item, index) => ({
           id: item.Id || index + 1,
           name: item.Area || '',
           stock: item.Count > 0 ? item.Count.toString() : '99+',
           price: item.Price_Moon || item.Price || 0,
           operator: item.Isp || '',
           region: item.Province || '',
           // 保存完整的价格信息供后续使用
           priceInfo: {
             day: item.Price_Day || 0,
             week: item.Price_Week || 0,
             month: item.Price_Moon || item.Price || 0,
             threeMonth: item.Price_Three_Moon_Price || 0,
             sixMonth: item.Price_Six_Moon_Price || 0,
             year: item.Price_year_Price || 0
           },
           type: item.Type || '',
           effective: item.Effective || '',
           stability: item.Stability || '',
           // 添加默认选择数量
           selectedQuantity: 1
         }))
         
         // 存入缓存
         dataCache.value.set(cacheKey, nodeData)
         allNodes.value = nodeData
       } else {
         // 当Code为1000但List为null或空数组时，提示暂无可用节点
         ElMessage.warning('暂无可用节点')
         allNodes.value = []
       }
    } else {
      ElMessage.error('获取节点数据失败')
      allNodes.value = []
    }
  } catch (error) {
    ElMessage.error('获取节点数据失败')
    allNodes.value = []
  } finally {
    isLoading.value = false
  }
}

// 防抖版本的数据获取函数
const debouncedFetchAreaData = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    fetchAreaData()
  }, 300)
}

// 游戏类型变化处理
const handleGameTypeChange = () => {
  // 清理缓存，因为游戏类型变化会影响所有数据
  dataCache.value.clear()
  fetchGameData(selectedGameType.value)
}

// 游戏选择变化处理
const handleProductChange = () => {
  if (selectedProduct.value) {
    fetchAreaData()
  }
}

// 分页处理函数
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到节点列表顶部
  nextTick(() => {
    const nodesCard = document.querySelector('.nodes-card')
    if (nodesCard) {
      nodesCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}

// 重置分页到第一页
const resetPagination = () => {
  currentPage.value = 1
}

// 监听筛选条件变化，重新获取节点数据（使用防抖优化）
// 注意：地区切换不需要重新加载数据，只有游戏、运营商、线路类型变化才需要
watch([selectedProduct, selectedOperator, selectedLineType], () => {
  if (selectedProduct.value) {
    resetPagination()
    debouncedFetchAreaData()
  }
}, { deep: true })

// 监听地区变化，重置分页
watch(selectedRegion, () => {
  resetPagination()
})



// 页面初始化时启动自动隐藏
onMounted(() => {
  // 获取游戏数据
  fetchGameData()
  
  // 如果初始订单为空，启动自动隐藏
  if (orderList.value.length === 0) {
    startAutoHide()
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (autoHideTimer.value) {
    clearTimeout(autoHideTimer.value)
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<style lang="scss" scoped>
.routes-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 0;
  margin: 0;
}

// 页面头部
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: unset;
  margin: 0;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .title-section {
    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
      
      .title-icon {
        font-size: 32px;
      }
    }
    
    .page-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }
  }
  
  .stats-info {
    display: flex;
    gap: 30px;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        display: block;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
}

// 主要内容区域
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: unset;
  margin: 0;
  padding: 0;
  width: 100%;
  box-sizing: border-box;
  > .el-card {
    margin: 0;
  }
}

// 内容布局
.content-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  align-items: flex-start;
}

// 左侧边栏
.left-sidebar {
  width: 280px;
  flex-shrink: 0;
  align-self: stretch;
  
  .region-card {
    height: 100%;
    display: flex;
    flex-direction: column;
    
    :deep(.el-card__body) {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}

// 右侧内容
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 卡片通用样式
.el-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.el-card__header) {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #e8e8e8;
    padding: 16px 20px;
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #303133;
      
      .el-icon {
        font-size: 18px;
        color: #409eff;
      }
    }
  }
  
  :deep(.el-card__body) {
    padding: 20px;
  }
}

// 筛选器卡片
.filter-card {
  .filter-section {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .filter-item {
    .filter-label {
      display: block;
      font-weight: 500;
      color: #606266;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .filter-select {
      width: 100%;
    }
    
    .filter-radio {
      width: 100%;
      
      :deep(.el-radio-button) {
        flex: 1;
        
        .el-radio-button__inner {
          width: 100%;
          border-radius: 6px;
          margin: 0 2px;
        }
      }
    }
  }
  
  :deep(.el-divider) {
    margin: 20px 0;
    
    .el-divider__text {
      background: white;
      color: #909399;
      font-weight: 500;
      
      .el-icon {
        margin-right: 6px;
        color: #409eff;
      }
    }
  }
}

// 地区选择卡片
.region-card {
  
  .region-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .region-btn {
      border-radius: 20px;
      transition: all 0.3s ease;
      
      &.region-active {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border-color: #409eff;
        color: white;
        transform: scale(1.05);
      }
      
      &:hover {
        transform: translateY(-1px);
      }
    }
  }
  
  // 竖排地区按钮
  .region-buttons-vertical {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    overflow-y: auto;
    padding-right: 12px; // 进一步增加右边距以完全容纳按钮的偏移
    
    .region-btn-vertical {
      width: calc(100% - 8px); // 进一步减少按钮宽度以防止偏移后超出容器
      justify-content: flex-start;
      border-radius: 8px;
      transition: all 0.3s ease;
      padding: 10px 16px;
      
      .region-btn-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        
        .region-name {
          font-weight: 500;
        }
        
        .region-count {
          font-size: 12px;
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 24px;
          text-align: center;
        }
      }
      
      &.region-active {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border-color: #409eff;
        color: white;
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        .region-btn-content .region-count {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }
      }
      
      &:hover {
        transform: translateX(2px);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        
        &:not(.region-active) .region-btn-content .region-count {
          background: rgba(64, 158, 255, 0.1);
          color: #409eff;
        }
      }
    }
    
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }
}

// 智能分配卡片
.assign-card {
  .assign-content {
    .assign-input {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
      
      .assign-label {
        font-weight: 500;
        color: #606266;
        white-space: nowrap;
      }
      
      .node-counter {
        width: 120px;
      }
      
      .assign-btn {
        border-radius: 20px;
        padding: 8px 20px;
        
        .el-icon {
          margin-right: 6px;
        }
      }
    }
    
    .assign-tip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
      border-radius: 8px;
      color: #409eff;
      font-size: 14px;
      
      .el-icon {
        font-size: 16px;
      }
    }
  }
}

// 节点列表卡片
.nodes-card {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    
    .header-actions {
      .page-info {
        font-size: 14px;
        color: #909399;
        margin-left: auto;
      }
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 20px 0 10px 0;
    border-top: 1px solid #f0f0f0;
    margin-top: 20px;
  }
  
  .node-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    min-height: 200px; // 防止加载时高度跳动
    
    .node-item {
      background: white;
      border: 2px solid #e8e8e8;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        border-color: #409eff;
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(64, 158, 255, 0.1);
      }
      
      &.node-selected {
        border-color: #67c23a;
        background: linear-gradient(135deg, #f0f9ff 0%, #e8f5e8 100%);
        
        .node-name {
          color: #67c23a;
        }
      }
      
      .node-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        
        .node-name {
          font-weight: 600;
          font-size: 16px;
          color: #303133;
        }
      }
      
      .node-details {
        margin-bottom: 16px;
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          font-size: 14px;
          color: #606266;
          
          .el-icon {
            color: #909399;
          }
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      
      .node-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
        
        .node-price {
          .price-label {
            display: block;
            font-size: 12px;
            color: #909399;
            margin-bottom: 2px;
          }
          
          .price-value {
            font-size: 18px;
            font-weight: 600;
            color: #f56c6c;
          }
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .quantity-label {
            font-size: 12px;
            color: #909399;
            white-space: nowrap;
          }
          
          .quantity-input-node {
            width: 80px;
            
            :deep(.el-input-number) {
              .el-input__inner {
                text-align: center;
                font-size: 14px;
              }
            }
          }
        }
        
        .add-btn {
          border-radius: 20px;
          padding: 6px 16px;
          font-size: 14px;
        }
      }
    }
  }
}

// 订单项样式
.order-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .order-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .order-name {
      font-weight: 500;
      color: #303133;
      font-size: 14px;
    }
    
    .quantity-control {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .quantity-label {
        font-size: 12px;
        color: #909399;
        min-width: 36px;
      }
      
      .quantity-input {
        width: 80px;
        
        :deep(.el-input-number) {
          .el-input__inner {
            text-align: center;
          }
        }
      }
    }
  }
  
  .order-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .order-price {
      font-weight: 600;
      color: #409eff;
      font-size: 14px;
      min-width: 60px;
      text-align: right;
    }
    
    .remove-btn {
      color: #f56c6c;
      
      &:hover {
        background-color: #fef0f0;
      }
    }
  }
}

// 订单汇总
.order-summary {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 320px;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  // 隐藏状态下的图标样式
  .summary-icon {
    position: relative;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #409eff 0%, #67c23a 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);
    transition: all 0.3s ease;
    animation: float 3s ease-in-out infinite;
    z-index: 1001;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(64, 158, 255, 0.4);
      animation: none;
      
      .icon-tooltip {
        opacity: 1;
        transform: translateX(-50%) translateY(-100%) scale(1);
      }
    }
    
    .cart-icon {
      font-size: 24px;
      color: white;
    }
    
    .icon-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #f56c6c;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      border: 2px solid white;
      animation: bounce 1s ease-in-out infinite;
    }
    
    .icon-tooltip {
      position: absolute;
      left: 50%;
      top: -10px;
      transform: translateX(-50%) translateY(-100%) scale(0.8);
      background: #303133;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      white-space: nowrap;
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1002;
      
      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 4px solid transparent;
        border-top-color: #303133;
      }
    }
  }
  
  &.order-summary-hidden {
    right: 20px;
    width: 60px;
    
    .summary-icon {
      position: relative;
      right: auto;
      top: auto;
      transform: none;
    }
  }
}

// 浮动动画
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

// 徽章弹跳动画
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(1.05);
  }
}



.order-summary {
  .summary-card {
    :deep(.el-card__header) {
      background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
      color: white;
      
      .summary-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        
        .el-icon {
          color: white;
        }
        
        .toggle-btn {
          margin-left: auto;
          color: white;
          
          &:hover {
            background: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }
    
    .summary-content {
      .summary-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .item-label {
          color: #909399;
          font-size: 14px;
        }
        
        .item-value {
          font-weight: 500;
          color: #303133;
        }
      }
      
      .order-list {
        .list-header {
          font-weight: 500;
          color: #606266;
          margin-bottom: 8px;
        }
        
        .empty-order {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          color: #c0c4cc;
          
          .el-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }
        }
        
        .order-items {
          .order-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            
            &:last-child {
              border-bottom: none;
            }
            
            .order-name {
              flex: 1;
              font-size: 13px;
              color: #606266;
            }
            
            .order-price {
              font-weight: 500;
              color: #f56c6c;
              margin-right: 8px;
            }
            
            .remove-btn {
              color: #f56c6c;
              
              &:hover {
                background: #fef0f0;
              }
            }
          }
        }
      }
      
      .summary-total {
        .total-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          
          .total-label {
            color: #606266;
          }
          
          .total-value {
            font-weight: 500;
            color: #303133;
          }
          
          &.price-total {
            .total-price {
              font-size: 18px;
              font-weight: 600;
              color: #f56c6c;
            }
          }
        }
      }
      
      .assign-group-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .item-label {
          flex-shrink: 0;
          min-width: auto;
        }
        
        .assign-group-input {
           flex: 1;
           max-width: 150px;
           min-width: 100px;
          
          :deep(.el-input__inner) {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-weight: 600;
            letter-spacing: 2px;
            font-size: 16px;
          }
        }
      }
      
      .balance-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        
        .balance-label {
          color: #909399;
          font-size: 14px;
        }
        
        .balance-value {
          font-weight: 500;
          color: #67c23a;
        }
        
        .recharge-link {
          margin-left: auto;
          
          .el-icon {
            margin-right: 4px;
          }
        }
      }
      
      .pay-btn {
        width: 100%;
        border-radius: 20px;
        padding: 12px;
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
        border: none;
        
        .el-icon {
          margin-right: 6px;
        }
        
        &:hover {
          background: linear-gradient(135deg, #85ce61 0%, #67c23a 100%);
        }
        
        &:disabled {
          background: #c0c4cc;
          cursor: not-allowed;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .routes-page {
    flex-direction: column;
  }
  
  .content-layout {
    flex-direction: column;
  }
  
  .left-sidebar {
    width: 100%;
    
    .region-buttons-vertical {
      flex-direction: row;
      flex-wrap: wrap;
      max-height: none;
      overflow-y: visible;
      
      .region-btn-vertical {
        width: auto;
        flex: 0 0 auto;
        
        &.region-active {
          transform: scale(1.05);
        }
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }
  }
  
  .order-summary {
    position: static;
    transform: none;
    width: 100%;
    margin-top: 20px;
    
    &.order-summary-hidden {
      right: auto;
      width: 100%;
      
      .summary-icon {
        position: static;
        transform: none;
        margin: 0 auto;
      }
    }
  }
  
  .main-content {
    padding: 0 15px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 15px;
    
    .header-content {
      flex-direction: column;
      gap: 20px;
      text-align: center;
    }
    
    .title-section .page-title {
      font-size: 24px;
    }
  }
  
  .main-content {
    padding: 0 10px;
  }
  
  .node-grid {
    grid-template-columns: 1fr;
  }
  
  .assign-input {
    flex-direction: column;
    align-items: stretch !important;
    gap: 10px !important;
    
    .assign-label {
      white-space: normal !important;
    }
  }
  
  .region-buttons {
    justify-content: center;
  }
  
  .filter-section .el-row {
    .el-col {
      margin-bottom: 15px;
    }
  }
}
</style>