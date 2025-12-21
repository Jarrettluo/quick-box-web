<template>
  <div class="container">
    <header>
      <h1 class="logo">快取柜</h1>
      <p class="slogan">QuickBox · 临时文件共享服务</p>
    </header>

    <div class="card">
      <div class="tab-container">
        <button
            class="tab"
            :class="{ active: activeTab === 'upload' }"
            @click="switchTab('upload')"
        >
          上传文件
        </button>
        <button
            class="tab"
            :class="{ active: activeTab === 'download' }"
            @click="switchTab('download')"
        >
          提取文件
        </button>
      </div>
      <!-- 上传文件区域 -->
      <div v-if="activeTab === 'upload'" class="tab-content">
        <form v-if="!isUploaded" @submit.prevent="handleUpload">
          <div class="form-group">
            <label for="file">选择文件（7天后自动删除）</label>
            <input
                type="file"
                id="file"
                ref="fileInput"
                @change="handleFileChange"
                required
                :disabled="isUploading"
            >
            <div v-if="selectedFile" class="file-info">
              <p>文件名: {{ selectedFile.name }}</p>
              <p>文件大小: {{ formatFileSize(selectedFile.size) }}</p>
            </div>
            <div v-if="isUploading" class="upload-progress">
              <progress :value="uploadProgress" max="100"></progress>
              <span class="progress-text">{{ uploadProgress }}%</span>
              <div v-if="currentChunk > 0" class="chunk-info">
                分片 {{ currentChunk }}/{{ totalChunks }}
              </div>
            </div>
            <div v-if="uploadError" class="error-message">
              {{ uploadError }}
            </div>
          </div>
          <div class="notice">
            <strong>使用说明：</strong> 上传文件后系统会生成6位取件码，接收方通过取件码下载文件，文件下载后自动删除或7天后过期。
          </div>
          <button
              type="submit"
              class="btn btn-block"
              :disabled="!selectedFile || isUploading"
          >
            {{ isUploading ? '上传中...' : '生成取件码' }}
          </button>
        </form>

        <div v-if="isUploaded && fileStore.fileInfo && fileStore.pickupCode" class="result-container">
          <h3>取件码已生成</h3>
          <div
              class="code-display"
              @click="copyCode"
              title="点击复制"
          >
            {{ fileStore.pickupCode }}
          </div>
          <p class="expiry-info">有效期至: {{ fileStore.fileInfo.expires }}</p>
          <button class="btn btn-block copy-btn" @click="copyCode">复制取件码</button>
          <button class="btn btn-block" @click="resetUpload">上传新文件</button>
        </div>

        <FileCard v-if="isUploaded && fileStore.fileInfo" :file="fileStore.fileInfo" />

        <HistoryView></HistoryView>
      </div>

      <!-- 提取文件区域 -->
      <div v-if="activeTab === 'download'" class="tab-content">
        <form @submit.prevent="handleDownload">
          <div class="form-group">
            <label for="code">输入6位取件码</label>
            <input
                type="text"
                id="code"
                v-model="downloadCode"
                placeholder="例如: 3A7B9C"
                required
                maxlength="6"
            >
          </div>
          <div class="notice">
            <strong>注意：</strong> 每个取件码仅能使用一次，文件下载后立即失效。
          </div>
          <button type="submit" class="btn btn-block">提取文件</button>
        </form>
      </div>
    </div>

    <footer>
      <p>© 2023 快取柜 QuickBox | 文件最长保留7天 | 完全匿名</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFileStore } from '../stores/fileStore'
import FileCard from '../components/FileCard.vue'
import { FileUploadService } from '../api/fileService'
import HistoryView from "@/views/HistoryView.vue";
import message from "@/utils/message.js";

const activeTab = ref('upload')
const fileInput = ref(null)
const selectedFile = ref(null)
const downloadCode = ref('')
const isUploaded = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const currentChunk = ref(0)
const totalChunks = ref(0)
const uploadError = ref('')

const fileStore = useFileStore()
const router = useRouter()

// 创建文件上传服务实例
const uploadService = new FileUploadService({
  chunkSize: 5 * 1024 * 1024, // 5MB
  concurrentUploads: 3,
  maxRetries: 3
})

