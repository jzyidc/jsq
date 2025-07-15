import request from '@/utils/request'

// 用户登录
export const login = (data) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'Login',
      UserName: data.username,
      Password: data.password
    }
  })
}

// 管理员后台登录
export const loginUserWeb = (data) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'LoginUserWeb',
      Phone: data.username,
      Password: data.password
    }
  })
}

// 发送短信验证码
export const sendSmsCode = (phoneNumber) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'SendSms',
      Type: 'Register',
      Phone: phoneNumber
    }
  })
}

// 用户注册
export const register = (data) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'Register',
      Phone: data.PhoneNumber,
      Password: data.Password,
      Referrer: data.Agent,
      SmsCode: data.SmsCode
    }
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetUserInfo'
      // Token会由请求拦截器自动添加
    }
  })
}

// 用户登出
export const logout = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'LogoutWeb'
    }
  })
}

// 修改密码
export const changePassword = (data) => {
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 重置密码（忘记密码）
export const resetPassword = (data) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'ResetPassword',
      Phone: data.phone,
      Password: data.password,
      SmsCode: data.smsCode
    }
  })
}

// 发送重置密码短信验证码
export const sendResetPasswordSms = (phoneNumber) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'SendSms',
      Type: 'ResetPassword',
      Phone: phoneNumber
    }
  })
}

// 设置分组
export const setGroup = (params) => {
  const data = {
    Action: 'SetNodeGroup',
    Id: params.Id, // JSON数组的节点ID，例如:["111199955","111199956","111199957","111199958"]
    Group: params.Group // 节点分组，4位数字
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 更新用户信息
export const updateProfile = (data) => {
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 上传头像
export const uploadAvatar = (data) => {
  return request({
    url: '',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取游戏数据
export const getGameData = (type = '') => {
  const data = {
    Action: 'GetGameData'
  }
  
  // 如果传入了type参数，则添加到请求数据中
  if (type) {
    data.Type = type
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 获取区域节点数据
export const getAreaData = (params) => {
  const data = {
    Action: 'GetAreaData',
    GameName: params.GameName // 必须参数
  }
  
  // 可选参数
  if (params.ScreenProvince) {
    data.ScreenProvince = params.ScreenProvince
  }
  
  if (params.ScreenIsp) {
    data.ScreenIsp = params.ScreenIsp
  }
  
  if (params.ScreenType) {
    data.ScreenType = params.ScreenType
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 立即支付购买节点
export const buyNode = (params) => {
  // 将购买时长转换为API需要的格式
  const durationMap = {
    '一天': 'day',
    '一周': 'week', 
    '一个月': 'moon',
    '三个月': 'three_moon',
    '半年': 'six_moon',
    '一年': 'year'
  }
  
  const data = {
    Action: 'BuyNode',
    BuyGame: params.BuyGame, // 购买游戏
    BuyTime: durationMap[params.BuyTime] || 'moon', // 购买时长
    BuyInfo: JSON.stringify(params.BuyInfo), // 购买信息数组
    AssignGroup: params.AssignGroup || '0000' // 默认分组名称
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 实名认证
export const detectAuth = (data) => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'DetectAuth',
      IdName: data.IdName,
      IdCard: data.IdCard
    }
  })
}

// 查询实名认证状态
export const getDetectAuth = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetDetectAuth'
    }
  })
}

// 获取业务节点列表
export const getNodeData = (params = {}) => {
  const data = {
    Action: 'GetNodeData',
    NowPage: params.page || 1,
    PageSize: params.pageSize || 20
  }
  
  // 可选的筛选参数
  if (params.game) {
    data.ScreenGame = params.game
  }
  
  if (params.area) {
    data.ScreenArea = params.area
  }
  
  if (params.group) {
    data.ScreenGroup = params.group
  }
  
  if (params.ScreenNode) {
    data.ScreenNode = params.ScreenNode
  }
  
  if (params.ScreenEndTime) {
    data.ScreenEndTime = params.ScreenEndTime
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 切换节点
export const switchNode = (params) => {
  const data = {
    Action: 'SwitchNode',
    Id: params.Id, // JSON数组的节点ID，例如:["111199955","111199956","111199957","111199958"]
    AreaName: params.AreaName, // 需切换到的地区
    GameName: params.GameName, // 需切换到的游戏
    Province: params.Province // 需切换到的省份
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 续费节点
export const renewNode = (params) => {
  const data = {
    Action: 'RenewNode',
    Id: params.Id, // JSON数组的节点ID，例如:["111199955","111199956","111199957","111199958"]
    RenewTime: params.RenewTime // 续费时长：day, week, moon, three_moon, six_moon, year
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 设置节点密码
export const setNodePassword = (params) => {
  const data = {
    Action: 'SetNodePassword',
    Id: params.Id, // JSON数组的节点ID，例如:["10000009", "10000009", "10000009"]
    Password: params.Password // 新密码
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 获取节点续费价格
export const getNodeRenewPrice = (params) => {
  const data = {
    Action: 'GetNodeRenewPrice',
    Id: params.Id, // 节点ID数组
    RenewTime: params.RenewTime // 续费时长
  }
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 获取系统日志
export const getSysLog = (params = {}) => {
  const data = {
    Action: 'GetSysLog',
    NowPage: params.page || 1,
    PageSize: params.pageSize || 20
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 获取过期节点数据
export const getNodeExpiredData = (params = {}) => {
  const data = {
    Action: 'GetNodeExpiredData',
    NowPage: params.page || 1,
    PageSize: params.pageSize || 20
  }
  
  // 可选的筛选参数
  if (params.game) {
    data.ScreenGame = params.game
  }
  
  if (params.area) {
    data.ScreenArea = params.area
  }
  
  if (params.expiredDays) {
    data.ScreenExpiredDays = params.expiredDays
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 删除节点
export const deleteNode = (params) => {
  const data = {
    Action: 'DeleteNode',
    Id: params.Id // JSON数组的节点ID，例如:["111199955","111199956","111199957","111199958"]
  }
  
  return request({
    url: '',
    method: 'post',
    data
  })
}

// 获取公告
export const getNotice = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetNotice'
    }
  })
}

// 获取代理推广信息
export const getPromotionInfo = () => {
  return request({
    url: '',
    method: 'post',
    data: {
      Action: 'GetPromotionInfo'
    }
  })
}