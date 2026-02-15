# 🚀 5 分钟快速开始

## 当前状态

✅ 项目已创建  
✅ 依赖已安装  
✅ 开发服务器已启动  

## 立即查看

打开浏览器访问：**http://localhost:3000**

你会看到：
- 🖼️ 双人头像展示（带动画效果）
- ⏱️ 实时倒计时
- 🎯 6 个功能导航卡片
- 📱 完全响应式设计

## 个性化设置

### 1. 修改你们的信息

编辑文件：`.env.local`

```bash
# 修改开始日期（你们在一起的日期）
NEXT_PUBLIC_START_DATE=2021-06-01

# 修改两人的名字
NEXT_PUBLIC_PARTNER1_NAME=Ki
NEXT_PUBLIC_PARTNER2_NAME=Yi
```

保存后，页面会自动刷新！

### 2. 添加真实头像

将照片复制到 `public/images/` 文件夹：

```bash
public/images/partner1.jpg  # Ki 的照片
public/images/partner2.jpg  # Yi 的照片
```

支持格式：jpg, png, webp

**提示**：如果没有添加照片，会显示名字首字母作为漂亮的占位符。

## 功能导航

当前所有页面都可以点击访问：

- ✅ **首页** - 完整实现
- 🚧 **Love Photo** - 占位页面（待开发）
- 🚧 **点点滴滴** - 占位页面（待开发）
- 🚧 **留言板** - 占位页面（待开发）
- 🚧 **关于我们** - 占位页面（待开发）
- 🚧 **Love List** - 占位页面（待开发）

## 技术特性

✨ **已实现的功能**：
- 实时倒计时（精确到秒）
- 响应式设计（手机/平板/电脑完美适配）
- 漂亮的动画效果
- 网格背景装饰
- 自定义滚动条
- 占位符头像（SVG 生成）
- 悬停动画效果

## 下一步开发建议

### 短期（1-2 周）

1. **照片墙功能**
   - 接入 Supabase Storage
   - 实现照片上传
   - 瀑布流布局

2. **用户认证**
   - Supabase Auth
   - 只允许两人登录

### 中期（3-4 周）

3. **日记功能**
   - 富文本编辑器
   - 日记列表展示

4. **留言板**
   - 互相留言
   - 实时更新

### 长期（1-2 月）

5. **高级功能**
   - 时间轴
   - 恋爱清单
   - 照片标签
   - 搜索功能
   - PWA 支持

## 部署到线上（免费）

### 方法 1：Vercel（推荐）

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入 GitHub 仓库
4. 添加环境变量（开始日期、名字）
5. 自动部署完成

**完全免费，自动 HTTPS，全球 CDN 加速！**

### 方法 2：Netlify

1. 推送到 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 导入仓库
4. 配置环境变量
5. 部署

## 常见问题

### Q: 倒计时不准确？
A: 检查 `.env.local` 中的日期格式是否为 `YYYY-MM-DD`

### Q: 头像显示不出来？
A: 确保照片放在 `public/images/` 文件夹，且命名为 `partner1.jpg` 和 `partner2.jpg`

### Q: 如何停止开发服务器？
A: 在终端按 `Ctrl + C`

### Q: 如何重启服务器？
A: 运行 `npm run dev`

### Q: 如何修改颜色主题？
A: 编辑 `tailwind.config.ts` 中的 colors 配置

## 文档索引

- 📖 **README.md** - 项目完整说明
- 🚀 **SETUP.md** - 详细设置指南
- 📁 **PROJECT_STRUCTURE.md** - 项目结构说明
- ⚡ **QUICKSTART.md** - 本文件（快速开始）

## 获取帮助

遇到问题？查看：
- [Next.js 文档](https://nextjs.org/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Supabase 文档](https://supabase.com/docs)

---

💕 祝你们使用愉快！享受记录爱的时光！
