<template>
  <div class="business-list">
    <el-card class="page-card">
      <template #header>
        <div class="card-header">
          <span>业务列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon>
            新增业务
          </el-button>
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
                :key="game"
                :label="game"
                :value="game"
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
                :key="area"
                :label="area"
                :value="area"
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
            <el-input
              v-model="searchForm.screenEndTime"
              placeholder="请输入天数"
              clearable
              style="width: 120px"
              type="number"
              min="0"
            >
    
            </el-input>
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
      
      <!-- 批量操作区域 -->
      <div class="batch-actions">
        <el-alert
          :title="selectedRows.length > 0 ? `已选择 ${selectedRows.length} 个节点` : '请选择节点进行批量操作'"
          :type="selectedRows.length > 0 ? 'info' : 'warning'"
          show-icon
          :closable="false"
        >
          <template #default>
            <div class="batch-buttons">
              <el-button
                type="primary"
                size="small"
                :disabled="selectedRows.length === 0"
                @click="handleBatchSetGroup"
              >
                批量设置分组
              </el-button>
              <el-button
                type="warning"
                size="small"
                :disabled="selectedRows.length === 0"
                @click="handleBatchRenew"
              >
                批量续费
              </el-button>
              <el-button
                type="success"
                size="small"
                :disabled="selectedRows.length === 0"
                @click="handleBatchCopy"
              >
                批量复制
              </el-button>
              <el-button
                type="info"
                size="small"
                :disabled="selectedRows.length === 0"
                @click="handleBatchExport"
              >
                批量导出
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="selectedRows.length === 0"
                @click="handleBatchSwitchNode"
              >
                批量切换节点
              </el-button>
              <el-button
                type="warning"
                size="small"
                :disabled="selectedRows.length === 0"
                @click="handleBatchSwitchIP"
              >
                批量切换IP
              </el-button>
              <el-button
                size="small"
                :disabled="selectedRows.length === 0"
                @click="clearSelection"
              >
                取消选择
              </el-button>
            </div>
          </template>
        </el-alert>
      </div>

      <!-- 表格区域 -->
      <el-table
        ref="tableRef"
        :data="tableData"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column prop="Id" label="ID" width="100" />
        <el-table-column prop="Game" label="游戏" min-width="180" />
        <el-table-column prop="Area" label="区域" width="140" />
        <el-table-column prop="Group" label="分组" width="70" />
        <el-table-column prop="Isp" label="线路" width="60" />
        <el-table-column prop="IpAddress" label="节点IP" width="125" />
        <el-table-column label="代理信息" width="180">
          <template #default="{ row }">
            <div class="proxy-info">
              <div>用户: {{ row.User }}</div>
              <div>密码: {{ row.Pass }}</div>
              <div>链接: {{ row.Connect_IpAddress }}</div>
              <div class="proxy-port">端口: {{ row.Port }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="StartTime" label="开始时间" width="120" />
        <el-table-column prop="EndTime" label="到期时间" width="120" />
        <el-table-column label="剩余天数" width="100">
          <template #default="{ row }">
            <el-tag
              :type="getDaysType(row.EndDays)"
              size="small"
            >
              {{ Math.floor(row.EndDays) }}天
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button
              type="success"
              size="small"
              @click="handleRenew(row)"
              style="margin-right: 8px;"
            >
              续费
            </el-button>
            <el-dropdown trigger="click" @command="(command) => handleMoreAction(command, row)">
              <el-button size="small" type="info">
                更多
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="switch">
                    <el-icon><Switch /></el-icon>
                    切换节点
                  </el-dropdown-item>
                  <el-dropdown-item command="quickSwitch">
                    <el-icon><Refresh /></el-icon>
                    切换IP
                  </el-dropdown-item>
                  <el-dropdown-item command="setGroup">
                    <el-icon><Setting /></el-icon>
                    设置分组
                  </el-dropdown-item>
                  <el-dropdown-item command="setPassword">
                    <el-icon><Key /></el-icon>
                    设置密码
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
    
    <!-- 切换节点对话框 -->
    <el-dialog
      v-model="switchNodeDialog.visible"
      width="580px"
      :close-on-click-modal="false"
      class="switch-node-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="dialog-icon"><Switch /></el-icon>
          <span class="dialog-title">切换节点</span>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form
          ref="switchFormRef"
          :model="switchNodeDialog.form"
          :rules="switchNodeDialog.rules"
          label-width="90px"
          class="switch-form"
        >
          <div class="current-node-section">
            <h4 class="section-title">
              <el-icon><Monitor /></el-icon>
              当前节点信息
            </h4>
            <div class="current-node-info">
              <div class="node-item">
                <el-icon><VideoPlay /></el-icon>
                <span class="label">游戏:</span>
                <span class="value">{{ switchNodeDialog.currentNode?.Game }}</span>
              </div>
              <div class="node-item">
                <el-icon><Location /></el-icon>
                <span class="label">区域:</span>
                <span class="value">{{ switchNodeDialog.currentNode?.Area }}</span>
              </div>
              <div class="node-item">
                <el-icon><Connection /></el-icon>
                <span class="label">IP:</span>
                <span class="value">{{ switchNodeDialog.currentNode?.IpAddress }}</span>
              </div>
            </div>
          </div>
          
          <el-divider class="section-divider copy-divider">
           <el-icon><ArrowDown /></el-icon>
         </el-divider>
          
          <div class="target-node-section">
            <h4 class="section-title">
              <el-icon><Aim /></el-icon>
              目标节点选择
            </h4>
            
            <el-form-item label="目标游戏" prop="GameName">
              <el-select
                v-model="switchNodeDialog.form.GameName"
                placeholder="请选择游戏"
                style="width: 100%"
                size="large"
                @change="handleGameChange"
              >
                <el-option
                 v-for="game in switchNodeDialog.gameOptions"
                 :key="game.Game"
                 :label="game.Game"
                 :value="game.Game"
               />
              </el-select>
            </el-form-item>
            
            <el-form-item label="目标省份" prop="Province">
              <el-select
                v-model="switchNodeDialog.form.Province"
                placeholder="请选择省份"
                style="width: 100%"
                size="large"
                :disabled="!switchNodeDialog.form.GameName"
                @change="handleProvinceChange"
              >
                <el-option
                 v-for="province in switchNodeDialog.provinceOptions"
                 :key="province.Province"
                 :label="province.Province"
                 :value="province.Province"
               />
              </el-select>
            </el-form-item>
            
            <el-form-item label="目标地区" prop="AreaName">
              <el-select
                v-model="switchNodeDialog.form.AreaName"
                placeholder="请选择地区"
                style="width: 100%"
                size="large"
                :disabled="!switchNodeDialog.form.Province"
              >
                <el-option
                 v-for="area in switchNodeDialog.areaOptions"
                 :key="area.Area"
                 :label="`${area.Area} (${area.Count > 0 ? area.Count : '99+'}个空闲)`"
                 :value="area.Area"
               />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="switchNodeDialog.visible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="switchNodeDialog.loading"
            @click="handleConfirmSwitchNode"
          >
            <el-icon><Check /></el-icon>
            确认切换
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 续费对话框 -->
    <el-dialog
      v-model="renewDialog.visible"
      width="520px"
      :close-on-click-modal="false"
      class="renew-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="dialog-icon"><CreditCard /></el-icon>
          <span class="dialog-title">节点续费</span>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form
          ref="renewFormRef"
          :model="renewDialog.form"
          :rules="renewDialog.rules"
          label-width="90px"
          class="renew-form"
        >
          <div class="current-node-section">
            <h4 class="section-title">
              <el-icon><Monitor /></el-icon>
              当前节点信息
            </h4>
            <div class="current-node-info">
              <div class="node-item">
                <el-icon><VideoPlay /></el-icon>
                <span class="label">游戏:</span>
                <span class="value">{{ renewDialog.currentNode?.Game }}</span>
              </div>
              <div class="node-item">
                <el-icon><Location /></el-icon>
                <span class="label">区域:</span>
                <span class="value">{{ renewDialog.currentNode?.Area }}</span>
              </div>
              <div class="node-item">
                <el-icon><Connection /></el-icon>
                <span class="label">IP:</span>
                <span class="value">{{ renewDialog.currentNode?.IpAddress }}</span>
              </div>
              <div class="node-item">
                <el-icon><Clock /></el-icon>
                <span class="label">到期时间:</span>
                <span class="value expire-time">{{ renewDialog.currentNode?.EndTime }}</span>
              </div>
            </div>
          </div>
          
          <el-divider class="section-divider">
            <el-icon><Timer /></el-icon>
          </el-divider>
          
          <div class="renew-section">
            <h4 class="section-title">
              <el-icon><Calendar /></el-icon>
              续费时长选择
            </h4>
            
            <el-form-item label="续费时长" prop="renewTime">
              <el-select
                v-model="renewDialog.form.renewTime"
                placeholder="请选择续费时长"
                style="width: 100%"
                size="large"
              >
                <el-option label="一天" value="day">
                  <div class="renew-option">
                    <span class="option-label">一天</span>
                    <span class="option-desc trial">短期体验</span>
                  </div>
                </el-option>
                <el-option label="一周" value="week">
                  <div class="renew-option">
                    <span class="option-label">一周</span>
                    <span class="option-desc temporary">临时使用</span>
                  </div>
                </el-option>
                <el-option label="一个月" value="moon">
                  <div class="renew-option">
                    <span class="option-label">一个月</span>
                    <span class="option-desc recommended">推荐选择</span>
                  </div>
                </el-option>
                <el-option label="三个月" value="three_moon">
                  <div class="renew-option">
                    <span class="option-label">三个月</span>
                    <span class="option-desc best-value">性价比高</span>
                  </div>
                </el-option>
                <el-option label="半年" value="six_moon">
                  <div class="renew-option">
                    <span class="option-label">半年</span>
                    <span class="option-desc long-term">长期优惠</span>
                  </div>
                </el-option>
                <el-option label="一年" value="year">
                  <div class="renew-option">
                    <span class="option-label">一年</span>
                    <span class="option-desc best-deal">最大优惠</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="renewDialog.visible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="renewDialog.loading"
            @click="handleConfirmRenew"
          >
            <el-icon><Check /></el-icon>
            确认续费
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 批量复制对话框 -->
    <el-dialog
      v-model="copyDialog.visible"
      width="480px"
      :close-on-click-modal="false"
      class="copy-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="dialog-icon"><CopyDocument /></el-icon>
          <span class="dialog-title">批量复制</span>
        </div>
      </template>
      
      <div class="dialog-content">
        <div class="copy-info-section">
          <h4 class="section-title">
            <el-icon><List /></el-icon>
            复制信息
          </h4>
          <div class="copy-info">
            <div class="info-item">
              <el-icon><Document /></el-icon>
              <span class="label">选中节点:</span>
              <span class="value">{{ selectedRows.length }}个</span>
            </div>
          </div>
        </div>
        
        <el-divider class="section-divider">
          <el-icon><ArrowDown /></el-icon>
        </el-divider>
        
        <div class="format-section">
          <h4 class="section-title">
            <el-icon><Setting /></el-icon>
            选择复制格式
          </h4>
          
          <el-form
            ref="copyFormRef"
            :model="copyDialog.form"
            :rules="copyDialog.rules"
            label-width="0px"
            class="copy-form"
          >
            <el-form-item prop="format">
              <el-radio-group v-model="copyDialog.form.format" class="format-radio-group">
                <el-radio value="wanan" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">万安格式</div>
                    <div class="format-desc">ip|端口|账号|密码|到期日期</div>
                  </div>
                </el-radio>
                <el-radio value="slash" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">斜杠格式</div>
                    <div class="format-desc">ip/端口/账号/密码</div>
                  </div>
                </el-radio>
                <el-radio value="region" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">地区格式</div>
                    <div class="format-desc">ip/端口/账号/密码/地区</div>
                  </div>
                </el-radio>
                <el-radio value="regionDate" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">地区日期格式</div>
                    <div class="format-desc">ip/端口/账号/密码/地区/购买/到期</div>
                  </div>
                </el-radio>
                <el-radio value="browser" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">浏览器格式</div>
                    <div class="format-desc">ip:端口:账号:密码</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="copyDialog.visible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="copyDialog.loading"
            @click="handleConfirmCopy"
          >
            <el-icon><CopyDocument /></el-icon>
            复制到剪贴板
          </el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 批量导出对话框 -->
    <el-dialog
      v-model="exportDialog.visible"
      width="480px"
      :close-on-click-modal="false"
      class="export-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="dialog-icon"><Download /></el-icon>
          <span class="dialog-title">批量导出</span>
        </div>
      </template>
      
      <div class="dialog-content">
        <div class="export-info-section">
          <h4 class="section-title">
            <el-icon><List /></el-icon>
            导出信息
          </h4>
          <div class="export-info">
            <div class="info-item">
              <el-icon><Document /></el-icon>
              <span class="label">选中节点:</span>
              <span class="value">{{ selectedRows.length }}个</span>
            </div>
          </div>
        </div>
        
        <el-divider class="section-divider">
          <el-icon><ArrowDown /></el-icon>
        </el-divider>
        
        <div class="format-section">
          <h4 class="section-title">
            <el-icon><Setting /></el-icon>
            选择导出格式
          </h4>
          
          <el-form
            ref="exportFormRef"
            :model="exportDialog.form"
            :rules="exportDialog.rules"
            label-width="0px"
            class="export-form"
          >
            <el-form-item prop="format">
              <el-radio-group v-model="exportDialog.form.format" class="format-radio-group">
                <el-radio value="wanan" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">万安格式</div>
                    <div class="format-desc">ip|端口|账号|密码|到期日期</div>
                  </div>
                </el-radio>
                <el-radio value="slash" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">斜杠格式</div>
                    <div class="format-desc">ip/端口/账号/密码</div>
                  </div>
                </el-radio>
                <el-radio value="region" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">地区格式</div>
                    <div class="format-desc">ip/端口/账号/密码/地区</div>
                  </div>
                </el-radio>
                <el-radio value="regionDate" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">地区日期格式</div>
                    <div class="format-desc">ip/端口/账号/密码/地区/购买/到期</div>
                  </div>
                </el-radio>
                <el-radio value="browser" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">浏览器格式</div>
                    <div class="format-desc">ip:端口:账号:密码</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="exportDialog.visible = false">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="exportDialog.loading"
            @click="handleConfirmExport"
          >
            <el-icon><Download /></el-icon>
            导出到文件
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Search, Refresh, Switch, Monitor, VideoPlay, Location, Connection, 
  ArrowDown, Aim, Close, Check, CreditCard, Clock, Timer, Calendar, Setting, Key,
  CopyDocument, List, Document, Download
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getNodeData, setGroup, getGameData, getAreaData, switchNode, renewNode, setNodePassword } from '@/api/auth'

