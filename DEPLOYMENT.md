# 🚀 部署指南 - 让网站上线并添加登录功能

## 📋 完整流程

### 第一步：创建 Supabase 项目（免费数据库和认证）

1. **访问 Supabase**
   - 打开 https://supabase.com
   - 点击 "Start your project"
   - 使用 GitHub 账号登录（推荐）

2. **创建新项目**
   - 点击 "New Project"
   - 项目名称：`love-website` 或任何你喜欢的名字
   - 数据库密码：设置一个强密码（记住它！）
   - 区域选择：选择离你最近的（如 Northeast Asia (Seoul)）
   - 点击 "Create new project"
   - 等待 2-3 分钟项目创建完成

3. **获取项目密钥**
   - 在左侧菜单点击 ⚙️ "Settings"
   - 点击 "API"
   - 复制以下两个值：
     - `Project URL`（URL 地址）
     - `anon public`（公开密钥）

4. **配置环境变量**
   - 打开项目的 `.env.local` 文件
   - 添加以下内容：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=你的Project_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_public密钥
   ```

### 第二步：创建数据库表

在 Supabase 控制台执行以下 SQL：

1. 点击左侧菜单的 "SQL Editor"
2. 点击 "New Query"
3. 复制粘贴以下 SQL 代码：

```sql
-- 创建照片表
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建生活记录表
CREATE TABLE moments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建留言表
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建待办事项表
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 Row Level Security (RLS)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建访问策略（只允许登录用户访问）
CREATE POLICY "Authenticated users can view photos"
  ON photos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- moments 表策略
CREATE POLICY "Authenticated users can view moments"
  ON moments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert moments"
  ON moments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete moments"
  ON moments FOR DELETE
  TO authenticated
  USING (true);

-- messages 表策略
CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- todos 表策略
CREATE POLICY "Authenticated users can view todos"
  ON todos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert todos"
  ON todos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update todos"
  ON todos FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete todos"
  ON todos FOR DELETE
  TO authenticated
  USING (true);

-- 创建 Storage bucket 用于存储照片
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- Storage 访问策略
CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'photos');
```

4. 点击 "Run" 执行 SQL

### 第三步：创建用户账号

1. 在 Supabase 控制台左侧点击 🔐 "Authentication"
2. 点击 "Users" 标签
3. 点击 "Add user" → "Create new user"
4. 创建两个账号：

**账号 1 - Mao（你的账号）**
- Email: `你的邮箱@example.com`
- Password: `设置一个强密码`
- 勾选 "Auto Confirm User"
- 点击 "Create user"

**账号 2 - Pi（女朋友的账号）**
- Email: `女朋友的邮箱@example.com`
- Password: `设置一个强密码`
- 勾选 "Auto Confirm User"
- 点击 "Create user"

⚠️ **重要**：记住这两个邮箱和密码！

### 第四步：部署到 Vercel（免费托管）

1. **准备代码**
   ```bash
   # 初始化 Git 仓库
   git init
   git add .
   git commit -m "Initial commit: Love Website"
   ```

2. **推送到 GitHub**
   - 访问 https://github.com/new
   - 创建新仓库（名称如 `love-website`）
   - 设置为 **Private**（私密仓库）
   - 不要初始化 README
   - 创建后，按照页面提示推送代码：
   ```bash
   git remote add origin https://github.com/你的用户名/love-website.git
   git branch -M main
   git push -u origin main
   ```

3. **部署到 Vercel**
   - 访问 https://vercel.com
   - 使用 GitHub 账号登录
   - 点击 "Add New..." → "Project"
   - 选择你的 `love-website` 仓库
   - 点击 "Import"

4. **配置环境变量**
   在 Vercel 部署页面：
   - 展开 "Environment Variables"
   - 添加以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL = 你的Supabase_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = 你的Supabase密钥
   NEXT_PUBLIC_START_DATE = 2022-07-15
   NEXT_PUBLIC_PARTNER1_NAME = Mao
   NEXT_PUBLIC_PARTNER2_NAME = Pi
   ```

5. **点击 "Deploy"**
   - 等待 2-3 分钟
   - 部署完成后，你会得到一个网址（如 `your-app.vercel.app`）

### 第五步：访问网站

1. 打开你的 Vercel 网址
2. 会自动跳转到登录页面
3. 使用你创建的账号登录
4. 开始使用！

## 🔐 安全说明

- ✅ **只有登录用户能访问**：未登录会自动跳转到登录页
- ✅ **只有两个账号**：只在 Supabase 创建了你们两个账号
- ✅ **数据隔离**：使用 Row Level Security 保护数据
- ✅ **HTTPS 加密**：Vercel 自动提供 SSL 证书
- ✅ **私密仓库**：GitHub 代码设为 Private

## 💾 数据说明

- 所有照片、留言、日记都保存在 Supabase 云端
- 两个人都可以添加、修改、删除内容
- 数据永久保存，不会丢失
- 多设备同步（手机、电脑都能访问）

## 📱 使用建议

1. **收藏网址**：在手机和电脑上收藏 Vercel 网址
2. **添加到主屏幕**：在手机浏览器选择"添加到主屏幕"
3. **记住密码**：使用浏览器保存密码功能

## 🆘 常见问题

**Q: 忘记密码怎么办？**
A: 在 Supabase 控制台可以重置密码

**Q: 想添加更多用户？**
A: 在 Supabase Authentication 中创建新用户

**Q: 如何更新网站？**
A: 修改代码后，推送到 GitHub，Vercel 会自动重新部署

**Q: 网址能改成自己的域名吗？**
A: 可以！在 Vercel 项目设置中添加自定义域名（需要购买域名）

## 💡 下一步

部署完成后，我会帮你：
1. 创建登录页面
2. 集成 Supabase 到所有功能页面
3. 实现数据持久化

准备好后告诉我，我们继续！
