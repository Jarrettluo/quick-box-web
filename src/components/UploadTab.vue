<template>
  <div class="tab-content">
    <FileUploader
        v-if="!isUploaded"
        @file-selected="handleFileSelected"
        @upload="handleUpload"
        @remove-file="removeFile"
        :selectedFile="selectedFile"
        :isUploading="isUploading"
        :uploadProgress="uploadProgress"
        :currentChunk="currentChunk"
        :totalChunks="totalChunks"
        :uploadError="uploadError"
    />

    <!-- 上传结果区域 -->
    <UploadResult
        v-if="isUploaded && fileStore.fileInfo && fileStore.pickupCode"
        :fileInfo="fileStore.fileInfo"
        :pickupCode="fileStore.pickupCode"
        @copy-code="copyCode"
        @copy-link="copyLink"
        @new-upload="resetUpload"
    />

    <FileCard v-if="isUploaded && fileStore.fileInfo" :file="fileStore.fileInfo" />
    <HistoryView />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFileStore } from '../stores/fileStore.js'
import { FileUploadService } from '@/api/index.js'
import message from '@/utils/message.js'
import { copyDownloadLink, copyPickupCode } from '@/utils/clipboard.js'
import FileUploader from './FileUploader.vue'
import UploadResult from './UploadResult.vue'
import FileCard from './FileCard.vue'
import HistoryView from '@/views/HistoryView.vue'

const fileStore = useFileStore()
const selectedFile = ref(null)
const isUploaded = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const currentChunk = ref(0)
const totalChunks = ref(0)
const uploadError = ref('')

// 创建文件上传服务实例
const uploadService = new FileUploadService({
  chunkSize: 5 * 1024 * 1024, // 5MB
  concurrentUploads: 3,
  maxRetries: 3
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFileSelected = (file) => {
  selectedFile.value = file
  uploadError.value = ''
}

const removeFile = () => {
  selectedFile.value = null
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

const copyCode = async () => {
  if (fileStore.pickupCode) {
    const success = await copyPickupCode(
        fileStore.pickupCode,
        (code) => {
          message.success(`取件码 ${code} 已复制到剪贴板`)
        },
        () => {
          message.error('复制取件码失败，请手动复制')
        }
    )

    if (!success) {
      message.info(`取件码：${fileStore.pickupCode}`)
    }
  } else {
    message.error("没有可复制的取件码")
  }
}

const copyLink = async () => {
  if (fileStore.pickupCode) {
    const success = await copyDownloadLink(
        fileStore.pickupCode,
        (link) => {
          message.success('下载链接已复制到剪贴板')
          console.log('复制的链接:', link)
        },
        () => {
          message.error('复制链接失败，请手动复制')
        }
    )

    if (!success) {
      const baseUrl = window.location.origin
      const downloadLink = `${baseUrl}/result/${fileStore.pickupCode}`
      message.info(`下载链接：${downloadLink}`)
    }
  } else {
    message.error("请先生成取件码")
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
  fileStore.reset()
}
</script>

<style scoped>
.tab-content {
  display: block;
}
</style>