// 路由
const router = useRouter()

// 内置省份数据
const PROVINCE_LIST = [
  { Province: '北京市' },
  { Province: '天津市' },
  { Province: '河北省' },
  { Province: '山西省' },
  { Province: '内蒙古自治区' },
  { Province: '辽宁省' },
  { Province: '吉林省' },
  { Province: '黑龙江省' },
  { Province: '上海市' },
  { Province: '江苏省' },
  { Province: '浙江省' },
  { Province: '安徽省' },
  { Province: '福建省' },
  { Province: '江西省' },
  { Province: '山东省' },
  { Province: '河南省' },
  { Province: '湖北省' },
  { Province: '湖南省' },
  { Province: '广东省' },
  { Province: '广西壮族自治区' },
  { Province: '海南省' },
  { Province: '重庆市' },
  { Province: '四川省' },
  { Province: '贵州省' },
  { Province: '云南省' },
  { Province: '西藏自治区' },
  { Province: '陕西省' },
  { Province: '甘肃省' },
  { Province: '青海省' },
  { Province: '宁夏回族自治区' },
  { Province: '新疆维吾尔自治区' },
  { Province: '台湾省' },
  { Province: '香港特别行政区' },
  { Province: '澳门特别行政区' }
]

// 搜索表单
const searchForm = reactive({
  game: '',
  area: '',
  group: '',
  screenNode: '',
  screenEndTime: ''
})

