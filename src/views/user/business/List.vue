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
                  <el-dropdown-item command="orderLog">
                    <el-icon><Document /></el-icon>
                    订单日志
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
                :placeholder="switchNodeDialog.currentNode && switchNodeDialog.currentNode.Game === '批量切换' ? `请选择地区（最多${getMaxSelectableAreas()}个）` : '请选择地区（可多选）'"
                style="width: 100%"
                size="large"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="3"
                :disabled="!switchNodeDialog.form.Province"
                :multiple-limit="getMaxSelectableAreas()"
                @change="handleAreaSelectionChange"
              >
                <el-option
                 v-for="area in switchNodeDialog.areaOptions"
                 :key="area.Area"
                 :label="`${area.Area} (${area.Count > 99 ? '99+' : area.Count}个空闲)`"
                 :value="area.Area"
               />
              </el-select>
              <div class="area-select-tip" v-if="switchNodeDialog.currentNode && switchNodeDialog.currentNode.Game === '批量切换'">
                <el-text size="small" type="info">
                  可选择 1-{{ getMaxSelectableAreas() }} 个地区，支持自定义每个地区的节点数量
                </el-text>
              </div>
            </el-form-item>
            
            <!-- 批量切换时的节点数量分配 -->
            <el-form-item 
              v-if="switchNodeDialog.currentNode && switchNodeDialog.currentNode.Game === '批量切换' && switchNodeDialog.form.AreaName.length > 0"
              label="节点分配"
            >
              <div class="node-allocation-section">
                <div class="allocation-header">
                  <div class="header-info">
                    <el-text size="small" type="info">
                      总共 {{ selectedRows.length }} 个节点，请为每个地区分配节点数量
                    </el-text>
                    <el-button 
                      v-if="switchNodeDialog.form.AreaName.length > 0"
                      type="primary" 
                      size="small" 
                      @click="autoAllocateNodes"
                    >
                      <el-icon><MagicStick /></el-icon>
                      平均分配
                    </el-button>
                  </div>
                  <div class="allocation-summary">
                    <el-text 
                      :type="getTotalAllocatedQuantity() === selectedRows.length ? 'success' : 'warning'"
                      size="small"
                    >
                      已分配: {{ getTotalAllocatedQuantity() }} / {{ selectedRows.length }} 个节点
                      <span v-if="getTotalAllocatedQuantity() !== selectedRows.length" class="allocation-warning">
                        (请确保分配的节点总数等于选中的节点数量)
                      </span>
                    </el-text>
                  </div>
                </div>
                
                <!-- 优化后的分配列表 -->
                <div class="allocation-container">
                  <!-- 当地区数量较少时，使用原有布局 -->
                  <div 
                    v-if="switchNodeDialog.form.AreaName.length <= 5"
                    class="allocation-list"
                  >
                    <div 
                      v-for="(areaName, index) in switchNodeDialog.form.AreaName" 
                      :key="areaName"
                      class="allocation-item"
                    >
                      <div class="area-label">
                        <el-icon><Location /></el-icon>
                        <span>{{ areaName }}</span>
                      </div>
                      <el-input-number
                        v-model="switchNodeDialog.form.areaQuantities[areaName]"
                        :min="0"
                        :max="selectedRows.length"
                        size="small"
                        style="width: 120px"
                        @change="validateTotalQuantity"
                      />
                      <span class="quantity-label">个节点</span>
                    </div>
                  </div>
                  
                  <!-- 当地区数量较多时，使用表格布局 -->
                  <div 
                    v-else
                    class="allocation-table-container"
                  >
                    <el-table
                      :data="getAreaTableData()"
                      size="small"
                      max-height="300"
                      style="width: 100%"
                      class="allocation-table"
                    >
                      <el-table-column 
                        prop="areaName" 
                        label="地区" 
                        min-width="150"
                      >
                        <template #default="{ row }">
                          <div class="table-area-label">
                            <el-icon><Location /></el-icon>
                            <span>{{ row.areaName }}</span>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column 
                        prop="quantity" 
                        label="分配节点数" 
                        width="150"
                        align="center"
                      >
                        <template #default="{ row }">
                          <el-input-number
                            v-model="switchNodeDialog.form.areaQuantities[row.areaName]"
                            :min="0"
                            :max="selectedRows.length"
                            size="small"
                            style="width: 100px"
                            @change="validateTotalQuantity"
                          />
                        </template>
                      </el-table-column>
                      <el-table-column 
                        label="操作" 
                        width="100"
                        align="center"
                      >
                        <template #default="{ row }">
                          <el-button
                            type="text"
                            size="small"
                            @click="setAreaQuantity(row.areaName, Math.floor(selectedRows.length / switchNodeDialog.form.AreaName.length))"
                          >
                            平均
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    
                    <!-- 批量操作按钮 -->
                    <div class="batch-allocation-actions">
                      <el-button
                        size="small"
                        @click="clearAllAllocations"
                      >
                        <el-icon><Delete /></el-icon>
                        清空分配
                      </el-button>
                      <el-button
                        type="primary"
                        size="small"
                        @click="setAllAreasEqual"
                      >
                        <el-icon><Grid /></el-icon>
                        全部平均
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
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
                @change="fetchRenewPrice"
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

          <el-divider class="section-divider">
            <el-icon><Money /></el-icon>
          </el-divider>

          <div class="renew-price-section">
            <h4 class="section-title">
              <el-icon><Money /></el-icon>
              续费价格
            </h4>
            <div class="renew-price-info">
              <div class="price-label">总价:</div>
              <div class="price-value" v-if="renewDialog.priceLoading">加载中...</div>
              <div class="price-value" v-else>{{ renewDialog.price || '0.00' }}元</div>
            </div>
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
                <el-radio value="laoyu" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">老鱼格式</div>
                    <div class="format-desc">地址/账号/密码/有效期</div>
                  </div>
                </el-radio>
                <el-radio value="laoyuRegion" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">老鱼带地区格式</div>
                    <div class="format-desc">地址/账号/密码/地区名/有效期</div>
                  </div>
                </el-radio>
                <el-radio value="wanan" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">万安格式</div>
                    <div class="format-desc">地址|账号|密码|有效期</div>
                  </div>
                </el-radio>
                <el-radio value="youmi" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">有米格式</div>
                    <div class="format-desc">地址|账号|密码|有效期</div>
                  </div>
                </el-radio>
                <el-radio value="youmiRegion" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">有米带地区格式</div>
                    <div class="format-desc">地址|账号|密码|地区名|有效期</div>
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
                <el-radio value="laoyu" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">老鱼格式</div>
                    <div class="format-desc">地址/账号/密码/有效期</div>
                  </div>
                </el-radio>
                <el-radio value="laoyuRegion" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">老鱼带地区格式</div>
                    <div class="format-desc">地址/账号/密码/地区名/有效期</div>
                  </div>
                </el-radio>
                <el-radio value="wanan" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">万安格式</div>
                    <div class="format-desc">地址|账号|密码|有效期</div>
                  </div>
                </el-radio>
                <el-radio value="youmi" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">有米格式</div>
                    <div class="format-desc">地址|账号|密码|有效期</div>
                  </div>
                </el-radio>
                <el-radio value="youmiRegion" class="format-radio">
                  <div class="format-option">
                    <div class="format-title">有米带地区格式</div>
                    <div class="format-desc">地址|账号|密码|地区名|有效期</div>
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
    
    <!-- 订单日志对话框 -->
    <el-dialog
      v-model="orderLogDialog.visible"
      width="900px"
      :close-on-click-modal="false"
      class="order-log-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="dialog-icon"><Document /></el-icon>
          <span class="dialog-title">订单日志</span>
        </div>
      </template>
      
      <div class="dialog-content">
        <!-- 当前节点信息 -->
        <div class="current-node-section">
          <h4 class="section-title">
            <el-icon><Monitor /></el-icon>
            节点信息
          </h4>
          <div class="current-node-info">
            <div class="node-item">
              <el-icon><VideoPlay /></el-icon>
              <span class="label">游戏:</span>
              <span class="value">{{ orderLogDialog.currentNode?.Game }}</span>
            </div>
            <div class="node-item">
              <el-icon><Location /></el-icon>
              <span class="label">区域:</span>
              <span class="value">{{ orderLogDialog.currentNode?.Area }}</span>
            </div>
            <div class="node-item">
              <el-icon><Connection /></el-icon>
              <span class="label">节点IP:</span>
              <span class="value">{{ orderLogDialog.currentNode?.IpAddress }}</span>
            </div>
            <div class="node-item">
              <el-icon><Timer /></el-icon>
              <span class="label">到期时间:</span>
              <span class="value expire-time">{{ orderLogDialog.currentNode?.EndTime }}</span>
            </div>
          </div>
        </div>
        
        <!-- 订单日志表格 -->
        <div class="order-log-section">
          <h4 class="section-title">
            <el-icon><List /></el-icon>
            订单记录
          </h4>
          <el-table
            :data="orderLogDialog.tableData"
            v-loading="orderLogDialog.loading"
            stripe
            style="width: 100%"
            max-height="400px"
          >
            <el-table-column prop="id" label="订单ID" width="120" />
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag
                  :type="row.type === '购买' ? 'success' : row.type === '续费' ? 'warning' : 'info'"
                  size="small"
                >
                  {{ row.type }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="describe" label="描述" width="120" />
            <el-table-column prop="time" label="操作时间" width="160" />
            <el-table-column prop="ip" label="IP地址" width="120" />
            <el-table-column prop="game" label="游戏" min-width="140" />
            <el-table-column prop="area" label="区域" width="100" />
            <el-table-column prop="start_time" label="开始时间" width="160" />
            <el-table-column prop="end_time" label="结束时间" width="160" />
            <el-table-column prop="amount" label="金额变动" width="100">
              <template #default="{ row }">
                <el-tag
                  :type="getAmountType(row.amount)"
                  size="small"
                >
                  {{ parseFloat(row.amount) > 0 ? '+' : '' }}{{ parseFloat(row.amount).toFixed(2) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-wrapper" style="margin-top: 16px;">
            <el-pagination
              v-model:current-page="orderLogDialog.pagination.page"
              v-model:page-size="orderLogDialog.pagination.size"
              :page-sizes="[10, 20, 50]"
              :total="orderLogDialog.pagination.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleOrderLogSizeChange"
              @current-change="handleOrderLogPageChange"
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" @click="orderLogDialog.visible = false">
            <el-icon><Close /></el-icon>
            关闭
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
  CopyDocument, List, Document, Download, Money, MagicStick, Delete, Grid
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { getNodeData, setGroup, getGameData, getAreaData, switchNode, renewNode, setNodePassword, getNodeRenewPrice } from '@/api/auth'
import { getNodeOrder } from '@/api/finance'

// 路由
const router = useRouter()

// 内置省份数据
const PROVINCE_LIST = [
  { Province: '全国' }, // 新增全国选项
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
    AreaName: [], // 修改为数组支持多选
    areaQuantities: {} // 新增：存储每个地区的节点数量
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
      { required: true, type: 'array', min: 1, message: '请至少选择一个目标地区', trigger: 'change' }
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
  },
  price: null, // 新增：续费价格
  priceLoading: false // 新增：价格加载状态
})

const renewFormRef = ref()

// 批量复制对话框
const copyDialog = reactive({
  visible: false,
  loading: false,
  form: {
    format: 'laoyu'
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
    format: 'laoyu'
  },
  rules: {
    format: [
      { required: true, message: '请选择导出格式', trigger: 'change' }
    ]
  }
})

const exportFormRef = ref()

// 订单日志对话框
const orderLogDialog = reactive({
  visible: false,
  loading: false,
  currentNode: null,
  tableData: [],
  pagination: {
    page: 1,
    size: 20,
    total: 0
  }
})

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
  renewDialog.price = null // 新增：重置价格
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
    switchNodeDialog.form.AreaName = []
    switchNodeDialog.form.areaQuantities = {} // 重置地区节点数量配置
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
      InfoList: [{
        area: row.Area, // 使用当前地区
        quantity: "1"
      }]
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
    case 'orderLog':
      handleOrderLog(row)
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
    renewDialog.price = null // 新增：重置价格
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
    switchNodeDialog.form.AreaName = []
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
          InfoList: [{
            area: group.area,
            quantity: group.nodeIds.length.toString()
          }]
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
  switchNodeDialog.form.AreaName = []
  switchNodeDialog.areaOptions = []
  
  if (!gameName) {
    switchNodeDialog.provinceOptions = []
    return
  }
  
  // 使用内置省份列表
  switchNodeDialog.provinceOptions = PROVINCE_LIST
}

