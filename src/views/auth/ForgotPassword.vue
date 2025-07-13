<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <div class="forgot-password-header">
        <h2>重置密码</h2>
        <p>请输入您的手机号码，我们将发送验证码</p>
      </div>
      
      <el-form
        ref="forgotPasswordFormRef"
        :model="forgotPasswordForm"
        :rules="forgotPasswordRules"
        class="forgot-password-form"
        @keyup.enter="handleResetPassword"
      >
        <el-form-item prop="phone">
          <el-input
            v-model="forgotPasswordForm.phone"
            placeholder="请输入手机号"
            size="large"
            prefix-icon="Phone"
          />
        </el-form-item>
        
        <el-form-item prop="smsCode">
          <div class="sms-code-container">
            <el-input
              v-model="forgotPasswordForm.smsCode"
              placeholder="请输入短信验证码"
              size="large"
              prefix-icon="Message"
              style="flex: 1; margin-right: 10px;"
            />
            <el-button
              type="primary"
              size="large"
              :disabled="smsCodeDisabled"
              @click="sendSmsCode"
              style="width: 120px;"
            >
              {{ smsCodeText }}
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="forgotPasswordForm.password"
            type="password"
            placeholder="请输入新密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="forgotPasswordForm.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="reset-button"
            :loading="loading"
            @click="handleResetPassword"
          >
            重置密码
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <div class="back-to-login">
            想起密码了？
            <el-link type="primary" @click="$router.push('/login')">
              返回登录
            </el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { sendResetPasswordSms, resetPassword } from '@/api/auth'

const router = useRouter()
const forgotPasswordFormRef = ref()
const loading = ref(false)

// 表单数据
const forgotPasswordForm = reactive({
  phone: '',
  smsCode: '',
  password: '',
  confirmPassword: ''
})

// 短信验证码相关状态
const smsCodeDisabled = ref(false)
const smsCodeText = ref('获取验证码')
const countdown = ref(0)

// 自定义验证规则
const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号格式'))
  } else {
    callback()
  }
}

const validateSmsCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入短信验证码'))
  } else if (!/^\d{4,6}$/.test(value)) {
    callback(new Error('请输入正确的验证码格式'))
  } else {
    callback()
  }
}

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度在 6 到 20 个字符'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认新密码'))
  } else if (value !== forgotPasswordForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const forgotPasswordRules = {
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  smsCode: [
    { validator: validateSmsCode, trigger: 'blur' }
  ],
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 发送短信验证码
const sendSmsCode = async () => {
  // 先验证手机号
  if (!forgotPasswordForm.phone) {
    ElMessage.error('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(forgotPasswordForm.phone)) {
    ElMessage.error('请输入正确的手机号格式')
    return
  }
  
  try {
    // 调用发送短信验证码的API
    const response = await sendResetPasswordSms(forgotPasswordForm.phone)
    
    // 处理响应格式：Code为1000表示成功
    if (response.Code === 1000) {
      // 开始倒计时
      smsCodeDisabled.value = true
      countdown.value = 60
      
      const timer = setInterval(() => {
        countdown.value--
        smsCodeText.value = `${countdown.value}秒后重发`
        
        if (countdown.value <= 0) {
          clearInterval(timer)
          smsCodeDisabled.value = false
          smsCodeText.value = '获取验证码'
        }
      }, 1000)
      
      ElMessage.success('验证码已发送')
    } else {
      const errorMessage = response.Msg || response.Message || '发送验证码失败'
      ElMessage.error(errorMessage)
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    const errorMessage = error.message || '网络连接异常，请稍后重试'
    ElMessage.error(errorMessage)
    smsCodeDisabled.value = false
    smsCodeText.value = '获取验证码'
  }
}

// 重置密码处理
const handleResetPassword = async () => {
  if (!forgotPasswordFormRef.value) return
  
  try {
    const valid = await forgotPasswordFormRef.value.validate()
    if (!valid) return
    
    loading.value = true
    
    const resetData = {
      phone: forgotPasswordForm.phone,
      password: forgotPasswordForm.password,
      smsCode: forgotPasswordForm.smsCode
    }
    
    const response = await resetPassword(resetData)
    
    // 处理响应格式：Code为1000表示成功
    if (response.Code === 1000) {
      ElMessage.success('密码重置成功，请使用新密码登录')
      router.push('/login')
    } else {
      const errorMessage = response.Msg || response.Message || '密码重置失败'
      ElMessage.error(errorMessage)
    }
  } catch (error) {
    console.error('重置密码失败:', error)
    const errorMessage = error.message || '网络连接异常，请稍后重试'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.forgot-password-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.forgot-password-box {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    color: #333;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
}

.forgot-password-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.reset-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.back-to-login {
  text-align: center;
  color: #666;
  font-size: 14px;
}

.sms-code-container {
  display: flex;
  align-items: center;
  width: 100%;
}

@media (max-width: 480px) {
  .forgot-password-box {
    padding: 30px 20px;
  }
  
  .forgot-password-header h2 {
    font-size: 20px;
  }
}
</style>