// 表格数据
const tableData = ref([])
const loading = ref(false)
const tableRef = ref()
const selectedRows = ref([])

// 筛选选项
const gameList = ref([])
const areaList = ref([])
const groupList = ref([])

// 分页
const pagination = reactive({
  page: 1,
  size: 20,
  total: 0
})

// 切换节点对话框
const switchNodeDialog = reactive({
  visible: false,
  loading: false,
  currentNode: null,
  form: {
    GameName: '',
    Province: '',
    AreaName: ''
  },
  gameOptions: [],
  provinceOptions: [],
  areaOptions: [],
  rules: {
    GameName: [
      { required: true, message: '请选择目标游戏', trigger: 'change' }
    ],
    Province: [
      { required: true, message: '请选择省份', trigger: 'change' }
    ],
    AreaName: [
      { required: true, message: '请选择目标地区', trigger: 'change' }
    ]
  }
})

const switchFormRef = ref()

// 续费对话框
const renewDialog = reactive({
  visible: false,
  loading: false,
  currentNode: null,
  form: {
    renewTime: ''
  },
  rules: {
    renewTime: [
      { required: true, message: '请选择续费时长', trigger: 'change' }
    ]
  }
})

const renewFormRef = ref()

// 批量复制对话框
const copyDialog = reactive({
  visible: false,
  loading: false,
  form: {
    format: 'wanan'
  },
  rules: {
    format: [
      { required: true, message: '请选择复制格式', trigger: 'change' }
    ]
  }
})

