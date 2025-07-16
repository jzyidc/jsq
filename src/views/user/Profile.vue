<template>
  <div class="profile">
    <el-row :gutter="20">
      <!-- 个人信息卡片 -->
      <el-col :xs="24" :lg="8">
        <el-card class="profile-card">
          <div class="profile-header">
            <div class="avatar-section">
              <div class="avatar-container" @click="showAvatarDialog = true">
                <el-avatar :size="100" :src="getDefaultAvatar" class="avatar">
                  {{ userInfo.username?.charAt(0)?.toUpperCase() }}
                </el-avatar>
                <div class="avatar-overlay">
                  <el-icon><Camera /></el-icon>
                  <span>选择头像</span>
                </div>
              </div>
            </div>
            
            <div class="user-basic">
              <h3>{{ userInfo.username }}</h3>
              <p class="user-role">
                <el-tag type="primary">
                  普通用户
                </el-tag>
              </p>
              <p class="join-time">加入时间：{{ userInfo.createTime || userInfo.reg_time || '--' }}</p>
            </div>
          </div>
          
          <el-divider />
          
          <div class="profile-stats">
            <div class="stat-item">
              <div class="stat-number">{{ userInfo.balance || 0 }}</div>
              <div class="stat-label">账户余额</div>
            </div>
            <div class="stat-item">
               <div class="stat-number">{{ userInfo.loginTime || userInfo.login_time || '--' }}</div>
               <div class="stat-label">最后登录</div>
             </div>
          </div>
          
          <div class="profile-info">
            <div class="info-item">
               <span class="info-label">注册时间：</span>
               <span class="info-value">{{ userInfo.createTime || userInfo.reg_time || '--' }}</span>
             </div>
            <div class="info-item">
               <span class="info-label">登录IP：</span>
               <span class="info-value">{{ userInfo.ipAddress || '--' }}</span>
             </div>
             <div class="info-item">
               <span class="info-label">QQ：</span>
               <span class="info-value">{{ userInfo.qq || '--' }}</span>
             </div>
             <div class="info-item">
               <span class="info-label">微信：</span>
               <span class="info-value">{{ userInfo.wx || '--' }}</span>
             </div>
             <div class="info-item">
               <span class="info-label">实名认证：</span>
               <div class="auth-status">
                 <el-tag :type="isAuthenticated ? 'success' : 'warning'" size="small">
                   {{ isAuthenticated ? '已认证' : '未认证' }}
                 </el-tag>
                 <el-button 
                   v-if="!isAuthenticated" 
                   type="primary" 
                   size="small" 
                   @click="showAuthDialog = true"
                   style="margin-left: 8px;"
                 >
                   立即认证
                 </el-button>
               </div>
             </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 编辑表单 -->
      <el-col :xs="24" :lg="16">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <div class="header-actions">
                <el-button 
                  v-if="!isEditing" 
                  type="primary" 
                  size="small" 
                  @click="startEdit"
                >
                  编辑资料
                </el-button>
                <div v-else class="edit-actions">
                  <el-button size="small" @click="cancelEdit">取消</el-button>
                  <el-button type="primary" size="small" @click="saveProfile" :loading="saveLoading">保存</el-button>
                </div>
              </div>
            </div>
          </template>
          
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            class="profile-form"
          >
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="profileForm.username" placeholder="请输入用户名" :disabled="true" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :md="12">
                <el-form-item label="真实姓名" prop="real_name">
                  <el-input v-model="profileForm.real_name" placeholder="请输入真实姓名" :disabled="true" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileForm.phone" placeholder="请输入手机号" :disabled="true" />
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :md="12">
                <el-form-item label="QQ" prop="qq">
                  <el-input v-model="profileForm.qq" placeholder="请输入QQ号" :disabled="!isEditing" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row :gutter="20">
              <el-col :xs="24" :md="12">
                <el-form-item label="微信" prop="wx">
                  <el-input v-model="profileForm.wx" placeholder="请输入微信号" :disabled="!isEditing" />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-form-item label="当前IP" prop="ipAddress">
               <el-input v-model="profileForm.ipAddress" placeholder="当前IP地址" :disabled="true" />
             </el-form-item>
            

          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 头像选择对话框 -->
    <el-dialog v-model="showAvatarDialog" title="选择头像" width="500px" center>
      <div class="avatar-grid">
        <div 
          v-for="(avatar, index) in systemAvatars" 
          :key="index"
          class="avatar-option"
          :class="{ active: selectedAvatar === avatar }"
          @click="selectAvatar(avatar)"
        >
          <el-avatar :size="80" :src="avatar" />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAvatarDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmAvatar">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 实名认证对话框 -->
    <el-dialog v-model="showAuthDialog" title="实名认证" width="500px" center>
      <div class="auth-content">
        <div class="auth-header">
          <el-icon class="auth-icon"><UserFilled /></el-icon>
          <h3>身份验证</h3>
          <p>为了保障您的账户安全，请完成实名认证</p>
        </div>
        
        <el-form 
          ref="authFormRef" 
          :model="authForm" 
          :rules="authRules" 
          label-width="80px"
          class="auth-form"
        >
          <el-form-item label="真实姓名" prop="idName">
            <el-input 
              v-model="authForm.idName" 
              placeholder="请输入真实姓名"
              :disabled="authLoading"
            />
          </el-form-item>
          
          <el-form-item label="身份证号" prop="idCard">
            <el-input 
              v-model="authForm.idCard" 
              placeholder="请输入身份证号码"
              :disabled="authLoading"
            />
          </el-form-item>
          
          <!-- 二维码显示区域 -->
           <div v-if="showQRCode" class="qr-code-section">
             <div class="qr-code-container">
               <h4>微信扫码认证</h4>
               <div class="qr-code">
                 <img :src="qrCodeUrl" alt="认证二维码" />
               </div>
               <p class="qr-tip">请使用微信扫描上方二维码完成人脸认证</p>
               <div class="qr-actions">
                 <el-button @click="resetAuth" size="small">重新认证</el-button>
               </div>
             </div>
           </div>
           
           <!-- 人脸认证按钮区域 -->
           <div v-else class="face-auth-section">
             <el-button 
               type="primary" 
               size="large" 
               :loading="authLoading"
               @click="startFaceAuth"
               class="face-auth-btn"
             >
               <el-icon><Camera /></el-icon>
               开始人脸认证
             </el-button>
             <p class="face-auth-tip">请确保光线充足，正面面向摄像头</p>
           </div>
        </el-form>
      </div>
      
      <template #footer>
         <span class="dialog-footer">
           <el-button @click="closeAuthDialog" :disabled="authLoading">{{ showQRCode ? '关闭' : '取消' }}</el-button>
           <el-button 
             v-if="!showQRCode"
             type="primary" 
             @click="submitAuth" 
             :loading="authLoading"
             :disabled="!authForm.idName || !authForm.idCard"
           >
             提交认证
           </el-button>
         </span>
       </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'
