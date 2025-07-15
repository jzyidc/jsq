// 全局配置文件
// 在正式环境中，可以通过修改环境变量来调整配置

// 获取应用标题
export const getAppTitle = () => {
  return import.meta.env.VITE_APP_TITLE || '中后台管理系统'
}

// 获取应用版本
export const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}

// 获取API基础URL
export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'https://api.example.com'
}

// 应用配置
export const appConfig = {
  // 应用信息
  title: getAppTitle(),
  version: getAppVersion(),
  
  // API配置
  apiBaseUrl: getApiBaseUrl(),
  
  // 其他配置
  defaultPageSize: 10,
  maxFileSize: 10, // MB
  allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
  
  // 主题配置
  theme: {
    primaryColor: '#409EFF',
    borderRadius: '4px'
  }
}

// 导出默认配置
export default appConfig