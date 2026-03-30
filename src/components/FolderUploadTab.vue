<template>
  <div class="tab-content">
    <FolderUploader
        v-if="!isUploaded"
        @folder-selected="handleFolderSelected"
        @upload="handleUpload"
        @remove-folder="removeFolder"
        :selectedFolder="selectedFolder"
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
import ShareModal from './ShareModal.vue'
import { useFileStore } from '../stores/fileStore.js'
import { FolderUploadService } from '@/api/fileService.js'
import message from '@/utils/message.js'
import { copyDownloadLink, copyPickupCode } from '@/utils/clipboard.js'
import FolderUploader from './FolderUploader.vue'
import UploadResult from './UploadResult.vue'
import FileCard from './FileCard.vue'
import HistoryView from '@/views/HistoryView.vue'

const fileStore = useFileStore()
const selectedFolder = ref(null)
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

// 创建文件夹上传服务实例
const folderUploadService = new FolderUploadService({
  chunkSize: 5 * 1024 * 1024, // 5MB
  concurrentUploads: 3,
  maxRetries: 3
})

// 计算属性
const selectedFolderName = computed(() => {
  if (!selectedFolder.value || selectedFolder.value.length === 0) return ''
  // 尝试从第一个文件中获取文件夹路径
  const firstFile = selectedFolder.value[0]
  if (firstFile.webkitRelativePath) {
    const parts = firstFile.webkitRelativePath.split('/')
    if (parts.length > 1) {
      return parts[0] // 返回顶层文件夹名
    }
  }
  return '文件夹'
})

const folderFileCount = computed(() => {
  return selectedFolder.value ? selectedFolder.value.length : 0
})

const folderTotalSize = computed(() => {
  if (!selectedFolder.value) return 0
  return Array.from(selectedFolder.value).reduce((total, file) => total + file.size, 0)
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleFolderSelected = (files) => {
  selectedFolder.value = files
  uploadError.value = ''
  console.log('Selected folder:', files, 'file count:', files.length)
}

const removeFolder = () => {
  selectedFolder.value = null
}

const handleUpload = async () => {
  if (!selectedFolder.value || selectedFolder.value.length === 0) return

  isUploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0
  currentChunk.value = 0
  totalChunks.value = 0

  try {
    // 使用文件夹上传服务
    const folderName = selectedFolderName.value || 'untitled_folder'
    const result = await folderUploadService.uploadFolder(selectedFolder.value, folderName, {
      onProgress: (progressInfo) => {
        uploadProgress.value = progressInfo.overallProgress
        currentChunk.value = progressInfo.uploadedFiles
        totalChunks.value = progressInfo.totalFiles
      },
      onFileProgress: (fileProgress) => {
        console.log('File progress:', fileProgress)
      },
      onError: (error) => {
        uploadError.value = error.message || '上传失败'
      }
    })

    // 上传成功，设置取件码和文件信息
    fileStore.pickupCode = result.accessCode || result.fileCode
    fileStore.fileInfo = {
      name: folderName,
      size: formatFileSize(folderTotalSize.value),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }

    // 保存到历史记录
    await fileStore.setUploadResult(fileStore.pickupCode, {
      name: folderName,
      size: folderTotalSize.value
    })

    isUploaded.value = true

  } catch (error) {
    console.error('Folder upload failed:', error)
    uploadError.value = error.message || '文件夹上传失败，请重试'
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
  selectedFolder.value = null
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