import { detectAuth, getDetectAuth, setContactInformation } from '@/api/auth'
import QRCode from 'qrcode'

const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 默认头像
const getDefaultAvatar = computed(() => {
  if (userInfo.value.avatar) {
    return userInfo.value.avatar
  }
  if (selectedAvatar.value) {
    return selectedAvatar.value
  }
  // 根据用户ID或手机号生成固定的默认头像
  const userId = userInfo.value.id || userInfo.value.phone || '1'
  const avatarIndex = (parseInt(userId.toString()) % 6) + 1
  return `/avatars/avatar${avatarIndex}.svg`
})

// 头像选择相关
const showAvatarDialog = ref(false)
const selectedAvatar = ref('')
const systemAvatars = [
  '/avatars/avatar1.svg',
  '/avatars/avatar2.svg',
  '/avatars/avatar3.svg',
  '/avatars/avatar4.svg',
  '/avatars/avatar5.svg',
  '/avatars/avatar6.svg'
]

// 实名认证相关
const showAuthDialog = ref(false)
const authLoading = ref(false)
const authFormRef = ref()
const showQRCode = ref(false)
const qrCodeUrl = ref('')
const bizToken = ref('')
const isAuthenticated = ref(false) // 实名认证状态
const authCheckTimer = ref(null) // 认证状态检查定时器
const authForm = reactive({
  idName: '',
  idCard: ''
})

// 身份证号验证规则
const validateIdCard = (rule, value, callback) => {
  const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    callback(new Error('请输入身份证号码'))
  } else if (!idCardReg.test(value)) {
    callback(new Error('请输入正确的身份证号码'))
  } else {
    callback()
  }
}

// 表单验证规则
const authRules = {
  idName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  idCard: [
    { required: true, validator: validateIdCard, trigger: 'blur' }
  ]
}

// 移除stats变量，直接使用userInfo中的数据

