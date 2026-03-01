<template>
  <div class="container">
    <header>
      <h1 class="logo">快取柜</h1>
      <p class="slogan">QuickBox · 临时文件共享服务</p>
    </header>

    <div class="card">
      <template v-if="isUploader">
        <h2>上传成功！</h2>
        <p>您的取件码：<strong>{{ code }}</strong></p>
        <FileCard :file="fileStore.fileInfo" />
        <div class="notice">
          提示：此取件码7天内有效，文件被下载后自动删除
        </div>
      </template>

      <template v-else>
        <div v-if="loading" class="loading">
          正在加载文件信息...
        </div>
        <div v-else-if="error" class="error-container">
          <h2>获取文件信息失败</h2>
          <div class="error-message">
            {{ error }}
          </div>
          <button class="btn btn-block copy-btn" @click="goToHome">上传新文件</button>
          <div class="notice">
            提示：请检查取件码是否正确，或文件可能已被删除
          </div>
        </div>
        <div v-else>
          <h2>文件已准备就绪</h2>
          <FileCard v-if="fileInfo"  :file="fileInfo" />
          <button class="btn btn-block" @click="downloadFile" :disabled="downloading">
            {{ downloading ? '下载中...' : '立即下载' }}
          </button>
          <button class="btn btn-block copy-btn" @click="goToHome">上传新文件</button>
          <div class="notice">
            注意：下载后文件将自动删除
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFileStore } from '../stores/fileStore'
import FileCard from "@/components/FileCard.vue"
import { fileApi } from '@/api/fileService'
import message from "@/utils/message.js";

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

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

    // 格式化文件信息
    fileInfo.value = {
      name: data.filename,
      size: formatFileSize(data.size),
      lastModified: formatDate(data.lastModified),
      downloadUrl: data.downloadUrl
    }
  } catch (err) {
    console.error('获取文件信息失败:', err)

    // 更详细的错误信息处理
    if (err.response) {
      // 服务器响应错误
      if (err.response.status === 404) {
        error.value = '文件不存在或已被删除'
      } else if (err.response.status === 400) {
        error.value = '取件码格式错误'
      } else if (err.response.status === 500) {
        error.value = '服务器内部错误，请稍后重试'
      } else {
        error.value = `服务器错误 (${err.response.status}): ${err.response.data?.message || '未知错误'}`
      }
    } else if (err.request) {
      // 请求发送但无响应
      error.value = '网络连接失败，请检查网络连接'
    } else {
      // 其他错误
      error.value = `获取文件信息失败: ${err.message || '未知错误'}`
    }
  } finally {
    loading.value = false
  }
}

// 下载文件
const downloadFile = async () => {
  downloading.value = true

  try {
    const result = await fileApi.downloadFile(code)

    // 创建下载链接
    const url = window.URL.createObjectURL(result.blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', result.filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    // 下载完成后可以跳转回首页
    setTimeout(() => {
      router.push('/')
    }, 1000)

  } catch (err) {
    error.value = '下载文件失败：' + (err.response?.data?.message || err.message || '未知错误')
  } finally {
    downloading.value = false
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

@media (max-width: 600px) {
  .logo {
    font-size: 2rem;
  }
  .card {
    padding: 20px;
  }
}
</style>