const copyFormRef = ref()

// 批量导出对话框
const exportDialog = reactive({
  visible: false,
  loading: false,
  form: {
    format: 'wanan'
  },
  rules: {
    format: [
      { required: true, message: '请选择导出格式', trigger: 'change' }
    ]
  }
})

const exportFormRef = ref()

// 获取剩余天数类型
const getDaysType = (days) => {
  if (days <= 0) {
    return 'danger' // 已过期
  } else if (days <= 7) {
    return 'warning' // 即将过期
  } else {
    return 'success' // 正常
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.game = ''
  searchForm.area = ''
  searchForm.group = ''
  searchForm.screenNode = ''
  searchForm.screenEndTime = ''
  pagination.page = 1
  fetchData()
}

// 新增业务
const handleCreate = () => {
  router.push('/user/products/routes')
}

// 续费业务
const handleRenew = (row) => {
  // 设置当前节点信息
  renewDialog.currentNode = row
  
  // 重置表单
  renewDialog.form.renewTime = ''
  
  // 显示对话框
  renewDialog.visible = true
}

// 切换节点
const handleSwitchNode = async (row) => {
  try {
    // 设置当前节点信息
    switchNodeDialog.currentNode = row
    
    // 重置表单
    switchNodeDialog.form.GameName = ''
    switchNodeDialog.form.Province = ''
    switchNodeDialog.form.AreaName = ''
    switchNodeDialog.provinceOptions = []
    switchNodeDialog.areaOptions = []
    
    // 获取游戏列表
    const gameResponse = await getGameData()
    if (gameResponse.Code === 1000 && gameResponse.List) {
      switchNodeDialog.gameOptions = gameResponse.List || []
      
      // 自动填入当前节点的游戏
      if (row.Game) {
        switchNodeDialog.form.GameName = row.Game
        // 触发游戏选择变化处理
        handleGameChange(row.Game)
      }
    } else {
      ElMessage.error('获取游戏列表失败')
      return
    }
    
    // 显示对话框
    switchNodeDialog.visible = true
  } catch (error) {
    console.error('打开切换节点对话框失败:', error)
    ElMessage.error('打开切换节点对话框失败')
  }
}

// 设置分组
const handleSetGroup = (row) => {
  ElMessageBox.prompt('请输入新的分组（4位数字）', '设置分组', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^\d{4}$/,
    inputErrorMessage: '分组必须是4位数字',
    inputValue: row.Group || ''
  }).then(async ({ value }) => {
    try {
      const response = await setGroup({
        Id: [row.Id], // 单个节点ID数组
        Group: value
      })
      
      if (response.Code === 1000) {
        ElMessage.success('分组设置成功')
        // 刷新数据
        fetchData()
      } else {
        ElMessage.error(response.Msg || '分组设置失败')
      }
    } catch (error) {
      console.error('设置分组失败:', error)
      ElMessage.error('设置分组失败')
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 设置密码
const handleSetPassword = (row) => {
  ElMessageBox.prompt('请输入新密码', '设置密码', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'password',
    inputPlaceholder: '请输入新密码',
    inputValidator: (value) => {
      if (!value) {
        return '密码不能为空'
      }
      if (value.length < 6) {
        return '密码长度不能少于6位'
      }
      return true
    }
  }).then(async ({ value }) => {
    try {
      const response = await setNodePassword({
        Id: [row.Id], // 单个节点ID数组
        Password: value
      })
      
      if (response.Code === 1000) {
         ElMessage.success('密码设置成功')
         // 刷新数据
         fetchData()
       } else {
         ElMessage.error(response.Msg || '密码设置失败')
       }
     } catch (error) {
       console.error('设置密码失败:', error)
       ElMessage.error('设置密码失败')
     }
   }).catch(() => {
     // 用户取消操作
   })
}

// 快速切换节点
const handleQuickSwitch = async (row) => {
  try {
    // 确认操作
    await ElMessageBox.confirm(
      `确定要切换节点吗？\n\n当前节点信息：\n游戏：${row.Game}\n区域：${row.Area}\n\n将使用当前参数进行切换`,
      '快速切换节点',
      {
        confirmButtonText: '确定切换',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用切换节点API
    const response = await switchNode({
      Id: [row.Id], // 节点ID数组
      GameName: row.Game, // 使用当前游戏
      Province: row.Province || '', // 使用当前省份（如果有）
      AreaName: row.Area // 使用当前地区
    })
    
    if (response.Code === 1000) {
      ElMessage.success('节点切换成功')
      // 刷新数据
      fetchData()
    } else {
      const errorMsg = response.Msg || '节点切换失败'
      // 特殊处理库存不足的情况
      if (response.Code === -1 && errorMsg.includes('库存不足')) {
        ElMessage.error(`切换失败：${row.Game}/${row.Area} 库存不足，无法切换`)
      } else {
        ElMessage.error(errorMsg)
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('快速切换节点失败:', error)
      ElMessage.error('快速切换节点失败')
    }
  }
}

// 处理更多操作下拉菜单
const handleMoreAction = (command, row) => {
  switch (command) {
    case 'switch':
      handleSwitchNode(row)
      break
    case 'quickSwitch':
      handleQuickSwitch(row)
      break
    case 'setGroup':
      handleSetGroup(row)
      break
    case 'setPassword':
      handleSetPassword(row)
      break
    default:
      console.warn('未知的操作命令:', command)
  }
}

// 批量设置分组
const handleBatchSetGroup = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要设置分组的节点')
    return
  }
  
  ElMessageBox.prompt('请输入新的分组（4位数字）', `批量设置分组 (${selectedRows.value.length}个节点)`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /^\d{4}$/,
    inputErrorMessage: '分组必须是4位数字'
  }).then(async ({ value }) => {
    try {
      const nodeIds = selectedRows.value.map(row => row.Id)
      const response = await setGroup({
        Id: nodeIds, // 多个节点ID数组
        Group: value
      })
      
      if (response.Code === 1000) {
        ElMessage.success(`成功设置${selectedRows.value.length}个节点的分组`)
        // 清空选择并刷新数据
        clearSelection()
        fetchData()
      } else {
        ElMessage.error(response.Msg || '批量设置分组失败')
      }
    } catch (error) {
      console.error('批量设置分组失败:', error)
      ElMessage.error('批量设置分组失败')
    }
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量续费
const handleBatchRenew = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要续费的节点')
    return
  }
  
  ElMessageBox.confirm(
    `确定要为选中的 ${selectedRows.value.length} 个节点进行批量续费吗？`,
    '批量续费确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 设置批量续费的节点信息
    renewDialog.currentNode = {
      Game: '批量续费',
      Area: `${selectedRows.value.length}个节点`,
      IpAddress: '多个IP',
      EndTime: '不同到期时间'
    }
    
    // 重置表单
    renewDialog.form.renewTime = ''
    
    // 显示对话框
    renewDialog.visible = true
  }).catch(() => {
    // 用户取消操作
  })
}

// 批量复制
const handleBatchCopy = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要复制的节点')
    return
  }
  
  // 重置表单
  copyDialog.form.format = 'wanan'
  
  // 显示对话框
  copyDialog.visible = true
}

// 批量导出
const handleBatchExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的节点')
    return
  }
  
  // 重置表单
  exportDialog.form.format = 'wanan'
  
  // 显示对话框
  exportDialog.visible = true
}

