<template>
  <div class="settings">
    <el-row :gutter="20">
      <!-- 设置菜单 -->
      <el-col :xs="24" :md="6">
        <el-card class="menu-card">
          <el-menu
            :default-active="activeTab"
            @select="handleMenuSelect"
            class="settings-menu"
          >
            <el-menu-item index="basic">
              <el-icon><Setting /></el-icon>
              <span>基础设置</span>
            </el-menu-item>
            <el-menu-item index="security">
              <el-icon><Lock /></el-icon>
              <span>安全设置</span>
            </el-menu-item>
            <el-menu-item index="email">
              <el-icon><Message /></el-icon>
              <span>邮件配置</span>
            </el-menu-item>
            <el-menu-item index="storage">
              <el-icon><FolderOpened /></el-icon>
              <span>存储配置</span>
            </el-menu-item>
            <el-menu-item index="backup">
              <el-icon><Download /></el-icon>
              <span>备份设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      
      <!-- 设置内容 -->
      <el-col :xs="24" :md="18">
        <el-card class="content-card">
          <!-- 基础设置 -->
          <div v-show="activeTab === 'basic'" class="setting-panel">
            <h3>基础设置</h3>
            <el-form
              ref="basicFormRef"
              :model="basicForm"
              :rules="basicRules"
              label-width="120px"
              class="setting-form"
            >
              <el-form-item label="网站名称" prop="siteName">
                <el-input v-model="basicForm.siteName" placeholder="请输入网站名称" />
              </el-form-item>
              
              <el-form-item label="网站描述" prop="siteDescription">
                <el-input
                  v-model="basicForm.siteDescription"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入网站描述"
                />
              </el-form-item>
              
              <el-form-item label="网站关键词" prop="siteKeywords">
                <el-input v-model="basicForm.siteKeywords" placeholder="请输入网站关键词，用逗号分隔" />
              </el-form-item>
              
              <el-form-item label="网站Logo">
                <el-upload
                  class="logo-uploader"
                  action="#"
                  :show-file-list="false"
                  :before-upload="beforeLogoUpload"
                >
                  <img v-if="basicForm.siteLogo" :src="basicForm.siteLogo" class="logo" />
                  <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              
              <el-form-item label="用户注册" prop="allowRegister">
                <el-switch v-model="basicForm.allowRegister" />
                <span class="form-tip">关闭后新用户无法注册</span>
              </el-form-item>
              
              <el-form-item label="邮箱验证" prop="requireEmailVerify">
                <el-switch v-model="basicForm.requireEmailVerify" />
                <span class="form-tip">开启后注册需要邮箱验证</span>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveBasicSettings" :loading="saving">
                  保存设置
                </el-button>
                <el-button @click="resetBasicForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 安全设置 -->
          <div v-show="activeTab === 'security'" class="setting-panel">
            <h3>安全设置</h3>
            <el-form
              ref="securityFormRef"
              :model="securityForm"
              label-width="120px"
              class="setting-form"
            >
              <el-form-item label="密码强度">
                <el-radio-group v-model="securityForm.passwordStrength">
                  <el-radio label="low">低（6位以上）</el-radio>
                  <el-radio label="medium">中（包含字母和数字）</el-radio>
                  <el-radio label="high">高（包含大小写字母、数字和特殊字符）</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="登录失败限制">
                <el-input-number
                  v-model="securityForm.maxLoginAttempts"
                  :min="3"
                  :max="10"
                  controls-position="right"
                />
                <span class="form-tip">次失败后锁定账户</span>
              </el-form-item>
              
              <el-form-item label="锁定时间">
                <el-input-number
                  v-model="securityForm.lockoutDuration"
                  :min="5"
                  :max="60"
                  controls-position="right"
                />
                <span class="form-tip">分钟</span>
              </el-form-item>
              
              <el-form-item label="会话超时">
                <el-input-number
                  v-model="securityForm.sessionTimeout"
                  :min="30"
                  :max="1440"
                  controls-position="right"
                />
                <span class="form-tip">分钟</span>
              </el-form-item>
              
              <el-form-item label="强制HTTPS">
                <el-switch v-model="securityForm.forceHttps" />
                <span class="form-tip">强制使用HTTPS访问</span>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveSecuritySettings" :loading="saving">
                  保存设置
                </el-button>
                <el-button @click="resetSecurityForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 邮件配置 -->
          <div v-show="activeTab === 'email'" class="setting-panel">
            <h3>邮件配置</h3>
            <el-form
              ref="emailFormRef"
              :model="emailForm"
              :rules="emailRules"
              label-width="120px"
              class="setting-form"
            >
              <el-form-item label="SMTP服务器" prop="smtpHost">
                <el-input v-model="emailForm.smtpHost" placeholder="如：smtp.gmail.com" />
              </el-form-item>
              
              <el-form-item label="SMTP端口" prop="smtpPort">
                <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" controls-position="right" />
              </el-form-item>
              
              <el-form-item label="发件人邮箱" prop="fromEmail">
                <el-input v-model="emailForm.fromEmail" placeholder="请输入发件人邮箱" />
              </el-form-item>
              
              <el-form-item label="发件人名称" prop="fromName">
                <el-input v-model="emailForm.fromName" placeholder="请输入发件人名称" />
              </el-form-item>
              
              <el-form-item label="邮箱密码" prop="password">
                <el-input
                  v-model="emailForm.password"
                  type="password"
                  placeholder="请输入邮箱密码或授权码"
                  show-password
                />
              </el-form-item>
              
              <el-form-item label="加密方式">
                <el-radio-group v-model="emailForm.encryption">
                  <el-radio label="none">无</el-radio>
                  <el-radio label="ssl">SSL</el-radio>
                  <el-radio label="tls">TLS</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveEmailSettings" :loading="saving">
                  保存设置
                </el-button>
                <el-button @click="testEmailConnection" :loading="testing">
                  测试连接
                </el-button>
                <el-button @click="resetEmailForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 存储配置 -->
          <div v-show="activeTab === 'storage'" class="setting-panel">
            <h3>存储配置</h3>
            <el-form
              ref="storageFormRef"
              :model="storageForm"
              label-width="120px"
              class="setting-form"
            >
              <el-form-item label="存储方式">
                <el-radio-group v-model="storageForm.type">
                  <el-radio label="local">本地存储</el-radio>
                  <el-radio label="oss">阿里云OSS</el-radio>
                  <el-radio label="qiniu">七牛云</el-radio>
                  <el-radio label="aws">AWS S3</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <template v-if="storageForm.type !== 'local'">
                <el-form-item label="Access Key">
                  <el-input v-model="storageForm.accessKey" placeholder="请输入Access Key" />
                </el-form-item>
                
                <el-form-item label="Secret Key">
                  <el-input
                    v-model="storageForm.secretKey"
                    type="password"
                    placeholder="请输入Secret Key"
                    show-password
                  />
                </el-form-item>
                
                <el-form-item label="存储桶">
                  <el-input v-model="storageForm.bucket" placeholder="请输入存储桶名称" />
                </el-form-item>
                
                <el-form-item label="地域">
                  <el-input v-model="storageForm.region" placeholder="请输入地域" />
                </el-form-item>
              </template>
              
              <el-form-item label="最大文件大小">
                <el-input-number
                  v-model="storageForm.maxFileSize"
                  :min="1"
                  :max="100"
                  controls-position="right"
                />
                <span class="form-tip">MB</span>
              </el-form-item>
              
              <el-form-item label="允许的文件类型">
                <el-input
                  v-model="storageForm.allowedTypes"
                  placeholder="如：jpg,png,gif,pdf"
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveStorageSettings" :loading="saving">
                  保存设置
                </el-button>
                <el-button @click="resetStorageForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 备份设置 -->
          <div v-show="activeTab === 'backup'" class="setting-panel">
            <h3>备份设置</h3>
            <el-form
              ref="backupFormRef"
              :model="backupForm"
              label-width="120px"
              class="setting-form"
            >
              <el-form-item label="自动备份">
                <el-switch v-model="backupForm.autoBackup" />
                <span class="form-tip">开启后系统将自动备份数据</span>
              </el-form-item>
              
              <el-form-item v-if="backupForm.autoBackup" label="备份频率">
                <el-radio-group v-model="backupForm.frequency">
                  <el-radio label="daily">每天</el-radio>
                  <el-radio label="weekly">每周</el-radio>
                  <el-radio label="monthly">每月</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item v-if="backupForm.autoBackup" label="备份时间">
                <el-time-picker
                  v-model="backupForm.backupTime"
                  format="HH:mm"
                  placeholder="选择备份时间"
                />
              </el-form-item>
              
              <el-form-item label="保留备份数量">
                <el-input-number
                  v-model="backupForm.keepBackups"
                  :min="1"
                  :max="30"
                  controls-position="right"
                />
                <span class="form-tip">个</span>
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveBackupSettings" :loading="saving">
                  保存设置
                </el-button>
                <el-button type="success" @click="createBackup" :loading="backing">
                  立即备份
                </el-button>
                <el-button @click="resetBackupForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const activeTab = ref('basic')