// 获取最大可选择地区数量
const getMaxSelectableAreas = () => {
  // 如果是批量切换节点，返回选中节点的数量
  if (switchNodeDialog.currentNode && switchNodeDialog.currentNode.Game === '批量切换') {
    return selectedRows.value.length
  }
  // 单个节点切换时，只能选择1个地区
  return 1
}

// 处理地区选择变化
const handleAreaSelectionChange = (selectedAreas) => {
  // 如果不是批量切换，直接返回
  if (!switchNodeDialog.currentNode || switchNodeDialog.currentNode.Game !== '批量切换') {
    return
  }
  
  // 更新地区数量配置
  const newQuantities = {}
  selectedAreas.forEach(areaName => {
    // 保留已有的配置，新增的地区设为0
    newQuantities[areaName] = switchNodeDialog.form.areaQuantities[areaName] || 0
  })
  switchNodeDialog.form.areaQuantities = newQuantities
  
  // 如果只选择了一个地区，自动分配所有节点
  if (selectedAreas.length === 1) {
    newQuantities[selectedAreas[0]] = selectedRows.value.length
  } else if (selectedAreas.length > 1) {
    // 多个地区时，自动平均分配
    autoAllocateNodes()
  }
}

// 获取已分配的节点总数
const getTotalAllocatedQuantity = () => {
  return Object.values(switchNodeDialog.form.areaQuantities).reduce((sum, quantity) => {
    return sum + (Number(quantity) || 0)
  }, 0)
}

