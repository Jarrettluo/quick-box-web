# QuickBox - 临时文件共享服务

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-blue)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

QuickBox（快取柜）是一个临时文件共享服务，允许用户上传文件并通过6位取件码分享。文件在7天后自动删除，或在下载后立即删除。

## ✨ 功能特性
- **文件上传**：上传文件并自动生成6位取件码
- **文件下载**：使用取件码下载文件（仅限单次使用）
- **分片上传**：支持大文件分片上传（5MB分片）
- **文件夹上传**：支持上传整个文件夹并保留目录结构
- **历史记录管理**：查看和管理上传历史，包含过期时间跟踪
- **响应式设计**：适配桌面和移动设备
- **完全匿名**：无需注册，完全匿名使用
- **上传进度**：实时上传进度跟踪和详细统计信息
- **错误处理**：失败自动重试（最多3次）和错误恢复

## 🛠️ 技术栈
- **前端框架**：Vue 3、Pinia（状态管理）、Vue Router
- **构建工具**：Vite
- **HTTP客户端**：Axios
- **样式**：CSS响应式设计
- **状态管理**：Pinia
- **路由**：Vue Router 4

## 📁 项目结构
```angular2html
src/
├── components/     # 可复用组件
│   ├── DownloadTab.vue - 下载功能标签页
│   ├── FileCard.vue - 文件信息显示组件
│   ├── FileUploader.vue - 分片上传文件组件
│   ├── FolderUploadTab.vue - 文件夹上传功能标签页
│   ├── FolderUploader.vue - 文件夹上传组件
│   ├── Modal.vue - 可复用模态框组件
│   ├── ModalContent.vue - 模态框内容包装器
│   ├── UploadProcess.vue - 上传进度可视化
│   ├── UploadResult.vue - 上传结果显示
│   └── UploadTab.vue - 上传功能标签页
├── views/         # 页面组件
│   ├── HistoryView.vue - 上传历史管理
│   ├── HomeView.vue - 包含上传/下载标签页的主界面
│   ├── NewHomeView.vue - 增强型主界面
│   └── ResultView.vue - 文件下载/上传结果显示
├── stores/        # Pinia状态管理
├── api/           # API服务
│   ├── fileService.js - 文件和文件夹上传/下载API
│   └── index.js - API配置
└── utils/         # 工具函数
```

## 主要组件
- **HomeView.vue** - 包含上传/下载标签页的主界面
- **NewHomeView.vue** - 增强型主界面，提升用户体验
- **HistoryView.vue** - 上传历史管理，支持搜索和过滤
- **ResultView.vue** - 文件下载/上传结果显示，包含详细信息
- **FileCard.vue** - 文件信息显示组件，包含进度跟踪
- **FileUploader.vue** - 高级文件上传组件，支持分片上传
- **FolderUploader.vue** - 文件夹上传组件，保留目录结构

## 安装与运行
```angular2html
# 启动开发服务器（允许外部访问）
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
4. 文件自动可供下载

### 上传文件夹
1. 选择"文件夹上传"标签页
2. 选择要上传的文件夹
3. 文件夹结构在上传过程中会被保留
4. 生成并分享取件码

### 下载文件
1. 输入6位取件码
2. 点击"提取文件"
3. 下载文件（仅限单次使用）
4. 文件在下载后自动删除

### 历史记录管理
- 查看所有上传的文件，包含取件码和过期日期
- 将取件码复制到剪贴板
- 删除单个记录或清空所有历史
- 搜索和过滤历史记录

## 🔧 API特性
- **分片上传**：5MB分片大小，高效处理大文件
- **并发上传**：最多3个并发分片上传
- **自动重试**：每个分片失败后自动重试（最多3次）
- **进度跟踪**：实时上传进度，包含详细统计信息
- **文件夹上传**：支持上传整个文件夹结构，自动处理ZIP压缩
- **断点续传**：支持恢复失败的上传（需后端支持）

## 🎨 用户界面
### 响应式设计
- **桌面端**：功能完整的界面，包含所有标签页和功能
- **移动端**：优化的布局，支持触摸操作和响应式设计
- **平板端**：混合界面，适配网格布局

### 关键界面元素
- **标签导航**：在上传、下载和历史记录视图之间轻松切换
- **拖拽上传**：支持拖拽文件选择
- **进度条**：可视化上传进度，显示百分比和时间估计
- **模态对话框**：用于操作和反馈的干净直观的模态窗口

## 🌐 浏览器兼容性
- 支持ES6+的现代浏览器
- Chrome 80+、Firefox 75+、Safari 14+、Edge 80+
- 需要Clipboard API支持代码复制功能
- 需要File API支持文件处理
- 响应式设计适配各种屏幕尺寸

## 🔧 配置
### 环境变量
- `VITE_API_BASE_URL`：后端API端点（默认：`/api`）
- `VITE_UPLOAD_CHUNK_SIZE`：上传分片大小（默认：5MB）
- `VITE_MAX_RETRIES`：每个分片的最大重试次数（默认：3）

### 构建配置
```javascript
// vite.config.js
build: {
  sourcemap: false,
  chunkSizeWarningLimit: 500,
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router', 'pinia'],
        utils: ['axios']
      }
    }
  }
}
```

## ⚠️ 注意事项
- 文件最长保留7天，下载后立即删除
- 每个取件码仅能使用一次
- 建议使用现代浏览器以获得最佳体验
- 大文件上传支持断点续传和进度显示
- 文件夹上传会自动处理并保留原始结构
- 文件传输过程中会进行加密（HTTPS）

## 🚀 性能优化
- **代码分割**：自动对第三方库进行分块
- **Tree Shaking**：消除未使用的代码
- **懒加载**：组件动态导入
- **优化构建**：生产版本的压缩和混淆

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。