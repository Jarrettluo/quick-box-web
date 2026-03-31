<template>
  <div class="container">
    <header>
      <div class="header-content">
        <div class="title-area">
          <h1 class="logo">{{ $t('app.logo') }}</h1>
          <p class="slogan">{{ $t('app.slogan') }}</p>
        </div>
        <LanguageSelector />
      </div>
    </header>

    <div class="card">
      <template v-if="isUploader">
        <h2>{{ $t('resultPage.uploadSuccess') }}</h2>
        <p>{{ $t('resultPage.yourCode') }}<strong>{{ code }}</strong></p>
        <FileCard :file="fileStore.fileInfo" />
        <div class="notice">
          {{ $t('resultPage.tip') }}
        </div>
      </template>

      <template v-else>
        <div v-if="loading" class="loading">
          {{ $t('resultPage.loading') }}
        </div>
        <div v-else-if="error" class="error-container">
          <h2>{{ $t('resultPage.getFileFailed') }}</h2>
          <div class="error-message">
            {{ error }}
          </div>
          <button class="btn btn-block copy-btn" @click="goToHome">{{ $t('resultPage.uploadNewFile') }}</button>
          <div class="notice">
            {{ $t('resultPage.checkCode') }}
          </div>
        </div>
        <div v-else>
          <h2>{{ $t('resultPage.fileReady') }}</h2>
          <FileCard v-if="fileInfo"  :file="fileInfo" />
          <button class="btn btn-block" @click="downloadFile" :disabled="downloading">
            {{ downloading ? $t('resultPage.downloading') : $t('resultPage.downloadNow') }}
          </button>
          <button class="btn btn-block copy-btn" @click="goToHome">{{ $t('resultPage.uploadNewFile') }}</button>
          <div class="notice">
            {{ $t('resultPage.downloadTip') }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFileStore } from '../stores/fileStore'
import FileCard from "@/components/FileCard.vue"
import { fileApi } from '@/api/fileService'
import message from "@/utils/message.js";
import LanguageSelector from '../components/LanguageSelector.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const fileStore = useFileStore()
const code = route.params.code

// 判断当前用户是上传者还是下载者
const isUploader = ref(false)

// 文件信息相关
const loading = ref(false)
const error = ref('')
const fileInfo = ref(null)
const downloading = ref(false)
const fileType = ref('file')
const remainingSeconds = ref(0)
let countdownTimer = null

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化剩余时间（倒计时）
const formatRemainingTime = (seconds) => {
  if (seconds <= 0) return t('timeUnits.expired')

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const parts = []
  if (days > 0) parts.push(`${days}${t('timeUnits.day')}`)
  if (hours > 0) parts.push(`${hours}${t('timeUnits.hour')}`)
  if (minutes > 0) parts.push(`${minutes}${t('timeUnits.minute')}`)
  if (secs > 0 || parts.length === 0) parts.push(`${secs}${t('timeUnits.second')}`)

  return parts.join('')
}

// 格式化日期
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取文件信息
const fetchFileInfo = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await fileApi.getFileInfo(code)

    // 保存文件类型
    fileType.value = data.type || 'file'

    // 格式化文件信息
    if (fileType.value === 'folder') {
      // 文件夹信息
      fileInfo.value = {
        name: data.folderName || data.filename,
        size: formatFileSize(data.totalSize || 0),
        lastModified: formatDate(data.lastModified),
        downloadUrl: data.downloadUrl,
        totalFiles: data.totalFiles,
        type: 'folder',
        expires: formatRemainingTime(data.remainingExpireSeconds || 0)
      }
    } else {
      // 文件信息
      fileInfo.value = {
        name: data.filename,
        size: formatFileSize(data.size),
        lastModified: formatDate(data.lastModified),
        downloadUrl: data.downloadUrl,
        type: 'file',
        expires: formatRemainingTime(data.remainingExpireSeconds || 0)
      }
    }

    // 设置剩余时间并启动倒计时
    remainingSeconds.value = data.remainingExpireSeconds || 0
    startCountdown()
  } catch (err) {
    console.error('获取文件信息失败:', err)

    // 更详细的错误信息处理
    if (err.response) {
      // 服务器响应错误
      if (err.response.status === 404) {
        error.value = t('resultPage.fileNotExist')
      } else if (err.response.status === 400) {
        error.value = t('resultPage.codeFormatError')
      } else if (err.response.status === 500) {
        error.value = t('resultPage.serverError')
      } else {
        error.value = `${t('resultPage.serverError')} (${err.response.status}): ${err.response.data?.message || 'Unknown error'}`
      }
    } else if (err.request) {
      // 请求发送但无响应
      error.value = t('resultPage.networkError')
    } else {
      // 其他错误
      error.value = `${t('resultPage.getFileFailed')}: ${err.message || 'Unknown error'}`
    }
  } finally {
    loading.value = false
  }
}