// 验证节点总数
const validateTotalQuantity = () => {
  const totalAllocated = getTotalAllocatedQuantity()
  const totalNodes = selectedRows.value.length
  
  if (totalAllocated > totalNodes) {
    ElMessage.warning(`分配的节点总数（${totalAllocated}）不能超过选中的节点数量（${totalNodes}）`)
  }
}

// 自动平均分配节点
const autoAllocateNodes = () => {
  const selectedAreas = switchNodeDialog.form.AreaName
  const totalNodes = selectedRows.value.length
  
  if (selectedAreas.length === 0) return
  
  const nodesPerArea = Math.floor(totalNodes / selectedAreas.length)
  const remainingNodes = totalNodes % selectedAreas.length
  
  selectedAreas.forEach((areaName, index) => {
    // 前remainingNodes个地区多分配1个节点
    const quantity = nodesPerArea + (index < remainingNodes ? 1 : 0)
    switchNodeDialog.form.areaQuantities[areaName] = quantity
  })
}

// 获取地区表格数据（用于表格显示）
const getAreaTableData = () => {
  return switchNodeDialog.form.AreaName.map(areaName => ({
    areaName,
    quantity: switchNodeDialog.form.areaQuantities[areaName] || 0
  }))
}

// 设置指定地区的节点数量
const setAreaQuantity = (areaName, quantity) => {
  switchNodeDialog.form.areaQuantities[areaName] = quantity
  validateTotalQuantity()
}