// 编辑状态相关
const isEditing = ref(false)
const saveLoading = ref(false)
const profileFormRef = ref()

// 个人资料表单
const profileForm = reactive({
  username: '',
  phone: '',
  real_name: '',
  ipAddress: '',
  qq: '',
  wx: ''
})

// 原始表单数据（用于取消编辑时恢复）
const originalFormData = reactive({})

// 表单验证规则
const profileRules = {
  qq: [
    { pattern: /^[1-9][0-9]{4,10}$/, message: '请输入正确的QQ号', trigger: 'blur' }
  ],
  wx: [
    { min: 1, max: 20, message: '微信号长度在 1 到 20 个字符', trigger: 'blur' }
  ]
}



// 选择头像
const selectAvatar = (avatar) => {
  selectedAvatar.value = avatar
}

// 确认头像选择
const confirmAvatar = () => {
  if (selectedAvatar.value) {
    userStore.updateUserInfo({ avatar: selectedAvatar.value })
    ElMessage.success('头像更新成功')
    showAvatarDialog.value = false
  }
}

// 开始人脸认证
const startFaceAuth = () => {
  // 直接调用提交认证方法
  submitAuth()
}

// 重新认证
const resetAuth = () => {
  showQRCode.value = false
  qrCodeUrl.value = ''
  bizToken.value = ''
  authForm.idName = ''
  authForm.idCard = ''
  stopAuthPolling() // 停止轮询
}

// 关闭认证对话框
const closeAuthDialog = () => {
  showAuthDialog.value = false
  // 重置所有状态
  resetAuth()
}

// 获取实名认证状态
const checkAuthStatus = async (isPolling = false) => {
  try {
    const response = await getDetectAuth()
    
    // 根据API响应判断认证状态
    if (response.Code === 1000) {
      const wasAuthenticated = isAuthenticated.value
      isAuthenticated.value = response.DetectAuth || false
      
      // 更新用户信息中的认证状态
      userStore.updateUserInfo({ authentication: response.DetectAuth })
      
      // 如果是轮询检查且认证状态从未认证变为已认证
      if (isPolling && !wasAuthenticated && response.DetectAuth) {
        ElMessage.success('实名认证完成！')
        closeAuthDialog()
        stopAuthPolling()
      }
    } else {
      console.error('获取认证状态失败:', response.Msg)
    }
  } catch (error) {
    console.error('获取认证状态失败:', error)
  }
}

// 开始轮询认证状态
const startAuthPolling = () => {
  if (authCheckTimer.value) {
    clearInterval(authCheckTimer.value)
  }
  
  authCheckTimer.value = setInterval(() => {
    checkAuthStatus(true)
  }, 3000) // 每3秒检查一次
}

// 停止轮询认证状态
const stopAuthPolling = () => {
  if (authCheckTimer.value) {
    clearInterval(authCheckTimer.value)
    authCheckTimer.value = null
  }
}

// 提交实名认证
const submitAuth = async () => {
  if (!authFormRef.value) return
  
  try {
    await authFormRef.value.validate()
    authLoading.value = true
    
    const response = await detectAuth({
      IdName: authForm.idName,
      IdCard: authForm.idCard
    })
    
    if (response.Code === 1000 && response.Url) {
      // 保存业务token
      bizToken.value = response.BizToken
      
      // 生成二维码
      try {
        const qrCodeDataURL = await QRCode.toDataURL(response.Url, {
          width: 200,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        qrCodeUrl.value = qrCodeDataURL
        showQRCode.value = true
        ElMessage.success('请使用微信扫描二维码完成人脸认证')
        
        // 开始轮询认证状态
        startAuthPolling()
      } catch (qrError) {
        console.error('二维码生成失败:', qrError)
        ElMessage.error('二维码生成失败，请重试')
      }
    } else {
      ElMessage.error(response.Msg || '认证失败，请重试')
    }
  } catch (error) {
    console.error('实名认证失败:', error)
    ElMessage.error('认证失败，请检查网络连接')
  } finally {
    authLoading.value = false
  }
}





// 开始编辑
const startEdit = () => {
  isEditing.value = true
  // 保存原始数据
  Object.assign(originalFormData, {
    qq: profileForm.qq,
    wx: profileForm.wx
  })
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  // 恢复原始数据
  profileForm.qq = originalFormData.qq
  profileForm.wx = originalFormData.wx
}

// 保存资料
const saveProfile = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    saveLoading.value = true
    
    const response = await setContactInformation({
      qq: profileForm.qq || '',
      wx: profileForm.wx || ''
    })
    
    if (response.Code === 1000) {
      ElMessage.success(response.Msg || '设置成功')
      // 更新用户信息
      userStore.updateUserInfo({
        qq: profileForm.qq,
        wx: profileForm.wx
      })
      isEditing.value = false
    } else {
      ElMessage.error(response.Msg || '保存失败')
    }
  } catch (error) {
    console.error('保存联系信息失败:', error)
    ElMessage.error('保存失败，请检查网络连接')
  } finally {
    saveLoading.value = false
  }
}

