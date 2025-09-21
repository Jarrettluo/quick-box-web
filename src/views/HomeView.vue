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
            >
            <progress v-if="!isUploaded && fileStore.uploadProgress > 0" :value="fileStore.uploadProgress" max="100"></progress>
          </div>
          <div class="notice">
            <strong>使用说明：</strong> 上传文件后系统会生成6位取件码，接收方通过取件码下载文件，文件下载后自动删除或7天后过期。
          </div>
          <button type="submit" class="btn btn-block">生成取件码</button>
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

const activeTab = ref('upload')
const fileInput = ref(null)
const selectedFile = ref(null)
const downloadCode = ref('')
const isUploaded = ref(false) // Add this new ref

const fileStore = useFileStore()
const router = useRouter()

const switchTab = (tab) => {
  console.log('Switching to tab:', tab)
  activeTab.value = tab
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]

  console.log('Selected file:', selectedFile.value) // Debug log
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  fileStore.uploadProgress = 10
  await new Promise(resolve => setTimeout(resolve, 500))
  fileStore.uploadProgress = 70
  await new Promise(resolve => setTimeout(resolve, 800))
  fileStore.uploadProgress = 100
  fileStore.uploadProgress = 0 // Reset progress after completion


  fileStore.pickupCode = fileStore.generateCode()
  fileStore.fileInfo = {
    name: selectedFile.value.name,
    size: (selectedFile.value.size / 1024 / 1024).toFixed(2) + ' MB',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }


  isUploaded.value = true // Set to true after successful upload

  // await router.push(`/result/${fileStore.pickupCode}`)
}

const copyCode = () => {
  if (fileStore.pickupCode) {
    navigator.clipboard.writeText(fileStore.pickupCode)
    alert('取件码已复制到剪贴板')
  }
}

// Add this new method to reset the upload state
const resetUpload = () => {
  isUploaded.value = false
  selectedFile.value = null
  fileInput.value.value = ''
  fileStore.uploadProgress = 0
  fileStore.fileInfo = null    // Clear file info
  fileStore.pickupCode = ''   // Clear code
  fileStore.reset() // Assuming you have a reset method in your store
}

const handleDownload = () => {
  if (!downloadCode.value) return
  router.push(`/result/${downloadCode.value}`)
}
</script>

<style scoped>
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