// 清空所有分配
const clearAllAllocations = () => {
  const newQuantities = {}
  switchNodeDialog.form.AreaName.forEach(areaName => {
    newQuantities[areaName] = 0
  })
  switchNodeDialog.form.areaQuantities = newQuantities
}

// 全部地区平均分配
const setAllAreasEqual = () => {
  autoAllocateNodes()
}

// 省份选择变化处理
const handleProvinceChange = async (province) => {
  try {
    // 批量切换节点时，不清空已选择的地区
    const isBatchSwitch = switchNodeDialog.currentNode && switchNodeDialog.currentNode.Game === '批量切换'
    if (!isBatchSwitch) {
      // 只有在非批量切换时才重置地区选择
      switchNodeDialog.form.AreaName = []
    }
    switchNodeDialog.areaOptions = []
    
    if (!province || !switchNodeDialog.form.GameName) return
    
    if (province === '全国') {
      // 选择全国时，不传递省份参数，直接获取全国地区列表
      const areaResponse = await getAreaData({ 
        GameName: switchNodeDialog.form.GameName
        // 不传递 ScreenProvince 参数，获取全国地区
      })
      if (areaResponse.Code === 1000) {
        if (areaResponse.List && areaResponse.List.length > 0) {
          switchNodeDialog.areaOptions = areaResponse.List
        } else {
          switchNodeDialog.areaOptions = []
          ElMessage.warning('全国范围内暂无可用节点')
        }
      } else {
        ElMessage.error(areaResponse.Msg || '获取全国地区列表失败')
      }
    } else {
      // 获取指定省份下的地区列表
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
    }
  } catch (error) {
    console.error('获取地区列表失败:', error)
    ElMessage.error('获取地区列表失败')
  }
}

