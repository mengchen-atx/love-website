# ⚡ 快速部署指南

## 现在的状态

✅ **已完成**：
- 登录页面已创建
- 认证系统已集成
- Header 添加退出登录功能
- 所有必要的依赖已安装

⏳ **待完成**：
- 配置 Supabase
- 部署到 Vercel

## 📋 三步快速部署

### 第一步：配置 Supabase（10分钟）

1. **创建账号和项目**
   - 访问 https://supabase.com
   - 点击 "Start your project"
   - 用 GitHub 登录
   - 创建新项目：
     - 名称：`love-website`
     - 密码：设置一个强密码
     - 区域：选最近的（如 Seoul）
   - 等待 2-3 分钟

2. **获取密钥**
   - 左侧点击 ⚙️ Settings → API
   - 复制两个值：
     - `Project URL`
     - `anon public` 密钥

3. **更新 .env.local**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=粘贴你的URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=粘贴你的密钥
   NEXT_PUBLIC_START_DATE=2022-07-15
   NEXT_PUBLIC_PARTNER1_NAME=Mao
   NEXT_PUBLIC_PARTNER2_NAME=Pi
   ```

4. **创建数据库表**
   - 左侧点击 SQL Editor
   - 新建查询，粘贴以下 SQL：

```sql
-- 创建留言表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用认证保护
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON messages FOR INSERT TO authenticated WITH CHECK (true);
```

   - 点击 Run

5. **创建账号**
   - 左侧点击 🔐 Authentication → Users
   - 添加两个用户：
     - Mao: 你的邮箱 + 密码
     - Pi: 女朋友的邮箱 + 密码
   - 勾选 "Auto Confirm User"

### 第二步：推送到 GitHub（5分钟）

```bash
# 1. 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 2. 在 GitHub 创建仓库
# 访问 https://github.com/new
# 创建私密仓库 love-website

# 3. 推送代码
git remote add origin https://github.com/你的用户名/love-website.git
git branch -M main
git push -u origin main
```

### 第三步：部署到 Vercel（5分钟）

1. **连接 Vercel**
   - 访问 https://vercel.com
   - 用 GitHub 登录
   - 点击 "Add New..." → "Project"
   - 选择 `love-website`
   - 点击 "Import"

2. **配置环境变量**
   - 展开 "Environment Variables"
   - 添加：
   ```
   NEXT_PUBLIC_SUPABASE_URL = 你的Supabase URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的Supabase密钥
   NEXT_PUBLIC_START_DATE = 2022-07-15
   NEXT_PUBLIC_PARTNER1_NAME = Mao
   NEXT_PUBLIC_PARTNER2_NAME = Pi
   ```

3. **部署**
   - 点击 "Deploy"
   - 等待 2-3 分钟
   - 完成！🎉

## 🎉 完成后

你会得到一个网址（如 `your-app.vercel.app`）

访问这个网址：
1. 自动跳转到登录页
2. 输入你创建的账号
3. 登录后就能使用所有功能！

## 💡 使用提示

**手机访问**：
- 添加到主屏幕，像 APP 一样使用

**安全性**：
- 只有你们两个账号能登录
- 未登录无法访问任何页面
- 所有数据加密传输

**数据说明**：
- 目前只有留言板连接了数据库
- 其他功能（照片、日记等）暂时还在浏览器内存
- 后续可以逐步迁移到数据库

## 🆘 遇到问题？

**本地测试**：
配置好 `.env.local` 后，重启开发服务器：
```bash
npm run dev
```

访问 http://localhost:3000 测试登录

**部署后更新**：
修改代码后：
```bash
git add .
git commit -m "更新说明"
git push
```
Vercel 会自动重新部署！

---

准备好了吗？按照上面的步骤操作，20分钟就能完成！🚀
