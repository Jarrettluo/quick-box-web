<template>
  <div class="upload-progress-container">
    <div class="progress-header">
      <span class="progress-title">上传进度</span>
      <span class="progress-percent">{{ uploadProgress }}%</span>
    </div>

    <!-- 自定义进度条 -->
    <div class="custom-progress-bar">
      <div
          class="custom-progress-fill"
          :style="{ width: uploadProgress + '%' }"
      ></div>
    </div>

    <!-- 分片信息 -->
    <div v-if="currentChunk > 0" class="chunk-info-container">
      <div class="chunk-stats">
        <span class="chunk-label">分片进度</span>
        <span class="chunk-value">{{ currentChunk }}/{{ totalChunks }}</span>
      </div>
      <div class="chunk-progress-bar">
        <div
            class="chunk-progress-fill"
            :style="{ width: (currentChunk / totalChunks * 100) + '%' }"
        ></div>
      </div>
    </div>

    <!-- 上传状态 -->
    <div class="upload-status">
      <div class="status-dot" :class="{ 'active': isUploading }"></div>
      <span class="status-text">
        {{ isUploading ? '正在上传...' : '准备上传' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  uploadProgress: Number,
  currentChunk: Number,
  totalChunks: Number
})

const isUploading = computed(() => props.uploadProgress > 0 && props.uploadProgress < 100)
</script>

<style scoped>
/* 上传进度区域 */
.upload-progress-container {
  background: var(--gray-light);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid var(--border);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.progress-title {
  font-weight: 600;
  color: var(--gray-dark);
  font-size: 1rem;
}

.progress-percent {
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
}

/* 自定义进度条 */
.custom-progress-bar {
  height: 10px;
  background: var(--border);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
}

.custom-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-light), var(--primary));
  border-radius: 5px;
  transition: width 0.3s ease;
}

/* 分片信息 */
.chunk-info-container {
  background: var(--light);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 15px;
}

.chunk-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chunk-label {
  font-size: 0.9rem;
  color: var(--gray);
}

.chunk-value {
  font-weight: 600;
  color: var(--primary);
  font-size: 0.9rem;
}

.chunk-progress-bar {
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.chunk-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a6bdf, #6a8bff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 上传状态 */
.upload-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--gray);
  transition: all 0.3s ease;
}

.status-dot.active {
  background: var(--success);
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
  animation: pulse 1.5s infinite;
}

.status-text {
  font-size: 0.9rem;
  color: var(--gray-dark);
}

/* 动画定义 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(40, 167, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .upload-progress-container {
    padding: 15px;
  }

  .progress-title {
    font-size: 0.95rem;
  }

  .progress-percent {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .upload-progress-container {
    padding: 12px;
  }

  .chunk-info-container {
    padding: 10px 12px;
  }

  .chunk-label,
  .chunk-value {
    font-size: 0.85rem;
  }

  .status-text {
    font-size: 0.85rem;
  }
}
</style>