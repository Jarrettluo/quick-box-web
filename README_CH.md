# QuickBox - 临时文件共享服务

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-blue)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

QuickBox（快取柜）是一个临时文件共享服务，允许用户上传文件并通过6位取件码分享。文件在7天后自动删除，或在下载后立即删除。

## ✨ 功能特性
- **文件上传**：上传文件并自动生成6位取件码
- **文件下载**：使用取件码下载文件（仅限单次使用）
- **分片上传**：支持大文件分片上传（5MB分片）
- **历史记录管理**：查看和管理上传历史，包含过期时间跟踪
- **响应式设计**：适配桌面和移动设备
- **完全匿名**：无需注册，完全匿名使用

## 🛠️ 技术栈
- **前端框架**：Vue 3、Pinia（状态管理）、Vue Router
- **构建工具**：Vite
- **HTTP客户端**：Axios
- **样式**：CSS响应式设计

## 📁 项目结构
```angular2html
src/
├── components/     # 可复用组件
├── views/         # 页面组件
├── stores/        # Pinia状态管理
├── api/           # API服务
└── utils/         # 工具函数
```
## 主要组件
HomeView.vue - 主界面，包含上传/下载标签页
HistoryView.vue - 上传历史管理
ResultView.vue - 文件下载/上传结果显示
FileCard.vue - 文件信息展示组件

## 安装与运行
```angular2html
#启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📖 使用说明
### 上传文件
1. 选择要上传的文件
2. 点击"生成取件码"
3. 将6位取件码分享给他人

### 下载文件
1. 输入6位取件码
2. 点击"提取文件"
3. 下载文件（仅限单次使用）
### 历史记录管理
- 查看所有上传的文件
- 复制取件码
- 删除单个记录或清空所有历史
## 🔧 API特性
- 分片文件上传（5MB分片）
- 并发上传（同时3个）
- 失败自动重试（最多3次）
- 上传进度跟踪
## 🌐 浏览器兼容性
- 支持ES6+的现代浏览器
- 需要Clipboard API支持代码复制功能
## ⚠️ 注意事项
- 文件最长保留7天，下载后立即删除
- 每个取件码仅能使用一次
- 建议使用现代浏览器以获得最佳体验
- 大文件上传支持断点续传和进度显示
## 📄 许可证
[待确定]