// 批量切换节点
const handleBatchSwitchNode = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要切换的节点')
    return
  }
  
  // 检查选中节点的游戏是否一致
  const games = [...new Set(selectedRows.value.map(row => row.Game))]
  if (games.length > 1) {
    ElMessage.error(`批量切换节点失败：选中的节点游戏不一致，包含 ${games.join('、')} 等游戏，请选择相同游戏的节点进行批量切换`)
    return
  }
  
  try {
    // 获取选中节点的游戏（因为已经检查过一致性，取第一个即可）
    const selectedGame = selectedRows.value[0].Game
    
    // 设置批量切换的节点信息
    switchNodeDialog.currentNode = {
      Game: '批量切换',
      Area: `${selectedRows.value.length}个节点`,
      IpAddress: '多个IP'
    }
    
    // 重置表单
    switchNodeDialog.form.GameName = ''
    switchNodeDialog.form.Province = ''
    switchNodeDialog.form.AreaName = ''
    switchNodeDialog.provinceOptions = []
    switchNodeDialog.areaOptions = []
    
    // 获取游戏列表
    const gameResponse = await getGameData()
    if (gameResponse.Code === 1000 && gameResponse.List) {
      switchNodeDialog.gameOptions = gameResponse.List || []
      
      // 自动填入选中节点的游戏
      if (selectedGame) {
        switchNodeDialog.form.GameName = selectedGame
        // 触发游戏选择变化处理
        handleGameChange(selectedGame)
      }
    } else {
      ElMessage.error('获取游戏列表失败')
      return
    }
    
    // 显示对话框
    switchNodeDialog.visible = true
  } catch (error) {
    console.error('打开批量切换节点对话框失败:', error)
    ElMessage.error('打开批量切换节点对话框失败')
  }
}

