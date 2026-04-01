# QuickBox - Temporary File Sharing Service

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-blue)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

QuickBox is a temporary file sharing service that allows users to upload files and share them via 6-digit pickup codes. Files are automatically deleted after 7 days or immediately after download.

## ✨ Features
- **File Upload**: Upload files and automatically generate 6-digit pickup codes
- **File Download**: Download files using pickup codes (single-use only)
- **Chunked Upload**: Support for large file chunked uploads (5MB chunks)
- **Folder Upload**: Support for entire folder uploads with directory structure preservation
- **History Management**: View and manage upload history with expiration tracking
- **Responsive Design**: Adapted for both desktop and mobile devices
- **Fully Anonymous**: No registration required, completely anonymous usage
- **Upload Progress**: Real-time upload progress tracking with detailed statistics
- **Error Handling**: Automatic retry on failure (up to 3 times) with error recovery

## 🛠️ Tech Stack
- **Frontend Framework**: Vue 3, Pinia (State Management), Vue Router
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS Responsive Design
- **State Management**: Pinia
- **Router**: Vue Router 4

## 📁 Project Structure
```angular2html
src/
├── components/     # Reusable components
│   ├── DownloadTab.vue - Download functionality tab
│   ├── FileCard.vue - File information display component
│   ├── FileUploader.vue - File upload component with chunking
│   ├── FolderUploadTab.vue - Folder upload functionality tab
│   ├── FolderUploader.vue - Folder upload component
│   ├── Modal.vue - Reusable modal component
│   ├── ModalContent.vue - Modal content wrapper
│   ├── UploadProcess.vue - Upload progress visualization
│   ├── UploadResult.vue - Upload result display
│   └── UploadTab.vue - Upload functionality tab
├── views/         # Page components
│   ├── HistoryView.vue - Upload history management
│   ├── HomeView.vue - Main interface with upload/download tabs
│   ├── NewHomeView.vue - Enhanced main interface
│   └── ResultView.vue - File download/upload result display
├── stores/        # Pinia state management
├── api/           # API services
│   ├── fileService.js - File and folder upload/download API
│   └── index.js - API configuration
└── utils/         # Utility functions
```

## Main Components
- **HomeView.vue** - Main interface with upload/download tabs
- **NewHomeView.vue** - Enhanced main interface with improved user experience
- **HistoryView.vue** - Upload history management with search and filtering
- **ResultView.vue** - File download/upload result display with detailed information
- **FileCard.vue** - File information display component with progress tracking
- **FileUploader.vue** - Advanced file upload component with chunking support
- **FolderUploader.vue** - Folder upload component with directory structure preservation

## Installation & Running
```angular2html
# Start development server (with host access)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide
### Uploading Files
1. Select the file to upload
2. Click "Generate Pickup Code"
3. Share the 6-digit pickup code with others
4. Files are automatically available for download

### Uploading Folders
1. Select the "Folder Upload" tab
2. Choose the folder to upload
3. The folder structure is preserved during upload
4. Generate and share the pickup code

### Downloading Files
1. Enter the 6-digit pickup code
2. Click "Extract File"
3. Download the file (single-use only)
4. File is automatically deleted after download

### History Management
- View all uploaded files with pickup codes and expiration dates
- Copy pickup codes to clipboard
- Delete individual records or clear all history
- Search and filter history records

## 🔧 API Features
- **Chunked Upload**: 5MB chunk size for efficient large file handling
- **Concurrent Uploads**: Up to 3 concurrent chunk uploads
- **Automatic Retry**: 3 retry attempts per chunk on failure
- **Progress Tracking**: Real-time upload progress with detailed statistics
- **Folder Upload**: Support for entire folder structures with automatic ZIP handling
- **Resume Upload**: Ability to resume failed uploads (if supported by backend)

## 🎨 User Interface
### Responsive Design
- **Desktop**: Full-featured interface with all tabs and functionality
- **Mobile**: Optimized layout with touch-friendly controls and responsive design
- **Tablet**: Hybrid interface with adaptive grid layouts

### Key Interface Elements
- **Tab Navigation**: Easy switching between Upload, Download, and History views
- **Drag & Drop**: Support for drag and drop file selection
- **Progress Bars**: Visual upload progress with percentage and time estimates
- **Modal Dialogs**: Clean and intuitive modal windows for actions and feedback

## 🌐 Browser Compatibility
- Modern browsers supporting ES6+
- Chrome 80+, Firefox 75+, Safari 14+, Edge 80+
- Requires Clipboard API for code copy functionality
- Requires File API for file handling
- Responsive design optimized for various screen sizes

## 🔧 Configuration
### Environment Variables
- `VITE_API_BASE_URL`: Backend API endpoint (default: `/api`)
- `VITE_UPLOAD_CHUNK_SIZE`: Chunk size for uploads (default: 5MB)
- `VITE_MAX_RETRIES`: Maximum retry attempts per chunk (default: 3)

### Build Configuration
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

## ⚠️ Important Notes
- Files are kept for maximum 7 days, deleted immediately after download
- Each pickup code can only be used once
- Modern browsers are recommended for optimal experience
- Large file uploads support resumable uploads and progress display
- Folder uploads are automatically handled and preserved in their original structure
- Files are encrypted during transfer (HTTPS)

## 🚀 Performance Optimizations
- **Code Splitting**: Automatic chunking of vendor libraries
- **Tree Shaking**: Elimination of unused code
- **Lazy Loading**: Dynamic import of components
- **Optimized Build**: Minification and compression for production

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---

## 🐳 Docker 部署方案

### 前置要求
- Docker
- Nginx (用于反向代理)
- 已部署的后端服务

### 快速部署 (与后端一起)

后端项目 `deploy/docker-compose.yml` 已包含前端 Nginx 服务。

```bash
# 1. 克隆后端项目
git clone -b develop https://github.com/Jarrettluo/quick-box-server.git
cd quick-box-server/deploy

# 2. 配置并启动 (后端 + 前端)
docker-compose up -d

# 3. 前端访问 (通过后端 Nginx)
# 默认: http://localhost:80
```

### 单独部署前端

如果你只需要部署前端 (后端已单独运行):

```bash
# 1. 克隆前端项目
git clone -b develop https://github.com/Jarrettluo/quick-box-web.git
cd quick-box-web

# 2. 安装依赖并构建
npm install
npm run build

# 3. 使用 Nginx 部署
# 将 dist 目录复制到 Nginx 的 html 目录
# 配置 nginx.conf 反向代理到后端
```

### Nginx 配置示例

```nginx
server {
    listen 8083;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 前端路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 反向代理 (修改为你的后端地址)
    location /api/ {
        proxy_pass http://backend:8089/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| VITE_API_BASE_URL | 后端 API 地址 | /api |
| VITE_UPLOAD_CHUNK_SIZE | 分片大小 | 5242880 (5MB) |
| VITE_MAX_RETRIES | 最大重试次数 | 3 |

### 常见问题

**1. 前端无法访问后端 API**
- 检查 Nginx 反向代理配置
- 确认后端服务正在运行

**2. 文件上传失败**
- 检查后端 Redis 连接
- 确认文件存储目录权限

**3. CORS 错误**
- 后端已配置 CORS，如有特殊需求请修改后端配置