// 监听续费时长变化，获取价格
const fetchRenewPrice = async () => {
  renewDialog.price = null
  if (!renewDialog.form.renewTime) return
  renewDialog.priceLoading = true
  let nodeIds
  if (renewDialog.currentNode && renewDialog.currentNode.Game === '批量续费') {
    nodeIds = selectedRows.value.map(row => row.Id)
  } else if (renewDialog.currentNode && renewDialog.currentNode.Id) {
    nodeIds = [renewDialog.currentNode.Id]
  } else {
    renewDialog.priceLoading = false
    return
  }
  try {
    const res = await getNodeRenewPrice({
      Id: nodeIds,
      RenewTime: renewDialog.form.renewTime
    })
    if (res.Code === 1000 && res.List) {
      if (renewDialog.currentNode.Game === '批量续费') {
        renewDialog.price = res.List.reduce((sum, item) => sum + (item.Price || 0), 0)
      } else {
        renewDialog.price = res.List[0]?.Price ?? null
      }
    } else {
      renewDialog.price = null
    }
  } catch (e) {
    renewDialog.price = null
  } finally {
    renewDialog.priceLoading = false
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
    
    // 批量切换时的验证
    if (isBatchSwitch && Array.isArray(switchNodeDialog.form.AreaName)) {
      const selectedAreaCount = switchNodeDialog.form.AreaName.length
      if (selectedAreaCount === 0) {
        ElMessage.error('请至少选择一个地区')
        switchNodeDialog.loading = false
        return
      }
      
      // 验证节点分配总数
      const totalAllocated = getTotalAllocatedQuantity()
      if (totalAllocated !== nodeCount) {
        ElMessage.error(`节点分配不正确：已分配${totalAllocated}个节点，但选中了${nodeCount}个节点，请确保分配的节点总数等于选中的节点数量`)
        switchNodeDialog.loading = false
        return
      }
      
      // 验证每个地区的分配数量不能为0
      const hasZeroAllocation = Object.values(switchNodeDialog.form.areaQuantities).some(quantity => Number(quantity) === 0)
      if (hasZeroAllocation) {
        ElMessage.error('每个选中的地区至少需要分配1个节点')
        switchNodeDialog.loading = false
        return
      }
    }
    
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
    
    // 准备InfoList，处理多选地区的情况
    let infoList
    if (Array.isArray(switchNodeDialog.form.AreaName) && switchNodeDialog.form.AreaName.length > 0) {
      // 多选地区的情况
      const selectedAreas = switchNodeDialog.form.AreaName
      
      // 如果是批量切换，使用自定义的地区节点数量分配
       if (isBatchSwitch) {
         infoList = selectedAreas.map(areaName => {
           const quantity = Number(switchNodeDialog.form.areaQuantities[areaName]) || 0
           return {
             area: areaName,
             quantity: quantity.toString()
           }
         })
       } else {
        // 单个节点切换时，平均分配到选中的地区
        const nodesPerArea = Math.ceil(nodeIds.length / selectedAreas.length)
        
        infoList = selectedAreas.map((areaName, index) => {
          // 计算每个地区分配的节点数量
          const startIndex = index * nodesPerArea
          const endIndex = Math.min(startIndex + nodesPerArea, nodeIds.length)
          const quantity = endIndex - startIndex
          
          return {
            area: areaName,
            quantity: quantity.toString()
          }
        })
      }
    } else {
      // 兼容旧版本单选的情况
      infoList = [{
        area: switchNodeDialog.form.AreaName,
        quantity: nodeIds.length.toString()
      }]
    }
    
    // 调用切换节点接口
    const response = await switchNode({
      Id: nodeIds,
      GameName: switchNodeDialog.form.GameName,
      InfoList: infoList
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
    
    // 组合地址（IP:端口）
    const address = `${ip}:${port}`
    
    switch (format) {
      case 'laoyu':
        // 老鱼格式：地址/账号/密码/有效期
        return `${address}/${user}/${pass}/${endTime}`
      
      case 'laoyuRegion':
        // 老鱼带地区格式：地址/账号/密码/地区名/有效期
        return `${address}/${user}/${pass}/${area}/${endTime}`
      
      case 'wanan':
        // 万安格式：地址|账号|密码|有效期
        return `${address}|${user}|${pass}|${endTime}`
      
      case 'youmi':
        // 有米格式：地址|账号|密码|有效期
        return `${address}|${user}|${pass}|${endTime}`
      
      case 'youmiRegion':
        // 有米带地区格式：地址|账号|密码|地区名|有效期
        return `${address}|${user}|${pass}|${area}|${endTime}`
      
      default:
        // 默认使用老鱼格式
        return `${address}/${user}/${pass}/${endTime}`
    }
  })
  
  return lines.join('\n')
}

// 处理订单日志
const handleOrderLog = (row) => {
  orderLogDialog.currentNode = row
  orderLogDialog.pagination.page = 1
  orderLogDialog.visible = true
  fetchOrderLogData()
}

// 获取订单日志数据
const fetchOrderLogData = async () => {
  orderLogDialog.loading = true
  try {
    const params = {
      screenId: orderLogDialog.currentNode.Id,
      page: orderLogDialog.pagination.page,
      pageSize: orderLogDialog.pagination.size
    }
    
    const response = await getNodeOrder(params)
    
    if (response.Code === 1000) {
      orderLogDialog.tableData = response.List || []
      orderLogDialog.pagination.total = response.RowCount || 0
    } else {
      ElMessage.error(response.Msg || '获取订单日志失败')
      orderLogDialog.tableData = []
      orderLogDialog.pagination.total = 0
    }
  } catch (error) {
    console.error('获取订单日志失败:', error)
    ElMessage.error('获取订单日志失败')
    orderLogDialog.tableData = []
    orderLogDialog.pagination.total = 0
  } finally {
    orderLogDialog.loading = false
  }
}

// 订单日志分页处理
const handleOrderLogPageChange = (page) => {
  orderLogDialog.pagination.page = page
  fetchOrderLogData()
}

// 订单日志页面大小变化处理
const handleOrderLogSizeChange = (size) => {
  orderLogDialog.pagination.size = size
  orderLogDialog.pagination.page = 1
  fetchOrderLogData()
}

// 获取金额类型样式
const getAmountType = (amount) => {
  const num = parseFloat(amount)
  if (num > 0) {
    return 'success' // 收入
  } else if (num < 0) {
    return 'danger' // 支出
  } else {
    return 'info' // 无变化
  }
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
:deep(.renew-dialog),
:deep(.order-log-dialog) {
  max-height: 80vh;
  
  .el-dialog__header {
    padding: 20px 24px 0;
    border-bottom: none;
  }
  
  .el-dialog__body {
    padding: 20px 24px;
    max-height: calc(80vh - 140px);
    overflow-y: auto;
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

.renew-price-section {
  margin-top: 24px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  border: 1px solid #e4e7ed;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #606266;

    .el-icon {
      color: #409eff;
    }
  }

  .renew-price-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .price-label {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }

    .price-value {
      font-size: 24px;
      font-weight: 700;
      color: #f56c6c;
      font-family: 'Arial', sans-serif;
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

// 订单日志对话框特定样式
.order-log-section {
  margin-top: 24px;
  
  .el-table {
    border-radius: 8px;
    overflow: hidden;
    
    :deep(.el-table__header) {
      background-color: #f8f9fa;
      
      th {
        background-color: #f8f9fa !important;
        color: #495057;
        font-weight: 600;
      }
    }
    
    :deep(.el-table__row) {
      &:hover {
        background-color: #f8f9fa;
      }
    }
  }
  
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
}

.area-select-tip {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  
  .el-text {
    display: flex;
    align-items: center;
    gap: 6px;
    
    &::before {
      content: "ℹ️";
      font-size: 14px;
    }
  }
}

/* 节点分配区域样式 */
.node-allocation-section {
  background-color: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  border-left: 4px solid #67c23a;
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.allocation-header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.allocation-summary {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.allocation-container {
  margin-top: 16px;
}

.allocation-list {
  margin-bottom: 16px;
}

.allocation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.allocation-item:hover {
  border-color: #67c23a;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);
}

.allocation-item:last-child {
  margin-bottom: 0;
}

.area-label {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 120px;
  font-weight: 500;
  color: #303133;
}

.area-label .el-icon {
  color: #67c23a;
  font-size: 14px;
}

.table-area-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #303133;
}

.table-area-label .el-icon {
  color: #67c23a;
  font-size: 14px;
}

.quantity-label {
  color: #606266;
  font-size: 13px;
}

.allocation-warning {
  color: #e6a23c;
  font-weight: 500;
}

/* 表格布局样式 */
.allocation-table-container {
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  overflow: hidden;
  max-height: 300px;
}

.allocation-table {
  :deep(.el-table__header) {
    background-color: #f5f7fa;
    
    th {
      background-color: #f5f7fa !important;
      color: #606266;
      font-weight: 600;
      border-bottom: 1px solid #e4e7ed;
    }
  }
  
  :deep(.el-table__body) {
    tr {
      &:hover {
        background-color: #f0f9ff;
      }
    }
    
    td {
      border-bottom: 1px solid #f0f0f0;
      padding: 8px 0;
    }
  }
  
  :deep(.el-table__row) {
    transition: background-color 0.3s ease;
  }
}

/* 批量操作按钮 */
.batch-allocation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-top: 1px solid #e4e7ed;
}

.batch-allocation-actions .el-button {
  border-radius: 4px;
  font-size: 12px;
  padding: 6px 12px;
  
  .el-icon {
    margin-right: 4px;
  }
}

/* 响应式设计 - 节点分配区域 */
@media (max-width: 768px) {
  .allocation-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .area-label {
    min-width: auto;
  }
  
  .allocation-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>