const saving = ref(false)
const testing = ref(false)
const backing = ref(false)

// 表单引用
const basicFormRef = ref()
const securityFormRef = ref()
const emailFormRef = ref()
const storageFormRef = ref()
const backupFormRef = ref()

// 基础设置表单
const basicForm = reactive({
  siteName: '中后台管理系统',
  siteDescription: '基于Vue.js的中后台管理系统',
  siteKeywords: 'Vue.js,管理系统,后台管理',
  siteLogo: '',
  allowRegister: true,
  requireEmailVerify: false
})

// 安全设置表单
const securityForm = reactive({
  passwordStrength: 'medium',
  maxLoginAttempts: 5,
  lockoutDuration: 15,
  sessionTimeout: 120,
  forceHttps: false
})

// 邮件配置表单
const emailForm = reactive({
  smtpHost: '',
  smtpPort: 587,
  fromEmail: '',
  fromName: '',
  password: '',
  encryption: 'tls'
})

// 存储配置表单
const storageForm = reactive({
  type: 'local',
  accessKey: '',
  secretKey: '',
  bucket: '',
  region: '',
  maxFileSize: 10,
  allowedTypes: 'jpg,png,gif,pdf,doc,docx'
})

// 备份设置表单
const backupForm = reactive({
  autoBackup: false,
  frequency: 'daily',
  backupTime: new Date(),
  keepBackups: 7
})

