<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>用户注册</h2>
        <p>创建您的账号</p>
      </div>
      
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @keyup.enter="handleRegister"
      >
        <el-form-item prop="PhoneNumber">
          <el-input
            v-model="registerForm.PhoneNumber"
            placeholder="请输入手机号"
            size="large"
            prefix-icon="Phone"
          />
        </el-form-item>
        
        <el-form-item prop="Password">
          <el-input
            v-model="registerForm.Password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        

        <el-form-item prop="Agent">
          <el-input
            v-model="registerForm.Agent"
            placeholder="请输入推荐人"
            size="large"
            prefix-icon="User"
            :readonly="agentReadonly"
          />
        </el-form-item>
        
        <el-form-item prop="SmsCode">
          <div class="sms-code-container">
            <el-input
              v-model="registerForm.SmsCode"
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
        
        <el-form-item prop="agree">
          <el-checkbox v-model="registerForm.agree">
            我已阅读并同意
            <el-link type="primary" :underline="false">《用户协议》</el-link>
            和
            <el-link type="primary" :underline="false">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="register-button"
            :loading="userStore.loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <div class="login-link">
            已有账号？
            <el-link type="primary" @click="$router.push('/login')">
              立即登录
            </el-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { sendSmsCode as sendSmsCodeApi } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const registerFormRef = ref()

// 推荐人字段是否只读
const agentReadonly = ref(false)

// 表单数据
const registerForm = reactive({
  PhoneNumber: '',
  Password: '',
  Agent: '',
  SmsCode: '',
  agree: false
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

const validateAgent = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入代理号'))
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

const validateAgree = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  PhoneNumber: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  Password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  Agent: [
    { validator: validateAgent, trigger: 'blur' }
  ],
  SmsCode: [
    { validator: validateSmsCode, trigger: 'blur' }
  ],
  agree: [
    { validator: validateAgree, trigger: 'change' }
  ]
}

// 发送短信验证码
const sendSmsCode = async () => {
  // 先验证手机号
  if (!registerForm.PhoneNumber) {
    ElMessage.error('请先输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(registerForm.PhoneNumber)) {
    ElMessage.error('请输入正确的手机号格式')
    return
  }
  
  try {
    // 调用发送短信验证码的API
    const response = await sendSmsCodeApi(registerForm.PhoneNumber)
    
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
      const errorMessage = response.Msg || '发送验证码失败'
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

// 初始化推荐人信息
onMounted(() => {
  const refParam = route.query.ref
  if (refParam) {
    registerForm.Agent = refParam
    agentReadonly.value = true
  }
})

// 注册处理
const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    const valid = await registerFormRef.value.validate()
    if (!valid) return
    
    const { agree, ...registerData } = registerForm
    // 添加Action字段
    const requestData = {
      Action: 'Register',
      ...registerData
    }
    
    const result = await userStore.registerAction(requestData)
    
    if (result.success) {
      router.push('/login')
    }
  } catch (error) {
    console.error('注册失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.register-header {
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

.register-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.register-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-link {
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
  .register-box {
    padding: 30px 20px;
  }
  
  .register-header h2 {
    font-size: 20px;
  }
}
</style>