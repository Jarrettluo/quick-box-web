<template>
  <div class="tab-content">
    <FileUploader
        v-if="!isUploaded"
        @file-selected="handleFileSelected"
        @upload="handleUpload"
        @remove-file="removeFile"
        :selectedFiles="selectedFiles"
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

    <!-- 分享下载链接弹窗 -->
    <ShareModal
        :isVisible="showShareModal"
        :link="downloadLink"
        @close="showShareModal = false"
        @link-copied="showShareModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFileStore } from '../stores/fileStore.js'
import { FileUploadService } from '@/api/index.js'
import message from '@/utils/message.js'
import { copyDownloadLink, copyPickupCode } from '@/utils/clipboard.js'
import FileUploader from './FileUploader.vue'
import UploadResult from './UploadResult.vue'
import FileCard from './FileCard.vue'
import HistoryView from '@/views/HistoryView.vue'
import ShareModal from './ShareModal.vue'

const fileStore = useFileStore()
const selectedFiles = ref([])
const isUploaded = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const currentChunk = ref(0)
const totalChunks = ref(0)
const uploadError = ref('')
const showShareModal = ref(false)

const downloadLink = computed(() => {
  if (!fileStore.pickupCode) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/result/${fileStore.pickupCode}`
})

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

const handleFileSelected = (files) => {
  selectedFiles.value = files
  uploadError.value = ''
}

const removeFile = () => {
  selectedFiles.value = []
}

const handleUpload = async () => {
  if (!selectedFiles.value || selectedFiles.value.length === 0) return

  isUploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0
  currentChunk.value = 0
  totalChunks.value = selectedFiles.value.length

  try {
    const totalFiles = selectedFiles.value.length
    let uploadedFiles = 0
    let lastFileCode = null
    let lastFileInfo = null

    for (const file of selectedFiles.value) {
      try {
        // 使用分片上传服务上传单个文件
        const fileCode = await uploadService.uploadFile(file, {
          onProgress: (percent) => {
            // 计算总体进度：已上传文件的进度 + 当前文件进度
            const overallProgress = Math.round((uploadedFiles * 100 + percent) / totalFiles)
            uploadProgress.value = overallProgress
          },
          onChunkUploaded: (chunkIndex) => {
            currentChunk.value = chunkIndex
          },
          onError: (error) => {
            uploadError.value = error.message || '上传失败'
          }
        })

        uploadedFiles++
        currentChunk.value = uploadedFiles
        lastFileCode = fileCode
        lastFileInfo = {
          name: file.name,
          size: file.size,
          fileCode
        }

        // 保存到历史记录（每个文件单独保存）
        await fileStore.setUploadResult(fileCode, {
          name: file.name,
          size: file.size
        })

      } catch (error) {
        console.error('Upload failed for file:', file.name, error)
        uploadError.value = `文件 "${file.name}" 上传失败: ${error.message || '请重试'}`
        // 继续上传其他文件
        continue
      }
    }

    if (lastFileCode) {
      // 设置最后一个成功上传文件的取件码和信息
      fileStore.pickupCode = lastFileCode
      fileStore.fileInfo = {
        name: selectedFiles.value.length > 1 ? `${selectedFiles.value.length} 个文件` : lastFileInfo.name,
        size: formatFileSize(selectedFiles.value.reduce((total, file) => total + file.size, 0)),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }
    }

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

const copyLink = () => {
  if (fileStore.pickupCode) {
    showShareModal.value = true
  } else {
    message.error("请先生成取件码")
  }
}

const resetUpload = () => {
  isUploaded.value = false
  isUploading.value = false
  selectedFiles.value = []
  uploadProgress.value = 0
  currentChunk.value = 0
  totalChunks.value = 0
  uploadError.value = ''
  fileStore.clearUploadResult()
}
</script>

<style scoped>
.tab-content {
  display: block;
}
</style>