<template>
  <div class="recharge-container">
    <!-- 账户余额显示 -->
    <div class="balance-section">
      <div class="balance-label">账户余额（元）</div>
      <div class="balance-amount">{{ userStore.userInfo.balance || 3.5 }}</div>
      <div class="recharge-records-link">
        <router-link to="/user/recharge-records">充值记录</router-link>
      </div>
    </div>

    <!-- 在线充值卡片 -->
    <div class="recharge-card">
      <div class="card-title">在线充值</div>
      
      <!-- 充值金额输入 -->
      <div class="amount-input-section">
        <div class="input-label">充值金额：</div>
        <el-input
          v-model.number="selectedAmount"
          placeholder="1"
          type="number"
          :min="1"
          :max="10000"
          class="amount-input"
        />
      </div>
      
      <!-- 支付方式 -->
      <div class="payment-section">
        <div class="payment-label">支付方式：</div>
        <div class="payment-methods">
          <div
            class="payment-option"
            :class="{ selected: paymentMethod === 'alipay', disabled: !alipayEnabled }"
            @click="onAlipayClick"
          >
            <img src="/alipay.png" alt="支付宝" class="payment-icon" />
            <span class="payment-text">支付宝<br>ALIPAY</span>
          </div>
          <div
            class="payment-option"
            :class="{ selected: paymentMethod === 'wechat', disabled: !wechatEnabled }"
            @click="onWechatClick"
          >
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="payment-icon">
              <rect width="32" height="32" rx="8" fill="#2DC100"/>
              <g>
                <ellipse cx="20.5" cy="14.5" rx="6.5" ry="5.5" fill="#fff"/>
                <ellipse cx="13" cy="19" rx="7" ry="6" fill="#fff"/>
                <circle cx="11.5" cy="18.5" r="1" fill="#2DC100"/>
                <circle cx="15.5" cy="18.5" r="1" fill="#2DC100"/>
                <circle cx="19" cy="13.5" r="1" fill="#2DC100"/>
                <circle cx="22.5" cy="13.5" r="1" fill="#2DC100"/>
              </g>
            </svg>
            <span class="payment-text">微信支付<br>WeChat Pay</span>
          </div>
        </div>
      </div>
      
      <!-- 充值按钮 -->
      <div class="submit-section">
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!selectedAmount || selectedAmount <= 0"
          @click="handleRecharge"
          class="recharge-btn"
        >
          立即充值
        </el-button>
      </div>
    </div>
    
    <!-- 支付二维码弹窗 -->
    <el-dialog
      v-model="showQrCode"
      title="支付宝支付"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="qr-code-container">
        <div class="payment-info">
          <p>充值金额：<span class="amount">¥{{ selectedAmount }}</span></p>
          <p>订单号：<span class="order-number">{{ orderNumber }}</span></p>
        </div>
        
        <div class="qr-code-wrapper">
          <div ref="qrCodeRef" class="qr-code"></div>
          <p class="qr-tip">请使用{{ paymentMethod === 'wechat' ? '微信' : '支付宝' }}扫描二维码完成支付</p>
          <div class="auto-check-tip" v-if="autoCheckTimer">
            <el-icon class="rotating"><Loading /></el-icon>
            <span>系统正在自动检查支付状态...</span>
          </div>
        </div>
        
        <div class="payment-status">
          <el-button @click="checkPaymentStatus" :loading="checkingStatus">
            检查支付状态
          </el-button>
          <el-button @click="cancelPayment" type="info">
            取消支付
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { rechargeOnline, getPayState, getPayOptions } from '@/api/finance'
import QRCode from 'qrcode'

const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const showQrCode = ref(false)
const checkingStatus = ref(false)
const selectedAmount = ref(1)
const paymentMethod = ref('alipay')
const orderNumber = ref('')
const paymentUrl = ref('')
const qrCodeRef = ref(null)
const autoCheckTimer = ref(null)
const autoCheckCount = ref(0)
const alipayEnabled = ref(true) // 支付宝支付是否开启
const wechatEnabled = ref(false) // 微信支付是否开启