// 批量切换IP
const handleBatchSwitchIP = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要切换IP的节点')
    return
  }
  
  // 检查选中节点的游戏是否一致
  const games = [...new Set(selectedRows.value.map(row => row.Game))]
  if (games.length > 1) {
    ElMessage.error(`批量切换IP失败：选中的节点游戏不一致，包含 ${games.join('、')} 等游戏，请选择相同游戏的节点进行批量切换`)
    return
  }
  
  try {
    // 确认操作
    await ElMessageBox.confirm(
      `确定要为选中的 ${selectedRows.value.length} 个节点进行批量切换IP吗？\n\n注意：切换IP将使用当前节点的游戏和区域参数进行切换`,
      '批量切换IP确认',
      {
        confirmButtonText: '确定切换',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 按游戏和区域分组处理
    const groupedNodes = {}
    selectedRows.value.forEach(row => {
      const key = `${row.Game}-${row.Area}`
      if (!groupedNodes[key]) {
        groupedNodes[key] = {
          game: row.Game,
          area: row.Area,
          province: row.Province || '',
          nodeIds: []
        }
      }
      groupedNodes[key].nodeIds.push(row.Id)
    })
    
    // 批量处理每个分组
    let successCount = 0
    let failCount = 0
    const errorMessages = []
    
    for (const group of Object.values(groupedNodes)) {
      try {
        const response = await switchNode({
          Id: group.nodeIds,
          GameName: group.game,
          Province: group.province,
          AreaName: group.area
        })
        
        if (response.Code === 1000) {
          successCount += group.nodeIds.length
        } else {
          failCount += group.nodeIds.length
          const errorMsg = response.Msg || '切换失败'
          console.error(`切换失败 - ${group.game}/${group.area}:`, errorMsg)
          
          // 收集具体的错误信息
          if (response.Code === -1 && errorMsg.includes('库存不足')) {
            errorMessages.push(`${group.game}/${group.area}: 库存不足，无法切换`)
          } else {
            errorMessages.push(`${group.game}/${group.area}: ${errorMsg}`)
          }
        }
      } catch (error) {
        failCount += group.nodeIds.length
        console.error(`切换异常 - ${group.game}/${group.area}:`, error)
        errorMessages.push(`${group.game}/${group.area}: 网络异常`)
      }
    }
    
    // 显示结果
    if (successCount > 0 && failCount === 0) {
      ElMessage.success(`成功切换${successCount}个节点的IP`)
    } else if (successCount > 0 && failCount > 0) {
      const detailMsg = errorMessages.length > 0 ? `\n详细信息：\n${errorMessages.join('\n')}` : ''
      ElMessage.warning(`成功切换${successCount}个节点，${failCount}个节点切换失败${detailMsg}`)
    } else {
      const detailMsg = errorMessages.length > 0 ? `\n详细信息：\n${errorMessages.join('\n')}` : ''
      ElMessage.error(`批量切换IP失败${detailMsg}`)
    }
    
    // 清空选择并刷新数据
    clearSelection()
    fetchData()
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量切换IP失败:', error)
      ElMessage.error('批量切换IP失败')
    }
  }
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 清空选择
const clearSelection = () => {
  tableRef.value?.clearSelection()
  selectedRows.value = []
}

// 分页大小改变
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  fetchData()
}