// 初始化表单数据
const initFormData = () => {
  Object.assign(profileForm, {
    username: userInfo.value.username || '',
    real_name: userInfo.value.realName || '',
    phone: userInfo.value.phone || '',
    ipAddress: userInfo.value.ipAddress || '',
    qq: userInfo.value.qq || '',
    wx: userInfo.value.wx || ''
  })
}

// 组件挂载时初始化数据
onMounted(() => {
  initFormData()
  // 如果用户没有头像，设置默认头像
  if (!userInfo.value.avatar) {
    selectedAvatar.value = systemAvatars[0]
  }
  // 获取实名认证状态
  checkAuthStatus()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  stopAuthPolling()
})
</script>

<style lang="scss" scoped>
.profile {
  .profile-card {
    .profile-header {
      text-align: center;
      
      .avatar-section {
        position: relative;
        display: inline-block;
        margin-bottom: 16px;
        
        .avatar-container {
          position: relative;
          
          .avatar {
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .avatar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.3s;
            cursor: pointer;
            
            .el-icon {
              font-size: 20px;
              margin-bottom: 4px;
            }
            
            span {
              font-size: 12px;
            }
          }
          
          &:hover .avatar-overlay {
            opacity: 1;
          }
        }
      }
      
      .user-basic {
        h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 20px;
        }
        
        .user-role {
          margin-bottom: 8px;
        }
        
        .join-time {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
      }
    }
    
    .profile-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 16px;
      
      .stat-item {
        text-align: center;
        
        .stat-number {
          font-size: 18px;
          font-weight: 600;
          color: #409eff;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          color: #666;
        }
      }
    }
    
    .profile-info {
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        
        .info-label {
          color: #666;
          font-weight: 500;
        }
        
        .info-value {
          color: #333;
        }
      }
    }
  }
  
  .form-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .header-actions {
        .edit-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
    
    .profile-form {
      .el-form-item {
        margin-bottom: 20px;
      }
    }
  }
  
  // 头像选择对话框样式
  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    padding: 20px 0;
    
    .avatar-option {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
      border: 2px solid transparent;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        background-color: #f0f9ff;
      }
      
      &.active {
        border-color: #409eff;
        background-color: #e1f5fe;
      }
    }
  }
  
  // 实名认证对话框样式
  .auth-content {
    .auth-header {
      text-align: center;
      margin-bottom: 24px;
      
      .auth-icon {
        font-size: 48px;
        color: #409eff;
        margin-bottom: 16px;
      }
      
      h3 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 20px;
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
    }
    
    .auth-form {
      .el-form-item {
        margin-bottom: 20px;
      }
    }
    
    .face-auth-section {
       text-align: center;
       margin-top: 24px;
       padding: 20px;
       background-color: #f8f9fa;
       border-radius: 8px;
       
       .face-auth-btn {
         width: 200px;
         height: 44px;
         font-size: 16px;
         
         .el-icon {
           margin-right: 8px;
         }
       }
       
       .face-auth-tip {
         margin: 12px 0 0 0;
         color: #666;
         font-size: 12px;
       }
     }
     
     .qr-code-section {
       margin-top: 24px;
       
       .qr-code-container {
         text-align: center;
         padding: 20px;
         background-color: #f8f9fa;
         border-radius: 8px;
         
         h4 {
           margin: 0 0 16px 0;
           color: #333;
           font-size: 16px;
         }
         
         .qr-code {
           margin: 16px 0;
           
           img {
             border-radius: 8px;
             box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
           }
         }
         
         .qr-tip {
           margin: 16px 0;
           color: #666;
           font-size: 14px;
         }
         
         .qr-actions {
           margin-top: 16px;
         }
       }
     }
  }
  
  .auth-status {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 768px) {
  .profile {
    .profile-card {
      margin-bottom: 20px;
    }
    

  }
}
</style>