// 处理充值
const handleRecharge = async () => {
  if (!selectedAmount.value || selectedAmount.value <= 0) {
    ElMessage.error('请选择充值金额')
    return
  }
  
  if (selectedAmount.value > 10000) {
    ElMessage.error('单次充值金额不能超过10000元')
    return
  }
  
  loading.value = true
  
  try {
    const response = await rechargeOnline(selectedAmount.value, paymentMethod.value)
    
    if (response.Code === 1000) {
      orderNumber.value = response.OrderNumber
      paymentUrl.value = response.Parameter
      showQrCode.value = true
      
      // 支付宝返回的链接本身包含二维码，直接使用
      await nextTick()
      await displayPaymentUrl(response.Parameter)
      
      // 开始自动检查支付状态
      startAutoCheckPayment()
      
      ElMessage.success('订单创建成功，请扫码支付')
    } else {
      ElMessage.error(response.Message || '创建订单失败')
    }
  } catch (error) {
    console.error('充值失败:', error)
    ElMessage.error('充值失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 显示支付链接或二维码
const displayPaymentUrl = async (url) => {
  try {
    if (qrCodeRef.value) {
      // 微信支付：直接将返回的Parameter生成二维码
      if (paymentMethod.value === 'wechat') {
        try {
          const qrCodeDataURL = await QRCode.toDataURL(url, {
            width: 200,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
          qrCodeRef.value.innerHTML = `
            <img src="${qrCodeDataURL}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);" />
          `
        } catch (qrError) {
          console.error('生成微信支付二维码失败:', qrError)
          ElMessage.error('生成微信支付二维码失败')
        }
      } else {
        // 支付宝支付：判断是否为图片链接或使用iframe
        if (/\.(png|jpg|jpeg|gif|bmp|webp)(\?.*)?$/i.test(url)) {
          qrCodeRef.value.innerHTML = `
            <img src="${url}" style="width:100%;height:100%;object-fit:contain;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);" />
          `
        } else {
          qrCodeRef.value.innerHTML = `
            <iframe 
              src="${url}" 
              frameborder="0" 
              style="width:100%;height:100%;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);overflow:hidden;scrolling:no;"
            ></iframe>
          `
        }
      }
    }
  } catch (error) {
    console.error('显示支付链接失败:', error)
    ElMessage.error('显示支付链接失败')
  }
}

// 检查支付状态
const checkPaymentStatus = async () => {
  if (!orderNumber.value) {
    ElMessage.error('订单号不存在')
    return
  }
  
  checkingStatus.value = true
  
  try {
    // 调用检查支付状态的API
    const response = await getPayState(orderNumber.value)
    
    if (response.Code === 1000) {
      // Code=1000 表示支付成功
      ElMessage.success('支付成功！')
      stopAutoCheckPayment()
      showQrCode.value = false
      orderNumber.value = ''
      paymentUrl.value = ''
      
      // 刷新用户信息
      await userStore.getUserInfoAction()
      
      // 发送事件通知充值记录页面刷新
      window.dispatchEvent(new CustomEvent('recharge-success'))
    } else if (response.Code === -111) {
      // 处理订单未支付的情况
      ElMessage.warning('订单尚未支付，请完成支付后再次检查')
    } else {
      // 处理其他错误情况
      const errorMsg = response.Msg || response.Message || '查询支付状态失败'
      ElMessage.error(errorMsg)
    }
  } catch (error) {
    console.error('检查支付状态失败:', error)
    ElMessage.error('检查支付状态失败，请稍后重试')
  } finally {
    checkingStatus.value = false
  }
}

// 取消支付
const cancelPayment = () => {
  ElMessageBox.confirm('确定要取消支付吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    stopAutoCheckPayment()
    showQrCode.value = false
    orderNumber.value = ''
    paymentUrl.value = ''
  })
}

// 开始自动检查支付状态
const startAutoCheckPayment = () => {
  // 清除之前的定时器
  stopAutoCheckPayment()
  
  autoCheckCount.value = 0
  
  // 每5秒检查一次，最多检查24次（2分钟）
  autoCheckTimer.value = setInterval(async () => {
    autoCheckCount.value++
    
    if (autoCheckCount.value > 24) {
      stopAutoCheckPayment()
      ElMessage.info('自动检查已停止，请手动检查支付状态')
      return
    }
    
    // 静默检查支付状态
    await silentCheckPaymentStatus()
  }, 5000)
}

// 停止自动检查支付状态
const stopAutoCheckPayment = () => {
  if (autoCheckTimer.value) {
    clearInterval(autoCheckTimer.value)
    autoCheckTimer.value = null
  }
  autoCheckCount.value = 0
}

// 静默检查支付状态（不显示加载状态）
const silentCheckPaymentStatus = async () => {
  if (!orderNumber.value) {
    return
  }
  
  try {
    const response = await getPayState(orderNumber.value)
    
    if (response.Code === 1000) {
      // Code=1000 表示支付成功
      ElMessage.success('支付成功！')
      stopAutoCheckPayment()
      showQrCode.value = false
      orderNumber.value = ''
      paymentUrl.value = ''
      
      // 刷新用户信息
      await userStore.getUserInfoAction()
      
      // 发送事件通知充值记录页面刷新
      window.dispatchEvent(new CustomEvent('recharge-success'))
    }
  } catch (error) {
    console.error('自动检查支付状态失败:', error)
  }
}

// 加载支付选项
const loadPayOptions = async () => {
  try {
    const response = await getPayOptions()
    
    if (response.Code === 1000) {
      alipayEnabled.value = response.alipay || false
      wechatEnabled.value = response.wxpay || false
      
      // 如果当前选择的支付方式未启用，自动切换到启用的支付方式
      if (paymentMethod.value === 'alipay' && !alipayEnabled.value) {
        if (wechatEnabled.value) {
          paymentMethod.value = 'wechat'
        }
      } else if (paymentMethod.value === 'wechat' && !wechatEnabled.value) {
        if (alipayEnabled.value) {
          paymentMethod.value = 'alipay'
        }
      }
    }
  } catch (error) {
    console.error('加载支付选项失败:', error)
    // 如果加载失败，保持默认状态
  }
}

// 点击支付宝支付卡片的处理函数
const onAlipayClick = () => {
  if (!alipayEnabled.value) {
    ElMessage.warning('支付宝支付未开启')
    return
  }
  paymentMethod.value = 'alipay'
}

// 点击微信支付卡片的处理函数
const onWechatClick = () => {
  if (!wechatEnabled.value) {
    ElMessage.warning('微信支付未开启')
    return
  }
  paymentMethod.value = 'wechat'
}

// 组件挂载时加载数据
onMounted(() => {
  loadPayOptions()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAutoCheckPayment()
})
</script>

<style lang="scss" scoped>
.recharge-container {
  /* max-width: 800px; */
  margin-left: 0;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

// 账户余额区域
.balance-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .balance-label {
    color: #666;
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .balance-amount {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 12px;
  }
  
  .recharge-records-link {
    text-align: right;
    
    a {
      color: #409eff;
      text-decoration: none;
      font-size: 14px;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// 在线充值卡片
.recharge-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .card-title {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
}

// 充值金额输入区域
.amount-input-section {
  margin-bottom: 24px;
  
  .input-label {
    color: #333;
    font-size: 14px;
    margin-bottom: 8px;
    
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  
  .amount-input {
    width: 200px;
    
    :deep(.el-input__wrapper) {
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      height: 32px;
      
      &:hover {
        border-color: #c0c4cc;
      }
      
      &.is-focus {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }
    
    :deep(.el-input__inner) {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
    }
  }
}
  
// 支付方式区域
.payment-section {
  margin-bottom: 24px;
  
  .payment-label {
    color: #333;
    font-size: 14px;
    margin-bottom: 12px;
    
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  
  .payment-methods {
    display: flex;
    gap: 16px;
  }
  
  .payment-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 80px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
    
    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    }
    
    &.selected {
      border-color: #409eff;
      background: #ecf5ff;
      
      .payment-text {
        color: #409eff;
      }
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f5f5f5;
      
      &:hover {
        border-color: #dcdfe6;
        box-shadow: none;
      }
    }
    
    .payment-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 4px;
    }
    
    .payment-text {
      font-size: 12px;
      color: #666;
      text-align: center;
      line-height: 1.2;
    }
  }
}
        
// 充值按钮区域
.submit-section {
  margin-top: 32px;
  
  .recharge-btn {
    width: auto;
    min-width: 120px;
    height: 32px;
    background: #409eff;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.3s ease;
    padding: 0 24px;
    display: inline-block;
    
    &:hover {
      background: #66b1ff;
    }
    
    &:disabled {
      background: #c0c4cc;
      cursor: not-allowed;
    }
  }
 }

// 二维码弹窗样式
.qr-code-container {
  text-align: center;
  
  .payment-info {
    background: #f5f7fa;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 24px;
    
    p {
      margin: 8px 0;
      color: #606266;
      font-size: 14px;
      
      .amount {
        color: #e6a23c;
        font-weight: 600;
        font-size: 18px;
      }
      
      .order-number {
        color: #909399;
        font-family: 'Courier New', monospace;
        background: rgba(144, 147, 153, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
    }
  }
  
  .qr-code-wrapper {
    margin: 24px 0;
    
    .qr-code {
      width: 205px;
      height: 210px;
      margin: 0 auto 16px auto;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      border: 2px solid #f0f0f0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .qr-tip {
      color: #909399;
      font-size: 14px;
      margin: 0;
    }
    
    .auto-check-tip {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
      padding: 8px 16px;
      background: #ecf5ff;
      border-radius: 4px;
      color: #409eff;
      font-size: 12px;
      
      .el-icon {
        margin-right: 8px;
        
        &.rotating {
          animation: rotate 1s linear infinite;
        }
      }
    }
  }
  
  .payment-status {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
    
    .el-button {
      border-radius: 4px;
      font-size: 14px;
      padding: 8px 16px;
    }
  }
}

// 动画效果
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .recharge-container {
    padding: 16px;
  }
  
  .balance-section,
  .recharge-card {
    padding: 16px;
  }
  
  .payment-methods {
    flex-direction: column;
    
    .payment-option {
      width: 100%;
      height: 60px;
      flex-direction: row;
      justify-content: flex-start;
      padding: 0 16px;
      
      .payment-icon {
        margin-right: 12px;
        margin-bottom: 0;
      }
      
      .payment-text {
        text-align: left;
      }
    }
  }
}
</style>