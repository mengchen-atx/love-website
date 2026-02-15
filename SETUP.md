# 🚀 快速设置指南

## 第一步：修改配置

编辑 `.env.local` 文件，设置你们的信息：

```env
# 在一起的开始日期（格式：YYYY-MM-DD）
NEXT_PUBLIC_START_DATE=2021-06-01

# 两人的名字
NEXT_PUBLIC_PARTNER1_NAME=Ki
NEXT_PUBLIC_PARTNER2_NAME=Yi
```

## 第二步：添加头像照片

将两人的照片复制到 `public/images/` 文件夹：

1. 第一个人的照片命名为：`partner1.jpg`
2. 第二个人的照片命名为：`partner2.jpg`

支持的格式：jpg, jpeg, png, webp

**提示**：如果没有添加照片，会自动显示名字首字母作为占位符。

## 第三步：查看效果

已经启动开发服务器，打开浏览器访问：

👉 **http://localhost:3000**

你会看到：
- 双人头像（带动画效果）
- 实时倒计时
- 6 个功能卡片

## 下一步

### 功能页面开发计划：

1. **照片墙** (`/photos`)
   - 瀑布流照片展示
   - 上传新照片
   - 照片详情和评论

2. **旅游日记** (`/moments`)
   - 日记列表
   - 写新日记
   - 富文本编辑器

3. **留言板** (`/messages`)
   - 互相留言
   - 表情包支持
   - 留言回复

4. **恋爱清单** (`/list`)
   - 待办事项
   - 心愿清单
   - 完成打卡

5. **关于我们** (`/about`)
   - 时间轴展示
   - 重要纪念日
   - 故事记录

6. **用户登录** (`/login`)
   - 双人认证
   - Supabase 集成

## 常见问题

### Q: 如何修改主题颜色？
A: 编辑 `tailwind.config.ts` 文件中的 colors 配置

### Q: 如何部署到网上？
A: 推荐使用 Vercel（免费）：
1. 将代码推送到 GitHub
2. 在 vercel.com 导入项目
3. 配置环境变量
4. 自动部署完成

### Q: 如何添加更多功能？
A: 在 `app/` 目录下创建新的页面文件夹，例如 `app/photos/page.tsx`

## 技术支持

如需帮助，可以查看：
- Next.js 文档：https://nextjs.org/docs
- TailwindCSS 文档：https://tailwindcss.com/docs
- Supabase 文档：https://supabase.com/docs

---

祝你们使用愉快！💕