const switchTab = (tab) => {
  console.log('Switching to tab:', tab)
  activeTab.value = tab
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
  uploadError.value = ''
  console.log('Selected file:', selectedFile.value)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0
  currentChunk.value = 0

  try {
    // 使用分片上传服务
    const fileCode = await uploadService.uploadFile(selectedFile.value, {
      onProgress: (percent) => {
        uploadProgress.value = percent
      },
      onChunkUploaded: (chunkIndex) => {
        currentChunk.value = chunkIndex
      },
      onError: (error) => {
        uploadError.value = error.message || '上传失败'
      }
    })

    // 上传成功，设置取件码和文件信息
    fileStore.pickupCode = fileCode
    fileStore.fileInfo = {
      name: selectedFile.value.name,
      size: formatFileSize(selectedFile.value.size),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }

    // 保存到历史记录
    await fileStore.setUploadResult(fileCode, {
      name: selectedFile.value.name,
      size: selectedFile.value.size
    })

    isUploaded.value = true

  } catch (error) {
    console.error('Upload failed:', error)
    uploadError.value = error.message || '上传失败，请重试'
  } finally {
    isUploading.value = false
  }
}

const copyCode = () => {
  if (fileStore.pickupCode) {
    navigator.clipboard.writeText(fileStore.pickupCode)
    message.success('取件码已复制到剪贴板')
  }
}

const resetUpload = () => {
  isUploaded.value = false
  isUploading.value = false
  selectedFile.value = null
  uploadProgress.value = 0
  currentChunk.value = 0
  totalChunks.value = 0
  uploadError.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }

  fileStore.reset()
}

const handleDownload = () => {
  if (!downloadCode.value) return
  router.push({path: `/result/${downloadCode.value}`,
    query: { isUploader: true }
  })
}
</script>

<style scoped>
/* 保持原有样式不变，只添加新样式 */

.file-info {
  margin-top: 10px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  font-size: 0.9rem;
}

.file-info p {
  margin: 5px 0;
}

.upload-progress {
  margin-top: 15px;
}

.progress-text {
  display: block;
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
  color: var(--primary);
}

.chunk-info {
  text-align: center;
  margin-top: 5px;
  font-size: 0.9rem;
  color: #666;
}

.error-message {
  margin-top: 10px;
  padding: 10px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 5px;
  color: #c00;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 保持原有样式不变 */
:root {
  --primary: #4a6bdf;
  --secondary: #f8f9fa;
  --danger: #e74c3c;
  --text: #333;
  --light: #fff;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
}
body {
  background-color: var(--secondary);
  color: var(--text);
  line-height: 1.6;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
header {
  text-align: center;
  margin: 40px 0;
}
.logo {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 10px;
}
.slogan {
  color: #666;
  font-size: 1.1rem;
}
.card {
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 30px;
  margin-bottom: 30px;
}
.tab-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.tab {
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  background: none;
  border: none;
  outline: none;
}
.tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}
.tab-content {
  display: block;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}
.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}
.btn:hover {
  background: #3a56c4;
}
.btn-block {
  display: block;
  width: 100%;
}
.notice {
  background: #f1f8ff;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  font-size: 0.9rem;
}
footer {
  text-align: center;
  margin-top: 50px;
  color: #777;
  font-size: 0.9rem;
}
progress {
  width: 100%;
  margin-top: 10px;
  height: 8px;
  border-radius: 4px;
}
progress::-webkit-progress-bar {
  background-color: #eee;
  border-radius: 4px;
}
progress::-webkit-progress-value {
  background-color: var(--primary);
  border-radius: 4px;
}
@media (max-width: 600px) {
  .logo {
    font-size: 2rem;
  }
  .card {
    padding: 20px;
  }
}

.result-container {
  margin-top: 10px;
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.code-display {
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  color: var(--primary);
  margin: 15px 0;
  padding: 10px;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.code-display:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.code-display:active {
  transform: scale(0.98);
}

.expiry-info {
  color: #666;
  margin-bottom: 20px;
}

.copy-btn {
  background: #28a745;
  margin-bottom: 8px;
}

.copy-btn:hover {
  background: #218838;
}
</style>