# 系统配置指南

## 环境变量配置

本系统使用环境变量来管理全局配置，方便在不同环境中进行部署和配置修改。

### 主要配置项

#### 1. 应用标题配置

在 `.env` 文件中修改以下配置：

```bash
# 应用标题
VITE_APP_TITLE=您的系统名称
```

#### 2. API服务器配置

```bash
# 后端API服务器地址
VITE_API_BASE_URL=https://your-api-server.com
```

#### 3. 应用版本

```bash
# 应用版本
VITE_APP_VERSION=1.0.0
```

### 正式环境部署配置

#### 方法一：修改 .env 文件

1. 在项目根目录找到 `.env` 文件
2. 修改相应的配置项
3. 重新构建项目：`npm run build`

#### 方法二：创建环境特定的配置文件

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置
- `.env.staging` - 测试环境配置

#### 方法三：在构建时指定环境变量

```bash
# 构建时指定配置
VITE_APP_TITLE="生产环境系统" npm run build
```

### 配置文件说明

#### src/config/index.js

这是全局配置文件，提供了统一的配置管理：

- `getAppTitle()` - 获取应用标题
- `getAppVersion()` - 获取应用版本
- `getApiBaseUrl()` - 获取API基础URL
- `appConfig` - 应用配置对象

### 影响的文件

以下文件会使用环境变量中的配置：

1. `index.html` - 页面标题
2. `public/404.html` - 404页面标题
3. `src/router/index.js` - 动态页面标题
4. `src/config/index.js` - 全局配置

### 注意事项

1. 环境变量必须以 `VITE_` 开头才能在前端代码中使用
2. 修改环境变量后需要重新构建项目
3. 在生产环境中，建议使用环境特定的配置文件
4. 敏感信息（如API密钥）不应该放在前端环境变量中

### 示例配置

```bash
# .env.production
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_APP_TITLE=企业管理系统
VITE_APP_VERSION=2.0.0
```

这样配置后，系统标题将显示为"企业管理系统"，API请求将发送到指定的生产环境地址。