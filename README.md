# 用户管理系统

## 项目介绍

这是一个基于Vue.js开发的加速器用户管理系统，提供完整的用户管理功能。

## 功能模块

### 1. 用户认证模块
- **登录页面**: 用户登录入口，支持用户名登录，统一使用LoginUserWeb接口
- **注册页面**: 新用户注册功能，包含表单验证
- **忘记密码**: 密码重置功能

### 2. 用户中心 (User)
- **个人信息管理**: 查看和编辑个人资料
- **账户充值**: 在线充值功能，支持多种支付方式
- **充值记录**: 查看历史充值记录
- **订单管理**: 查看和管理用户订单
- **操作日志**: 用户行为记录和系统日志

### 3. 业务管理模块
- **业务列表**: 查看和管理用户的业务服务
- **过期业务**: 管理即将过期或已过期的业务

### 4. 产品管理模块
- **路由产品**: 管理和配置路由相关产品

### 5. 推广管理模块
- **代理推广**: 代理商推广功能和统计
- **代理设置**: 代理商参数配置
- **代理用户**: 管理代理商下级用户
- **提现订单**: 处理提现申请订单
- **提现列表**: 查看提现记录和状态

### 6. 错误处理模块
- **403页面**: 权限不足提示页面
- **404页面**: 页面未找到提示页面

## 技术栈

- **前端框架**: Vue.js 3.3.4
- **UI组件库**: Element Plus 2.3.9 + Element Plus Icons
- **路由管理**: Vue Router 4.2.4
- **状态管理**: Pinia 2.1.6
- **HTTP客户端**: Axios 1.5.0
- **构建工具**: Vite 4.4.9
- **样式预处理**: Sass/SCSS 1.66.1
- **代码规范**: ESLint 8.47.0 + Prettier 3.0.2
- **数据可视化**: ECharts 5.4.3 + Vue-ECharts 6.6.1
- **工具库**: 
  - Day.js 1.11.9 (日期处理)
  - js-cookie 3.0.5 (Cookie管理)
  - qrcode 1.5.4 (二维码生成)
- **开发工具**:
  - unplugin-auto-import (自动导入)
  - unplugin-vue-components (组件自动导入)

## 项目结构

```
src/
├── App.vue             # 根组件
├── main.js             # 应用入口文件
├── components/         # 公共组件
│   └── UserProfile.vue # 用户信息展示组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   ├── auth/           # 认证相关页面
│   │   ├── Login.vue   # 登录页面
│   │   ├── Register.vue # 注册页面
│   │   └── ForgotPassword.vue # 忘记密码页面
│   ├── error/          # 错误页面
│   │   ├── 403.vue     # 403禁止访问页面
│   │   └── 404.vue     # 404页面未找到页面
│   ├── test/           # 测试页面
│   └── user/           # 用户中心
│       ├── Layout.vue  # 用户中心布局组件
│       ├── Welcome.vue # 欢迎页面
│       ├── Profile.vue # 个人资料
│       ├── AccountRecharge.vue # 账户充值
│       ├── RechargeRecords.vue # 充值记录
│       ├── Orders.vue  # 订单管理
│       ├── Logs.vue    # 操作日志
│       ├── business/   # 业务管理
│       │   ├── List.vue # 业务列表
│       │   └── Expired.vue # 过期业务
│       ├── products/   # 产品管理
│       │   └── Routes.vue # 路由产品
│       └── promotion/  # 推广管理
│           ├── AgentPromotion.vue # 代理推广
│           ├── AgentSettings.vue  # 代理设置
│           ├── AgentUsers.vue     # 代理用户
│           ├── OrderWithdraw.vue  # 提现订单
│           └── WithdrawList.vue   # 提现列表
├── router/             # 路由配置
│   └── index.js        # 路由配置文件
├── store/              # 状态管理
│   └── user.js         # 用户状态管理
├── api/                # API接口
│   ├── auth.js         # 认证相关接口
│   └── finance.js      # 财务相关接口
├── utils/              # 工具函数
│   ├── request.js      # HTTP请求封装
│   └── userHelper.js   # 用户辅助函数
├── config/             # 配置文件
│   └── index.js        # 应用配置
├── styles/             # 样式文件
│   └── index.scss      # 全局样式
├── examples/           # 使用示例
│   └── token-usage.js  # Token使用示例
├── test/               # 测试文件
│   └── copy-test.html  # 复制功能测试
└── themes/             # 主题配置
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

## 开发环境配置

### 环境要求
- Node.js 16+ 
- Yarn 1.22.22+ (推荐) 或 npm

### 安装和运行

```bash
# 安装依赖
yarn install
# 或
npm install

# 开发环境运行 (默认端口: 3000)
yarn dev
# 或
npm run dev

# 构建生产版本
yarn build
# 或
npm run build

# 预览构建结果 (端口: 4173)
yarn preview
# 或
npm run preview

# 代码格式化
yarn format
# 或
npm run format

# 代码检查
yarn lint
# 或
npm run lint
```

### 开发服务器配置
- **端口**: 3000
- **自动打开浏览器**: 是
- **热重载**: 支持
- **CORS**: 已启用
- **API代理**: `/api` -> `http://localhost:8080`
- **路径别名**: `@` -> `src/`

### 自动导入配置
项目已配置自动导入功能，无需手动导入以下内容：
- Vue 3 API (ref, reactive, computed 等)
- Vue Router API
- Pinia API
- Element Plus 组件

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

## 项目配置文件说明

### 核心配置文件
- `vite.config.js` - Vite构建配置
- `package.json` - 项目依赖和脚本
- `.env` - 环境变量配置
- `auto-imports.d.ts` - 自动导入类型声明

### 部署相关文件
- `public/.htaccess` - Apache服务器配置
- `public/_redirects` - Netlify重定向配置
- `public/404.html` - GitHub Pages 404处理
- `nginx.conf.example` - Nginx配置示例

### 静态资源
- `public/logo.svg` - 应用Logo
- `public/alipay.png` - 支付宝图标
- `public/avatars/` - 用户头像资源

## 开发注意事项

### 代码规范
- 使用 ESLint + Prettier 进行代码格式化
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case
- 提交前请运行 `yarn lint` 检查代码

### API接口规范
- 所有POST请求自动携带Token
- 统一使用 `Action` 字段标识接口
- 响应格式统一为 `{Code, Message, Data}` 结构

### 浏览器兼容性
- 现代浏览器 (Chrome 88+, Firefox 85+, Safari 14+)
- 不支持 IE 浏览器

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 更新日志

### v1.0.0 (当前版本)
- ✅ 完整的用户认证系统
- ✅ 用户中心功能模块
- ✅ 业务管理功能
- ✅ 推广代理系统
- ✅ 财务管理模块
- ✅ 响应式UI设计
- ✅ SPA路由支持
- ✅ 自动化构建部署


