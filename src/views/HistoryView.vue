<template>
  <div class="history-container">
    <div class="history-header">
      <h4 class="history-title">上传历史记录</h4>
      <button
          class="btn btn-danger btn-small"
          @click="clearHistory"
          :disabled="fileStore.history.length === 0"
      >
        清空历史
      </button>
    </div>

    <div v-if="loading" class="loading">
      加载中...
    </div>

    <div v-else-if="fileStore.history.length === 0" class="empty-state">
      <div class="empty-icon">📁</div>
      <h4>暂无上传记录</h4>
      <p>您上传的文件将显示在这里</p>
    </div>

    <div v-else class="history-list">
      <div class="history-item" v-for="item in fileStore.history" :key="item.code">
        <div class="file-info">
          <div class="file-name">{{ item.filename }}</div>
          <div class="file-meta">
            <span class="file-size">{{ formatFileSize(item.size) }}</span>
            <span class="upload-time">{{ formatDate(item.uploadTime) }}</span>
            <span class="expires" :class="{ 'expiring': isExpiring(item.expiresAt) }">
              有效期至: {{ formatDate(item.expiresAt) }}
            </span>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-small copy-btn" @click="copyCode(item.code)">
            {{ copiedCode === item.code ? '已复制' : '复制取件码' }}
          </button>
          <button
              class="btn btn-small btn-danger"
              @click="deleteRecord(item.code)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFileStore } from '@/stores/fileStore'
import message from '@/utils/message.js'
import {copyPickupCode} from "@/utils/clipboard.js";

const router = useRouter()
const fileStore = useFileStore()
const loading = ref(false)
const copiedCode = ref('')

// 加载历史记录
const loadHistory = async () => {
  loading.value = true
  await fileStore.loadHistory()
  loading.value = false
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 检查是否即将过期（3天内）
const isExpiring = (expiresAt) => {
  const expires = new Date(expiresAt)
  const now = new Date()
  const threeDays = 3 * 24 * 60 * 60 * 1000
  return expires - now < threeDays
}

// 复制取件码
const copyCode1 = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    copiedCode.value = code
    message.success('取件码已复制到剪贴板')

    // 3秒后重置复制状态
    setTimeout(() => {
      copiedCode.value = ''
    }, 3000)
  } catch (err) {
    console.error('复制失败:', err)
    message.error('复制失败，请手动复制')
  }
}

const copyCode = async (code) => {
  if (code) {
    const success = await copyPickupCode(
        code,
        (code) => {
          message.success(`取件码 ${code} 已复制到剪贴板`)
        },
        () => {
          message.error('复制取件码失败，请手动复制')
        }
    )

    if (!success) {
      // 如果复制失败，显示取件码让用户手动复制
      message.info(`取件码：${code}`)
    }
  } else {
    message.error("没有可复制的取件码")
  }
}


// 删除记录
const deleteRecord = async (code) => {
  if (confirm('确定要删除这条记录吗？')) {
    const success = await fileStore.deleteHistoryRecord(code)
    if (success) {
      message.success('记录已删除')
    } else {
      message.error('删除失败')
    }
  }
}

// 清空历史
const clearHistory = async () => {
  if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
    const success = await fileStore.clearHistory()
    if (success) {
      message.success('历史记录已清空')
    } else {
      message.error('清空失败')
    }
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-container {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.history-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.btn-danger {
  background: #e74c3c;
  border: none;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-danger:disabled {
  background: #e0a7a0;
  cursor: not-allowed;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 4px;
}

.copy-btn {
  background: #28a745;
  border: none;
  color: white;
}

.copy-btn:hover {
  background: #218838;
}

.empty-state {
  text-align: center;
  padding: 30px 20px;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.empty-state h4 {
  margin-bottom: 8px;
  color: #666;
  font-size: 1.1rem;
}

.empty-state p {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: #4a6bdf;
  box-shadow: 0 2px 8px rgba(74, 107, 223, 0.1);
}

.file-info {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.file-name {
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.95rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 0.8rem;
  color: #666;
}

.file-size,
.upload-time,
.expires {
  display: inline-block;
}

.expires {
  color: #28a745;
  font-weight: 500;
}

.expires.expiring {
  color: #e74c3c;
}

.actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.loading {
  text-align: center;
  padding: 30px;
  color: #666;
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .history-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .file-name {
    white-space: normal;
    word-break: break-word;
  }

  .file-meta {
    flex-direction: column;
    gap: 4px;
  }

  .actions {
    align-self: flex-end;
  }
  .history-container {
    padding: 10px;
  }
}
</style>