# SPA路由404问题解决指南

## 问题诊断

如果您仍然遇到404问题，请按照以下步骤进行诊断：

### 1. 确认问题类型

**开发环境测试**：
```bash
npm run dev
# 访问 http://localhost:3001/user/profile
# 刷新页面，检查是否出现404
```

**生产环境测试**：
```bash
npm run build
npm run preview
# 访问 http://localhost:4173/user/profile
# 刷新页面，检查是否出现404
```

### 2. 常见部署场景解决方案

#### A. Nginx服务器

在Nginx配置文件中添加：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    # SPA路由处理 - 关键配置
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**重启Nginx**：
```bash
sudo nginx -t  # 测试配置
sudo systemctl reload nginx  # 重新加载配置
```

#### B. Apache服务器

确保`.htaccess`文件在dist目录根目录下：
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**确保Apache启用了mod_rewrite模块**：
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### C. Netlify部署

确保`_redirects`文件在dist目录根目录下：
```
/*    /index.html   200
```

#### D. Vercel部署

创建`vercel.json`文件：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### E. GitHub Pages部署

1. 确保`404.html`文件存在于dist目录
2. 确保`index.html`包含重定向脚本
3. 如果使用自定义域名，确保CNAME文件正确

### 3. 调试步骤

#### 步骤1：检查文件是否存在
```bash
# 检查dist目录结构
ls -la dist/
# 应该看到：.htaccess, _redirects, 404.html, index.html
```

#### 步骤2：检查服务器配置
```bash
# 检查Nginx配置语法
nginx -t

# 检查Apache配置
apachectl configtest
```

#### 步骤3：检查浏览器网络面板
1. 打开浏览器开发者工具
2. 访问子路径（如：/user/profile）
3. 刷新页面
4. 查看Network面板中的请求状态

#### 步骤4：检查服务器日志
```bash
# Nginx日志
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Apache日志
tail -f /var/log/apache2/error.log
tail -f /var/log/apache2/access.log
```

### 4. 特殊情况处理

#### 子目录部署

如果项目部署在子目录下（如：`https://domain.com/myapp/`），需要配置base路径：

**vite.config.js**：
```javascript
export default defineConfig({
  base: '/myapp/',  // 添加这行
  // ... 其他配置
})
```

**router/index.js**：
```javascript
const router = createRouter({
  history: createWebHistory('/myapp/'),  // 添加base路径
  routes
})
```

#### HTTPS部署

确保所有资源都使用HTTPS，混合内容可能导致路由问题。

### 5. 验证清单

- [ ] 开发环境路由正常工作
- [ ] 生产环境构建成功
- [ ] preview模式路由正常工作
- [ ] 服务器配置文件存在且正确
- [ ] 服务器重启/重新加载配置
- [ ] 浏览器缓存已清除
- [ ] 网络面板显示正确的响应状态

### 6. 常见错误及解决方案

| 错误现象 | 可能原因 | 解决方案 |
|---------|---------|----------|
| 开发环境正常，生产环境404 | 服务器配置缺失 | 添加对应服务器的SPA配置 |
| 根路径正常，子路径404 | 路由fallback未配置 | 检查try_files或rewrite规则 |
| 静态资源404 | base路径配置错误 | 检查vite.config.js中的base配置 |
| 间歇性404 | 缓存问题 | 清除浏览器和CDN缓存 |

### 7. 联系支持

如果按照以上步骤仍无法解决问题，请提供：

1. 部署环境（Nginx/Apache/Netlify等）
2. 具体的错误信息和状态码
3. 浏览器网络面板截图
4. 服务器配置文件内容
5. 服务器错误日志

这将帮助快速定位和解决问题。