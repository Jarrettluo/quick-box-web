<template>
  <form v-if="!isUploaded" @submit.prevent="$emit('upload')">
    <div class="form-group">
      <label for="folder">选择文件夹（7天后自动删除）</label>

      <!-- 文件夹选择区域 -->
      <div class="file-input-container">
        <input
            type="file"
            id="folder"
            ref="fileInput"
            @change="handleFolderChange"
            required
            :disabled="isUploading"
            class="file-input"
            webkitdirectory
            directory
            multiple
        >
        <label for="folder" class="file-input-label" :class="{ 'disabled': isUploading }">
          <div class="file-input-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div class="file-input-text">
            <span v-if="!selectedFolder || selectedFolder.length === 0">点击选择文件夹或拖拽到此处</span>
            <span v-else class="file-selected">{{ selectedFolderName }}</span>
            <p class="file-input-hint">支持选择整个文件夹，保持目录结构</p>
          </div>
        </label>
      </div>

      <!-- 文件夹信息卡片 -->
      <div v-if="selectedFolder && selectedFolder.length > 0" class="file-info-card">
        <div class="file-info-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               class="file-icon">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <div class="file-info-main">
            <h4 class="file-name">{{ selectedFolderName }}</h4>
            <p class="file-size">{{ folderFileCount }} 个文件，总计 {{ formatFileSize(folderTotalSize) }}</p>
          </div>
          <button v-if="!isUploading" type="button" class="file-remove-btn" @click="$emit('remove-folder')" title="移除文件夹">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- 上传进度组件 -->
      <UploadProgress
          v-if="isUploading"
          :uploadProgress="uploadProgress"
          :currentChunk="currentChunk"
          :totalChunks="totalChunks"
      />

      <!-- 错误信息 -->
      <div v-if="uploadError" class="error-message-card">
        <div class="error-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>上传失败</span>
        </div>
        <p class="error-details">{{ uploadError }}</p>
      </div>
    </div>

    <div class="notice">
      <strong>使用说明：</strong> 上传文件夹后系统会生成6位取件码，接收方通过取件码下载文件夹（ZIP压缩包），文件夹下载后自动删除或7天后过期。
    </div>

    <button
        type="submit"
        class="btn btn-block upload-btn"
        :disabled="!selectedFolder || selectedFolder.length === 0 || isUploading"
        :class="{ 'uploading': isUploading }"
    >
      <span v-if="isUploading" class="btn-loading">
        <span class="loading-spinner"></span>
        上传中...
      </span>
      <span v-else>
        生成取件码
      </span>
    </button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import UploadProgress from './UploadProcess.vue'

const props = defineProps({
  selectedFolder: Object,
  isUploading: Boolean,
  uploadProgress: Number,
  currentChunk: Number,
  totalChunks: Number,
  uploadError: String
})

const emit = defineEmits(['folder-selected', 'upload', 'remove-folder'])

const fileInput = ref(null)

const selectedFolderName = computed(() => {
  if (!props.selectedFolder || props.selectedFolder.length === 0) return ''
  // 尝试从第一个文件中获取文件夹路径
  const firstFile = props.selectedFolder[0]
  if (firstFile.webkitRelativePath) {
    const parts = firstFile.webkitRelativePath.split('/')
    if (parts.length > 1) {
      return parts[0] // 返回顶层文件夹名
    }
  }
  return '文件夹'
})

const folderFileCount = computed(() => {
  return props.selectedFolder ? props.selectedFolder.length : 0
})

const folderTotalSize = computed(() => {
  if (!props.selectedFolder) return 0
  return Array.from(props.selectedFolder).reduce((total, file) => total + file.size, 0)
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFolderChange = (event) => {
  const files = event.target.files
  emit('folder-selected', files)
}
</script>

<style scoped>
.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--gray-dark);
  font-size: 0.95rem;
}

/* 文件选择区域样式 */
.file-input-container {
  position: relative;
  margin-bottom: 15px;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-input-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--gray-light);
  border: 2px dashed var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 180px;
}

.file-input-label:hover {
  border-color: var(--primary-light);
  background: rgba(74, 107, 223, 0.05);
}

.file-input-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-input-label.disabled:hover {
  border-color: var(--border);
  background: var(--gray-light);
}

.file-input-icon {
  margin-bottom: 15px;
  color: var(--primary);
}

.file-input-icon svg {
  width: 48px;
  height: 48px;
}

.file-input-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input-text span {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray-dark);
}

.file-selected {
  color: var(--primary) !important;
  font-weight: 600 !important;
}

.file-input-hint {
  font-size: 0.9rem;
  color: var(--gray);
  margin-top: 5px;
}

/* 文件信息卡片 */
.file-info-card {
  background: var(--light);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.file-info-main {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-dark);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.85rem;
  color: var(--gray);
}

.file-remove-btn {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-remove-btn:hover {
  background: var(--gray-light);
  color: var(--danger);
}

/* 错误信息卡片 */
.error-message-card {
  background: #fff5f5;
  border: 1px solid #fcc;
  border-radius: 10px;
  padding: 16px;
  margin-top: 15px;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.error-header svg {
  color: var(--danger);
}

.error-header span {
  font-weight: 600;
  color: var(--danger);
}

.error-details {
  font-size: 0.9rem;
  color: #c00;
  margin: 0;
  line-height: 1.5;
}

/* 按钮样式 */
.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 107, 223, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-block {
  display: block;
  width: 100%;
}

.upload-btn {
  margin-top: 10px;
  font-size: 1.05rem;
  padding: 16px;
}

.upload-btn.uploading {
  background: var(--gray);
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

/* 通知区域 */
.notice {
  background: #f1f8ff;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.9rem;
  color: var(--gray-dark);
  border-left: 4px solid var(--primary);
}

.notice strong {
  color: var(--primary);
}

/* 动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(40, 167, 69, 0.4);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-input-label {
    padding: 30px 15px;
    min-height: 160px;
  }

  .file-input-icon svg {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .upload-progress-container {
    padding: 15px;
  }
}
</style>