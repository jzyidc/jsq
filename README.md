# 中后台管理系统

## 项目介绍

这是一个基于Vue.js开发的中后台管理系统，提供完整的用户管理和后台管理功能。

## 功能模块

### 1. 用户认证模块
- **登录页面**: 用户登录入口，支持用户名登录，统一使用LoginUserWeb接口
- **注册页面**: 新用户注册功能，包含表单验证

### 2. 管理员后台 (Admin)
- 用户管理：查看、编辑、删除用户信息
- 权限管理：角色分配和权限控制
- 系统设置：基础配置管理
- 数据统计：用户数据分析和报表

### 3. 用户中心 (User)
- 个人信息管理：查看和编辑个人资料
- 密码修改：安全密码更新
- 操作日志：用户行为记录
- 个人设置：个性化配置

## 技术栈

- **前端框架**: Vue.js 3.x
- **UI组件库**: Element Plus
- **路由管理**: Vue Router
- **状态管理**: Pinia
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **样式预处理**: SCSS
- **代码规范**: ESLint + Prettier

## 项目结构

```
src/
├── components/          # 公共组件
│   └── UserProfile.vue  # 用户信息展示组件
├── examples/           # 使用示例
│   └── token-usage.js  # Token使用示例
├── views/              # 页面组件
│   ├── auth/           # 认证相关页面
│   │   ├── Login.vue   # 登录页面
│   │   └── Register.vue # 注册页面
│   ├── admin/          # 管理员后台
│   │   ├── Dashboard.vue # 仪表盘
│   │   ├── UserManage.vue # 用户管理
│   │   └── Settings.vue # 系统设置
│   └── user/           # 用户中心
│       ├── Profile.vue  # 个人资料
│       ├── Security.vue # 安全设置
│       └── Logs.vue    # 操作日志
├── router/             # 路由配置
├── store/              # 状态管理
├── api/                # API接口
├── utils/              # 工具函数
├── assets/             # 静态资源
└── styles/             # 样式文件
```

## Token认证机制

### 登录流程
1. 用户提交登录信息（用户名/密码）
2. 服务器验证成功后返回Token和IP地址
3. Token自动保存到浏览器Cookie（有效期7天）
4. 后续所有POST请求自动携带Token

### 登录接口
**接口名称**: LoginUserWeb

**请求参数示例**:
```json
{
  "Action": "LoginUserWeb",
  "UserName": "15115641701",
  "Password": "Qq123456"
}
```

**响应格式示例**:
```json
{
  "Code": 1000,
  "Message": "登录成功",
  "Token": "{52C8247C-F5F6-4d80-9B83-E27D972DB744}",
  "Ipaddress": "183.9.0.218"
}
```

### 支付状态查询接口
**接口名称**: GetPayState

**请求方法**: POST

**请求参数示例**:
```json
{
  "Action": "GetPayState",
  "OutTradeNo": "订单号"
}
```

**响应格式示例**:
```json
{
  "Code": 1000,
  "Message": "查询成功",
  "Data": {
    "PayStatus": "success"
  }
}
```

**支付状态说明**:
- `success` 或 `paid`: 支付成功
- `pending` 或 `waiting`: 待支付
- `failed` 或 `error`: 支付失败

### 自动Token注入
- **所有请求**: Token统一添加到请求头`Token`中
- **请求头示例**:
```
Token: {52C8247C-F5F6-4d80-9B83-E27D972DB744}
```
- **请求数据示例**:
```json
{
  "Action": "GetUserInfo"
}
```

### 用户信息响应格式
```json
{
  "code": 1000,
  "msg": "获取成功",
  "id": 1009139,
  "phone": "15115641701",
  "qq": "",
  "wx": "",
  "balance": 0.0,
  "reg_time": "2025-06-22 20:49:57",
  "login_time": "2025-07-06 10:51:15",
  "Ipaddress": "183.9.0.218",
  "real_name": "",
  "Authentication": false,
  "node_info": {
    "total_num": 0,
    "pause_num": 0,
    "expire_7_num": 0,
    "expire_end_num": 0
  },
  "referrer_info": {
    "referrer_phone": "15820182688",
    "referrer_qq": "511276827",
    "referrer_wx": "15820182688"
  },
  "my_user_info": {
    "today_num": 0,
    "month_num": 0,
    "year_num": 0,
    "total_num": 0
  }
}
```

### Token管理
- 登录成功：自动保存Token到Cookie
- 请求拦截：自动为POST请求添加Token参数
- Token过期：自动跳转到登录页面
- 登出操作：清除Cookie中的Token

## 功能特性

- 🔐 完整的用户认证系统
- 🎫 自动Token管理机制
- 👥 多角色权限管理
- 📱 响应式设计，支持移动端
- 🎨 现代化UI设计
- 🔧 可配置的系统设置
- 📊 数据可视化图表
- 🛡️ 安全防护机制

## 开发计划

1. **第一阶段**: 项目初始化和基础框架搭建
2. **第二阶段**: 用户认证模块开发
3. **第三阶段**: 管理员后台功能实现
4. **第四阶段**: 用户中心功能开发
5. **第五阶段**: 测试优化和部署

## 安装和运行

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build
```

## SPA路由404问题解决方案

本项目使用Vue Router的History模式，在生产环境部署时需要配置服务器支持SPA路由，否则刷新页面会出现404错误。

### 问题原因
当用户直接访问或刷新非根路径（如 `/user/profile`）时，服务器会尝试查找对应的静态文件，但SPA应用只有一个`index.html`文件，因此返回404错误。

### 解决方案

#### 1. Vite开发服务器配置
已在`vite.config.js`中添加了`historyApiFallback: true`配置，开发环境无需额外配置。

#### 2. 静态服务器部署

**Netlify部署**
项目已包含`public/_redirects`文件，部署到Netlify时会自动生效：
```
/*    /index.html   200
```

**Apache服务器**
项目已包含`public/.htaccess`文件，部署到Apache服务器时会自动生效。

**Nginx服务器**
参考项目根目录的`nginx.conf.example`文件，在Nginx配置中添加：
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**其他静态服务器**
- **Vercel**: 无需额外配置，自动支持SPA路由
- **GitHub Pages**: 需要在`public`目录添加`404.html`文件（内容与`index.html`相同）
- **Firebase Hosting**: 在`firebase.json`中配置重写规则

### 验证方法
1. 构建项目：`npm run build`
2. 部署到服务器
3. 直接访问子路径（如：`https://yourdomain.com/user/profile`）
4. 刷新页面，确认不会出现404错误

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License