// 表单验证规则
const basicRules = {
  siteName: [
    { required: true, message: '请输入网站名称', trigger: 'blur' }
  ]
}

const emailRules = {
  smtpHost: [
    { required: true, message: '请输入SMTP服务器', trigger: 'blur' }
  ],
  smtpPort: [
    { required: true, message: '请输入SMTP端口', trigger: 'blur' }
  ],
  fromEmail: [
    { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  fromName: [
    { required: true, message: '请输入发件人名称', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入邮箱密码', trigger: 'blur' }
  ]
}

// 菜单选择
const handleMenuSelect = (key) => {
  activeTab.value = key
}

// Logo上传前验证
const beforeLogoUpload = (file) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('Logo只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 保存基础设置
const saveBasicSettings = async () => {
  if (!basicFormRef.value) return
  
  try {
    const valid = await basicFormRef.value.validate()
    if (!valid) return
    
    saving.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('基础设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 保存安全设置
const saveSecuritySettings = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 保存邮件设置
const saveEmailSettings = async () => {
  if (!emailFormRef.value) return
  
  try {
    const valid = await emailFormRef.value.validate()
    if (!valid) return
    
    saving.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('邮件配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 测试邮件连接
const testEmailConnection = async () => {
  testing.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('邮件连接测试成功')
  } catch (error) {
    ElMessage.error('邮件连接测试失败')
  } finally {
    testing.value = false
  }
}

// 保存存储设置
const saveStorageSettings = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('存储配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 保存备份设置
const saveBackupSettings = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('备份设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 立即备份
const createBackup = async () => {
  backing.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 3000))
    ElMessage.success('数据备份完成')
  } catch (error) {
    ElMessage.error('备份失败')
  } finally {
    backing.value = false
  }
}

// 重置表单
const resetBasicForm = () => {
  if (basicFormRef.value) {
    basicFormRef.value.resetFields()
  }
}

const resetSecurityForm = () => {
  Object.assign(securityForm, {
    passwordStrength: 'medium',
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 120,
    forceHttps: false
  })
}

const resetEmailForm = () => {
  if (emailFormRef.value) {
    emailFormRef.value.resetFields()
  }
}

const resetStorageForm = () => {
  Object.assign(storageForm, {
    type: 'local',
    accessKey: '',
    secretKey: '',
    bucket: '',
    region: '',
    maxFileSize: 10,
    allowedTypes: 'jpg,png,gif,pdf,doc,docx'
  })
}

const resetBackupForm = () => {
  Object.assign(backupForm, {
    autoBackup: false,
    frequency: 'daily',
    backupTime: new Date(),
    keepBackups: 7
  })
}
</script>

<style lang="scss" scoped>
.settings {
  .menu-card {
    .settings-menu {
      border-right: none;
      
      .el-menu-item {
        border-radius: 4px;
        margin-bottom: 4px;
        
        &.is-active {
          background-color: #ecf5ff;
          color: #409eff;
        }
      }
    }
  }
  
  .content-card {
    min-height: 600px;
    
    .setting-panel {
      h3 {
        margin-bottom: 20px;
        color: #333;
        font-size: 18px;
        font-weight: 600;
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
      }
      
      .setting-form {
        max-width: 600px;
        
        .form-tip {
          margin-left: 10px;
          color: #909399;
          font-size: 12px;
        }
        
        .logo-uploader {
          .logo {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 4px;
          }
          
          :deep(.el-upload) {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: 0.2s;
            
            &:hover {
              border-color: #409eff;
            }
          }
          
          .logo-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 100px;
            height: 100px;
            text-align: center;
            line-height: 100px;
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .settings {
    .menu-card {
      margin-bottom: 20px;
    }
    
    .content-card {
      .setting-form {
        .el-form-item {
          .el-form-item__label {
            width: 100px !important;
          }
        }
      }
    }
  }
}
</style>