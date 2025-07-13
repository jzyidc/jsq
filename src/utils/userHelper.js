/**
 * 用户信息辅助函数
 */

/**
 * 获取用户显示名称
 * @param {Object} userInfo - 用户信息对象
 * @returns {string} 用户显示名称
 */
export const getUserDisplayName = (userInfo) => {
  if (!userInfo) return '用户'
  
  // 优先级：用户名 > 手机号 > 默认值
  return userInfo.username || userInfo.phone || '用户'
}

/**
 * 格式化手机号显示
 * @param {string} phone - 手机号
 * @returns {string} 格式化后的手机号
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return ''
  
  // 隐藏中间4位数字
  if (phone.length === 11) {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }
  
  return phone
}

/**
 * 格式化余额显示
 * @param {number} balance - 余额
 * @returns {string} 格式化后的余额
 */
export const formatBalance = (balance) => {
  if (typeof balance !== 'number') return '0.00'
  return balance.toFixed(2)
}

/**
 * 检查用户信息是否完整
 * @param {Object} userInfo - 用户信息对象
 * @returns {boolean} 是否完整
 */
export const isUserInfoComplete = (userInfo) => {
  if (!userInfo) return false
  
  // 检查必要字段是否存在
  const requiredFields = ['username', 'phone']
  return requiredFields.some(field => userInfo[field])
}

/**
 * 获取用户头像URL或默认头像
 * @param {Object} userInfo - 用户信息对象
 * @returns {string} 头像URL
 */
export const getUserAvatar = (userInfo) => {
  if (!userInfo) return ''
  
  return userInfo.avatar || ''
}

/**
 * 获取用户头像显示的首字母
 * @param {Object} userInfo - 用户信息对象
 * @returns {string} 首字母
 */
export const getUserAvatarLetter = (userInfo) => {
  const displayName = getUserDisplayName(userInfo)
  return displayName.charAt(0).toUpperCase()
}