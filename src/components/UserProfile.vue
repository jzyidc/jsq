<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>用户信息</span>
          <el-button type="primary" @click="refreshUserInfo">刷新信息</el-button>
        </div>
      </template>
      
      <div class="profile-content">
        <!-- 基本信息 -->
        <div class="info-section">
          <h3>基本信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>用户名：</label>
                <span>{{ userInfo.username || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>手机号：</label>
                <span>{{ userInfo.phone || '未绑定' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>角色：</label>
                <el-tag type="primary">
                  普通用户
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>注册时间：</label>
                <span>{{ userInfo.createTime || '未知' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 联系信息 -->
        <div class="info-section">
          <h3>联系信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>官方QQ：</label>
                <span>{{ userInfo.officialQQ || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>个人QQ：</label>
                <span>{{ userInfo.qq || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>推广代理：</label>
                <span>{{ userInfo.agent || '未设置' }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>IP地址：</label>
                <span>{{ userInfo.ipAddress || '未知' }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 账户信息 -->
        <div class="info-section">
          <h3>账户信息</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="info-item">
                <label>账户余额：</label>
                <span class="balance">¥{{ userInfo.balance.toFixed(2) }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>累计充值：</label>
                <span class="recharge">¥{{ userInfo.totalRechargeAmount.toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 设备统计 -->
        <div class="info-section">
          <h3>设备统计</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ userInfo.nodeQty }}</div>
                <div class="stat-label">节点数量</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ userInfo.onlineDeviceQty }}</div>
                <div class="stat-label">在线设备</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ userInfo.expireQty }}</div>
                <div class="stat-label">过期设备</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 刷新用户信息
const refreshUserInfo = async () => {
  try {
    await userStore.getUserInfoAction()
    ElMessage.success('用户信息刷新成功')
  } catch (error) {
    ElMessage.error('刷新用户信息失败')
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  padding: 20px 0;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h3 {
  margin-bottom: 15px;
  color: #303133;
  border-bottom: 2px solid #409eff;
  padding-bottom: 5px;
}

.info-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: bold;
  color: #606266;
  min-width: 80px;
  margin-right: 10px;
}

.info-item span {
  color: #303133;
}

.balance {
  color: #67c23a;
  font-weight: bold;
  font-size: 16px;
}

.recharge {
  color: #409eff;
  font-weight: bold;
  font-size: 16px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}
</style>