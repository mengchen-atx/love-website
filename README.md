# PM Love - 情侣纪念网站

一个为两个人设计的私密恋爱记录网站，记录日常、留言、照片和足迹。

## 功能概览

- 登录页：双栏布局 + 左侧互动小人动画（眼睛/嘴巴/身体跟随鼠标）
- 登录成功：1.5 秒庆祝动画后进入主界面
- 首页：倒计时 + 功能入口卡片
- 点点滴滴：时间线式生活记录
- 留言板：实时聊天式留言
- Love List：恋爱约定清单
- Love Photo：相册上传与查看
- Love Footprint：世界/中国/美国地图足迹记录
- 关于我们：恋爱故事与重要时刻
- 顶部退出按钮：退出后回到登录页

## 登录界面预览

![登录界面预览](./login-ui.png)

## 本地启动

```bash
npm install
npm run dev
```

默认访问：

- 首页：`http://localhost:3000/`
- 登录页：`http://localhost:3000/login`

如果 3000 被占用，Next.js 会自动换端口（如 3001）。

## 环境变量

创建 `.env.local`：

```env
NEXT_PUBLIC_START_DATE=2021-06-01
NEXT_PUBLIC_PARTNER1_NAME=Mao
NEXT_PUBLIC_PARTNER2_NAME=Pi
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 技术栈

- Next.js 15 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Supabase

## 部署

推荐 Vercel：

1. 推送代码到 GitHub
2. 在 Vercel 导入仓库
3. 配置 `.env.local` 对应环境变量
4. 点击部署

---

PM Love - 记录你们每一个心动瞬间
