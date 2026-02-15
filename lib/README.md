# Lib 文件夹说明

这个文件夹包含项目的工具函数、配置和辅助代码。

## 文件说明

### supabase.ts

Supabase 客户端配置和数据库操作函数。

**使用前需要**：

1. 访问 [supabase.com](https://supabase.com) 创建免费账号
2. 创建新项目（选择离你最近的服务器）
3. 获取项目 URL 和 ANON KEY
4. 在 `.env.local` 中添加：

```env
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的ANON_KEY
```

**数据库表结构**（待创建）：

```sql
-- 照片表
CREATE TABLE photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  taken_at TIMESTAMP,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 日记表
CREATE TABLE diaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 留言表
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  author UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 清单表
CREATE TABLE todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

**Row Level Security (RLS) 策略**：

确保只有你们两个人能访问数据：

```sql
-- 启用 RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建策略（只允许特定用户访问）
-- 需要替换 'user1-uuid' 和 'user2-uuid' 为实际的用户 ID
CREATE POLICY "Only couple can view photos"
  ON photos FOR SELECT
  USING (auth.uid() IN ('user1-uuid', 'user2-uuid'));

-- 类似地为其他表创建策略
```

## 将来可能添加的文件

- `utils.ts` - 通用工具函数
- `constants.ts` - 常量定义
- `types.ts` - TypeScript 类型定义
- `hooks/` - 自定义 React Hooks
- `api/` - API 调用封装

## 最佳实践

1. **环境变量**：敏感信息永远不要硬编码
2. **错误处理**：所有数据库操作都应有错误处理
3. **类型安全**：使用 TypeScript 接口定义数据结构
4. **缓存**：合理使用 React Query 或 SWR 缓存数据
5. **安全**：使用 RLS 保护数据，不要信任客户端

---

随着项目发展，这个文件夹会不断完善。
