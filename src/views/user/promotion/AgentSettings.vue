<template>
  <div class="agent-settings-container">
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <h3>提现设置</h3>
          <p>管理您的提现账户设置</p>
        </div>
      </template>
      
      <div class="settings-content">
        <!-- 提现账户设置 -->
        <el-card class="withdraw-account-card" shadow="never">
          <template #header>
            <h4>提现账户设置</h4>
          </template>
          <el-form
            ref="withdrawFormRef"
            :model="withdrawForm"
            :rules="withdrawRules"
            label-width="120px"
            class="withdraw-form"
          >
            <el-form-item label="提现方式" prop="withdrawType">
              <el-input value="支付宝" disabled style="width: 300px" />
            </el-form-item>
            
            <!-- 支付宝账户 -->
            <el-form-item label="支付宝账号" prop="alipayAccount">
              <el-input
                v-model="withdrawForm.alipayAccount"
                placeholder="请输入支付宝账号"
                clearable
                style="width: 300px"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveWithdrawAccount" :loading="withdrawLoading">
                保存提现账户
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>


      </div>
    </el-card>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { setSettlementAccount, getSettlementAccount } from '@/api/finance'

// 提现账户表单
const withdrawFormRef = ref()
const withdrawForm = reactive({
  withdrawType: 'alipay',
  alipayAccount: ''
})



// 提现账户验证规则
const withdrawRules = {
  alipayAccount: [
    { required: true, message: '请输入支付宝账号', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}



// 加载状态
const withdrawLoading = ref(false)



// 保存提现账户
const saveWithdrawAccount = async () => {
  try {
    await withdrawFormRef.value.validate()
    
    // 弹窗警告用户支付宝账号需要与实名信息一致
    await ElMessageBox.confirm(
      '请确保您的支付宝账号与实名认证信息一致，否则可能导致提现失败。确认继续设置吗？',
      '重要提醒',
      {
        confirmButtonText: '确认设置',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false
      }
    )
    
    withdrawLoading.value = true
    
    // 调用API设置提现账户
    const response = await setSettlementAccount({
      Action: "SetSettlementAccount",
      SettlementBank: "支付宝",
      SettlementAccount: withdrawForm.alipayAccount
    })
    
    withdrawLoading.value = false
    
    if (response.Code === 1000) {
      ElMessage.success(response.Msg || '设置成功')
    } else {
      ElMessage.error(response.Msg || '设置失败')
    }
  } catch (error) {
    withdrawLoading.value = false
    if (error !== 'cancel') {
      console.error('保存提现账户失败:', error)
      ElMessage.error('网络错误，请稍后重试')
    }
  }
}



// 初始化数据
const initData = async () => {
  try {
    // 获取当前提现账户信息
    const response = await getSettlementAccount()
    if (response.code === 1000) {
      // 如果有提现账户信息，填充到表单中
      if (response.settlement_account_number) {
        withdrawForm.alipayAccount = response.settlement_account_number
      }
    }
  } catch (error) {
    console.error('获取提现账户信息失败:', error)
  }
}

onMounted(() => {
  initData()
})
</script>

<style scoped>
.agent-settings-container {
  padding: 20px;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  text-align: center;
}

.card-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.settings-content {
  padding: 20px 0;
}

.withdraw-account-card {
  margin-bottom: 30px;
}

.withdraw-account-card :deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}

.withdraw-account-card h4 {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.withdraw-form {
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .agent-settings-container {
    padding: 10px;
  }
  
  .withdraw-form {
    padding: 10px;
  }
}
</style>