// 当前页改变
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchData()
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
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
    if (searchForm.screenEndTime) {
      params.ScreenEndTime = searchForm.screenEndTime
    }
    
    const response = await getNodeData(params)
    
    if (response.Code === 1000) {
      tableData.value = response.List || []
      pagination.total = response.RowCount || 0
      
      // 更新筛选选项
      if (response.ScreenGameList) {
        gameList.value = response.ScreenGameList
      }
      if (response.ScreenAreaList) {
        areaList.value = response.ScreenAreaList
      }
      if (response.ScreenGroupList) {
        groupList.value = response.ScreenGroupList
      }
    } else {
      ElMessage.error(response.Msg || '获取数据失败')
      tableData.value = []
      pagination.total = 0
    }
  } catch (error) {
    console.error('获取业务列表失败:', error)
    ElMessage.error('获取数据失败')
    tableData.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

// 游戏选择变化处理
const handleGameChange = (gameName) => {
  // 重置省份和地区选择
  switchNodeDialog.form.Province = ''
  switchNodeDialog.form.AreaName = ''
  switchNodeDialog.areaOptions = []
  
  if (!gameName) {
    switchNodeDialog.provinceOptions = []
    return
  }
  
  // 使用内置省份列表
  switchNodeDialog.provinceOptions = PROVINCE_LIST
}

// 省份选择变化处理
const handleProvinceChange = async (province) => {
  try {
    // 重置地区选择
    switchNodeDialog.form.AreaName = ''
    switchNodeDialog.areaOptions = []
    
    if (!province || !switchNodeDialog.form.GameName) return
    
    // 获取该游戏和省份下的地区列表
    const areaResponse = await getAreaData({ 
      GameName: switchNodeDialog.form.GameName,
      ScreenProvince: province
    })
    if (areaResponse.Code === 1000) {
      if (areaResponse.List && areaResponse.List.length > 0) {
        switchNodeDialog.areaOptions = areaResponse.List
      } else {
        switchNodeDialog.areaOptions = []
        ElMessage.warning('该省份暂无可用节点')
      }
    } else {
      ElMessage.error(areaResponse.Msg || '获取地区列表失败')
    }
  } catch (error) {
    console.error('获取地区列表失败:', error)
    ElMessage.error('获取地区列表失败')
  }
}

// 确认切换节点
const handleConfirmSwitchNode = async () => {
  try {
    // 表单验证
    await switchFormRef.value?.validate()
    
    // 判断是单个切换还是批量切换
    const isBatchSwitch = switchNodeDialog.currentNode.Game === '批量切换'
    const nodeCount = isBatchSwitch ? selectedRows.value.length : 1
    
    // 显示告警提示
    await ElMessageBox.confirm(
      `切换节点后，系统将根据新节点的单价重新计算并调整到期时间，确定要继续切换${isBatchSwitch ? `这${nodeCount}个节点` : ''}吗？`,
      '切换节点提醒',
      {
        confirmButtonText: '确定切换',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    switchNodeDialog.loading = true
    
    // 准备节点ID数组
    let nodeIds
    if (isBatchSwitch) {
      nodeIds = selectedRows.value.map(row => row.Id)
    } else {
      nodeIds = [switchNodeDialog.currentNode.Id]
    }
    
    // 调用切换节点接口
    const response = await switchNode({
      Id: nodeIds,
      AreaName: switchNodeDialog.form.AreaName,
      GameName: switchNodeDialog.form.GameName,
      Province: switchNodeDialog.form.Province
    })
    
    if (response.Code === 1000) {
      const successMessage = isBatchSwitch ? `成功切换${nodeCount}个节点` : '节点切换成功'
      ElMessage.success(successMessage)
      switchNodeDialog.visible = false
      
      // 如果是批量切换，清空选择
      if (isBatchSwitch) {
        clearSelection()
      }
      
      // 刷新数据
      fetchData()
    } else {
      const errorMsg = response.Msg || '节点切换失败'
      // 特殊处理库存不足的情况
      if (response.Code === -1 && errorMsg.includes('库存不足')) {
        if (isBatchSwitch) {
          ElMessage.error(`批量切换失败：库存不足，无法切换选中的节点`)
        } else {
          ElMessage.error(`切换失败：${switchNodeDialog.form.GameName}/${switchNodeDialog.form.AreaName} 库存不足，无法切换`)
        }
      } else {
        ElMessage.error(errorMsg)
      }
    }
  } catch (error) {
    if (error !== false) { // 排除表单验证失败的情况
      console.error('切换节点失败:', error)
      ElMessage.error('切换节点失败')
    }
  } finally {
    switchNodeDialog.loading = false
  }
}

// 确认续费
const handleConfirmRenew = async () => {
  try {
    // 表单验证
    await renewFormRef.value?.validate()
    
    renewDialog.loading = true
    
    // 判断是单个续费还是批量续费
    let nodeIds
    let successMessage
    
    if (renewDialog.currentNode.Game === '批量续费') {
      // 批量续费
      nodeIds = selectedRows.value.map(row => row.Id)
      successMessage = `成功续费${selectedRows.value.length}个节点`
    } else {
      // 单个续费
      nodeIds = [renewDialog.currentNode.Id]
      successMessage = '节点续费成功'
    }
    
    // 调用续费接口
    const response = await renewNode({
      Id: nodeIds, // 节点ID数组
      RenewTime: renewDialog.form.renewTime // 续费时长
    })
    
    if (response.Code === 1000) {
      ElMessage.success(successMessage)
      renewDialog.visible = false
      
      // 如果是批量续费，清空选择
      if (renewDialog.currentNode.Game === '批量续费') {
        clearSelection()
      }
      
      // 刷新数据
      fetchData()
    } else {
      ElMessage.error(response.Msg || '节点续费失败')
    }
  } catch (error) {
    if (error !== false) { // 排除表单验证失败的情况
      console.error('续费失败:', error)
      ElMessage.error('续费失败')
    }
  } finally {
    renewDialog.loading = false
  }
}

// 确认复制
const handleConfirmCopy = async () => {
  try {
    // 表单验证
    await copyFormRef.value?.validate()
    
    copyDialog.loading = true
    
    // 根据选择的格式生成复制内容
    const copyContent = generateCopyContent(selectedRows.value, copyDialog.form.format)
    
    // 复制到剪贴板
    try {
      // 优先使用现代API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(copyContent)
      } else {
        // 降级方案：使用传统方法
        const textArea = document.createElement('textarea')
        textArea.value = copyContent
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      
      ElMessage.success(`成功复制${selectedRows.value.length}个节点信息到剪贴板`)
      copyDialog.visible = false
      
      // 清空选择
      clearSelection()
    } catch (clipboardError) {
      console.error('剪贴板操作失败:', clipboardError)
      ElMessage.error('复制到剪贴板失败，请检查浏览器权限或手动复制')
    }
  } catch (error) {
    if (error !== false) { // 排除表单验证失败的情况
      console.error('复制失败:', error)
      ElMessage.error('操作失败')
    }
  } finally {
    copyDialog.loading = false
  }
}

// 确认导出
const handleConfirmExport = async () => {
  try {
    // 表单验证
    await exportFormRef.value?.validate()
    
    exportDialog.loading = true
    
    // 根据选择的格式生成导出内容
    const exportContent = generateCopyContent(selectedRows.value, exportDialog.form.format)
    
    // 创建并下载文件
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // 生成文件名
    const now = new Date()
    const timestamp = now.getFullYear() + 
      String(now.getMonth() + 1).padStart(2, '0') + 
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') + 
      String(now.getMinutes()).padStart(2, '0') + 
      String(now.getSeconds()).padStart(2, '0')
    
    link.download = `节点导出_${exportDialog.form.format}_${timestamp}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    ElMessage.success(`成功导出${selectedRows.value.length}个节点信息到文件`)
    exportDialog.visible = false
    
    // 清空选择
    clearSelection()
  } catch (error) {
    if (error !== false) { // 排除表单验证失败的情况
      console.error('导出失败:', error)
      ElMessage.error('导出文件失败')
    }
  } finally {
    exportDialog.loading = false
  }
}

// 生成复制内容
const generateCopyContent = (rows, format) => {
  const lines = rows.map(row => {
    const ip = row.Connect_IpAddress || row.IpAddress || ''
    const port = row.Port || ''
    const user = row.User || ''
    const pass = row.Pass || ''
    const area = row.Area || ''
    const startTime = row.StartTime || ''
    const endTime = row.EndTime || ''
    
    switch (format) {
      case 'wanan':
        // 万安格式：ip|端口|账号|密码|到期日期
        return `${ip}|${port}|${user}|${pass}|${endTime}`
      
      case 'slash':
        // 斜杠格式：ip/端口/账号/密码
        return `${ip}/${port}/${user}/${pass}`
      
      case 'region':
        // 地区格式：ip/端口/账号/密码/地区
        return `${ip}/${port}/${user}/${pass}/${area}`
      
      case 'regionDate':
        // 地区日期格式：ip/端口/账号/密码/地区/购买/到期
        return `${ip}/${port}/${user}/${pass}/${area}/${startTime}/${endTime}`
      
      case 'browser':
        // 浏览器格式：ip:端口:账号:密码
        return `${ip}:${port}:${user}:${pass}`
      
      default:
        return `${ip}|${port}|${user}|${pass}|${endTime}`
    }
  })
  
  return lines.join('\n')
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.business-list {
  .page-card {
    .card-header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 16px;
    }
    
    .search-area {
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f5f7fa;
      border-radius: 4px;
    }
    
    .batch-actions {
      margin-bottom: 20px;
      
      .batch-buttons {
        margin-top: 10px;
        
        .el-button {
          margin-right: 10px;
        }
      }
    }
    
    .pagination-wrapper {
      margin-top: 20px;
      text-align: right;
    }
    
    .proxy-info {
      font-size: 12px;
      line-height: 1.4;
      
      .proxy-port {
        color: #909399;
        margin-top: 2px;
      }
    }
  }
}

// 对话框美化样式
:deep(.switch-node-dialog),
:deep(.renew-dialog) {
  .el-dialog__header {
    padding: 20px 24px 0;
    border-bottom: none;
  }
  
  .el-dialog__body {
    padding: 20px 24px;
  }
  
  .el-dialog__footer {
    padding: 0 24px 24px;
    border-top: 1px solid #ebeef5;
    margin-top: 20px;
    padding-top: 20px;
  }
}

:deep(.copy-dialog),
:deep(.export-dialog) {
  .el-dialog__header {
    padding: 16px 20px 0;
    border-bottom: none;
  }
  
  .el-dialog__body {
    padding: 12px 20px 8px; // 减少底部padding
  }
  
  .el-dialog__footer {
    padding: 0 20px 12px; // 减少底部padding
    border-top: 1px solid #ebeef5;
    margin-top: 8px;      // 缩小与上方内容的间距
    padding-top: 8px;
  }
}

.format-section {
  margin-top: 4px !important; // 缩小与上方的间距
  margin-bottom: 0 !important;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 12px;
  
  .dialog-icon {
    font-size: 24px;
    color: #409eff;
  }
  
  .dialog-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.dialog-content {
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 500;
    color: #606266;
    
    .el-icon {
      color: #409eff;
    }
  }
  
  .current-node-section {
    margin-bottom: 24px;
  }
  
  .target-node-section,
  .renew-section {
    margin-top: 24px;
  }
  
  .copy-info-section,
  .export-info-section {
    margin-bottom: 12px;
  }
  
  .format-section {
    margin-top: 12px;
  }
  
  .section-divider {
    margin: 24px 0;
    
    .el-icon {
      color: #909399;
      font-size: 16px;
    }
    
    &.copy-divider {
      margin: 12px 0;
    }
  }
}

.current-node-info {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  
  .node-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .el-icon {
      color: #409eff;
      font-size: 16px;
      min-width: 16px;
    }
    
    .label {
      font-weight: 500;
      color: #606266;
      min-width: 60px;
    }
    
    .value {
      color: #303133;
      font-weight: 600;
      
      &.expire-time {
        color: #e6a23c;
      }
    }
  }
}

.switch-form,
.renew-form {
  .el-form-item {
    margin-bottom: 20px;
    
    .el-form-item__label {
      font-weight: 500;
      color: #606266;
    }
  }
  
  .el-select {
    .el-input__wrapper {
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 0 0 1px #409eff;
      }
    }
  }
}

.renew-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 2px 0;
  
  .option-label {
    font-weight: 500;
    color: #303133;
    font-size: 14px;
  }
  
  .option-desc {
    font-size: 11px;
    color: #909399;
    background: #f0f2f5;
    padding: 1px 6px;
    border-radius: 10px;
    white-space: nowrap;
    
    &.recommended {
      background: linear-gradient(135deg, #67c23a, #85ce61);
      color: #fff;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(103, 194, 58, 0.3);
    }
    
    &.best-value {
      background: linear-gradient(135deg, #e6a23c, #f0a020);
      color: #fff;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(230, 162, 60, 0.3);
    }
    
    &.best-deal {
       background: linear-gradient(135deg, #f56c6c, #f78989);
       color: #fff;
       font-weight: 500;
       box-shadow: 0 1px 3px rgba(245, 108, 108, 0.3);
     }
     
     &.trial {
       background: linear-gradient(135deg, #909399, #b1b3b8);
       color: #fff;
       font-weight: 500;
       box-shadow: 0 1px 3px rgba(144, 147, 153, 0.3);
     }
     
     &.temporary {
       background: linear-gradient(135deg, #409eff, #66b1ff);
       color: #fff;
       font-weight: 500;
       box-shadow: 0 1px 3px rgba(64, 158, 255, 0.3);
     }
     
     &.long-term {
       background: linear-gradient(135deg, #722ed1, #9254de);
       color: #fff;
       font-weight: 500;
       box-shadow: 0 1px 3px rgba(114, 46, 209, 0.3);
     }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  
  .el-button {
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .el-icon {
      margin-right: 6px;
    }
  }
}

.copy-info {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #bae6fd;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .el-icon {
      color: #0ea5e9;
      font-size: 16px;
      min-width: 16px;
    }
    
    .label {
      font-weight: 500;
      color: #0c4a6e;
      min-width: 80px;
    }
    
    .value {
      color: #0c4a6e;
      font-weight: 600;
    }
  }
}

.format-radio-group {
  width: 100%;
  
  .format-radio {
    width: 100%;
    margin-bottom: 8px;
    margin-right: 0;
    padding: 8px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    background: #fff;
    min-height: 55px;
    box-sizing: border-box;
    position: relative;
    /* justify-content: center; 取消水平居中 */

    &:hover {
      border-color: #409eff;
      background-color: #f0f9ff;
    }

    &:last-child {
      margin-bottom: 0;
    }

    :deep(.el-radio__input) {
      margin-top: 0;
    }

    .format-option {
      margin-left: 18px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 2px;
      min-height: 32px;

      .format-title {
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 2px;
        line-height: 1.2;
        text-align: left;
      }

      .format-desc {
        font-size: 15px;
        color: #6b7280;
        font-weight: 500;
        line-height: 1.2;
        text-align: left;
      }
    }
  }
}
</style>