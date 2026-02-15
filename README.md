# 💕 Love Website - 情侣纪念网站

一个专为情侣设计的私密相册和日记网站，记录你们一起走过的每一个美好瞬间。

## ✨ 功能特性

- 📸 **Love Photo** - 恋爱相册，记录最美瞬间
- 📝 **点点滴滴** - 生活记录，记住每个重要时刻
- 💬 **留言板** - 互相留言，写下爱的祝福
- 📋 **Love List** - 恋爱清单，记录你们的约定
- 👫 **关于我们** - 你们的故事
- ⏱️ **倒计时** - 实时显示在一起的时间

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的配置：

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
# 在一起的开始日期（格式：YYYY-MM-DD）
NEXT_PUBLIC_START_DATE=2021-06-01

# 两人的名字
NEXT_PUBLIC_PARTNER1_NAME=Ki
NEXT_PUBLIC_PARTNER2_NAME=Yi

# Supabase 配置（后续添加）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 添加头像

将两人的照片放在 `public/images/` 文件夹中：
- `partner1.jpg` - 第一个人的头像
- `partner2.jpg` - 第二个人的头像

### 4. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📦 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: TailwindCSS
- **图标**: Lucide React
- **数据库**: Supabase (即将集成)
- **部署**: Vercel

## 🎨 界面预览

首页包含：
- 双人头像展示
- 实时倒计时
- 功能导航卡片
- 响应式设计（支持手机/平板/电脑）

## 📱 部署到 Vercel（免费）

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入你的 GitHub 仓库
4. 配置环境变量
5. 点击部署

## 🔐 后续功能开发

- [ ] 用户登录认证（只允许两个人登录）
- [ ] 照片上传和管理
- [ ] 日记/日志功能
- [ ] 留言板
- [ ] 时间轴展示
- [ ] 评论功能
- [ ] 照片标签和分类
- [ ] 搜索功能

## 💝 使用建议

这是一个私密的两人空间，建议：
1. 不要公开分享网站链接
2. 使用强密码保护账户
3. 定期备份照片
4. 享受记录生活的乐趣

## 📄 License

MIT License - 自由使用和修改

---

用 ❤️ 打造的情侣专属空间
