# QuickBox - Temporary File Sharing Service

[![Vue](https://img.shields.io/badge/Vue-3.x-brightgreen)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Build-blue)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

QuickBox is a temporary file sharing service that allows users to upload files and share them via 6-digit pickup codes. Files are automatically deleted after 7 days or immediately after download.

## ✨ Features
- **File Upload**: Upload files and automatically generate 6-digit pickup codes
- **File Download**: Download files using pickup codes (single-use only)
- **Chunked Upload**: Support for large file chunked uploads (5MB chunks)
- **History Management**: View and manage upload history with expiration tracking
- **Responsive Design**: Adapted for both desktop and mobile devices
- **Fully Anonymous**: No registration required, completely anonymous usage

## 🛠️ Tech Stack
- **Frontend Framework**: Vue 3, Pinia (State Management), Vue Router
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS Responsive Design

## 📁 Project Structure
```angular2html
src/
├── components/     # Reusable components
├── views/         # Page components
├── stores/        # Pinia state management
├── api/           # API services
└── utils/         # Utility functions
```

## Main Components
- HomeView.vue - Main interface with upload/download tabs
- HistoryView.vue - Upload history management
- ResultView.vue - File download/upload result display
- FileCard.vue - File information display component

## Installation & Running
```angular2html
# Start development server
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

### Downloading Files
1. Enter the 6-digit pickup code
2. Click "Extract File"
3. Download the file (single-use only)

### History Management
- View all uploaded files
- Copy pickup codes
- Delete individual records or clear all history

## 🔧 API Features
- Chunked file upload (5MB chunks)
- Concurrent uploads (up to 3 simultaneously)
- Automatic retry on failure (up to 3 times)
- Upload progress tracking

## 🌐 Browser Compatibility
- Modern browsers supporting ES6+
- Requires Clipboard API for code copy functionality

## ⚠️ Important Notes
- Files are kept for maximum 7 days, deleted immediately after download
- Each pickup code can only be used once
- Modern browsers are recommended for optimal experience
- Large file uploads support resumable uploads and progress display

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.