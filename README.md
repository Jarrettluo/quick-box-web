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