// 下载文件
const downloadFile = async () => {
  // 文件夹直接用 URL 下载，让浏览器处理文件名
  if (fileType.value === 'folder') {
    window.open(`/api/upload/folder/download/${code}`, '_blank')
    return
  }

  // 文件用 blob 下载
  downloading.value = true

  try {
    const result = await fileApi.downloadFile(code)

    if (!result?.blob || !(result.blob instanceof Blob)) {
      throw new Error('Invalid response: not a blob')
    }

    const url = window.URL.createObjectURL(result.blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', result.filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (err) {
    console.error('下载失败:', err)
    error.value = t('resultPage.downloadFailed') + (err.message || 'Unknown error')
  } finally {
    downloading.value = false
  }
}

// 启动倒计时
const startCountdown = () => {
  stopCountdown()
  countdownTimer = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
      if (fileInfo.value) {
        fileInfo.value.expires = formatRemainingTime(remainingSeconds.value)
      }
    } else {
      stopCountdown()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// 返回首页
const goToHome = () => {
  router.push('/')
}

// 组件挂载时获取文件信息
onMounted(() => {
  fetchFileInfo()
})

// 组件卸载时清理倒计时
onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped>
/* 保持原有样式不变，添加错误相关样式 */

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
}

.error-container {
  text-align: center;
  padding: 20px;
}

.error-container h2 {
  color: #c00;
  margin-bottom: 15px;
}

.error-message {
  padding: 15px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 5px;
  color: #c00;
  margin-bottom: 20px;
  font-size: 0.95rem;
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
.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}
.title-area {
  text-align: center;
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
  margin-top: 20px;
  font-size: 0.9rem;
}

.copy-btn {
  background: #28a745;
  margin-top: 8px;
}

.copy-btn:hover {
  background: #218838;
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .card {
    padding: 20px;
  }

  .logo {
    font-size: 1.8rem;
  }

  .slogan {
    font-size: 0.9rem;
  }

  .loading {
    padding: 30px;
    font-size: 1rem;
  }

  .error-container {
    padding: 15px;
  }

  .error-container h2 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }

  .error-message {
    padding: 12px;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }

  .btn {
    padding: 14px 20px;
    font-size: 1rem;
  }

  .notice {
    padding: 12px;
    margin-top: 15px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .card {
    padding: 15px;
  }

  header {
    margin: 20px 0;
  }

  .logo {
    font-size: 1.6rem;
  }

  .slogan {
    font-size: 0.85rem;
  }

  .loading {
    padding: 25px;
    font-size: 0.95rem;
  }

  .error-container {
    padding: 12px;
  }

  .error-container h2 {
    font-size: 1.1rem;
  }

  .error-message {
    padding: 10px;
    margin-bottom: 12px;
    font-size: 0.85rem;
  }

  .btn {
    padding: 12px 18px;
    font-size: 0.95rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  .notice {
    padding: 10px;
    margin-top: 12px;
    font-size: 0.8rem;
  }
}
</style>