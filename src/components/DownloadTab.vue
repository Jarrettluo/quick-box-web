<template>
  <div class="tab-content">
    <form @submit.prevent="handleDownload">
      <div class="form-group">
        <label for="code">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               style="vertical-align: middle; margin-right: 8px;">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          输入6位取件码
        </label>

        <!-- 改进的取件码输入区域 -->
        <div class="code-input-container">
          <input
              type="text"
              id="code"
              v-model="downloadCode"
              placeholder="例如: 3A7B9C"
              required
              maxlength="6"
              class="code-input-enhanced"
              :class="{ 'has-value': downloadCode.length > 0 }"
          >
          <div class="code-input-hint">
            <span v-if="downloadCode.length === 0">请输入6位字母数字组合</span>
            <span v-else class="code-length-indicator">
              已输入 {{ downloadCode.length }}/6 位
            </span>
          </div>
        </div>
      </div>

      <div class="notice download-notice">
        <div class="notice-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
               style="vertical-align: middle; margin-right: 8px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <strong>重要提示</strong>
        </div>
        <div class="notice-content">
          <p> 每个取件码仅能使用一次，文件下载后立即失效</p>
          <p> 取件码区分大小写，请准确输入</p>
          <p> 文件最长保留7天，过期自动删除</p>
        </div>
      </div>

      <button
          type="submit"
          class="btn btn-block download-btn"
          :disabled="!downloadCode || downloadCode.length !== 6"
          :class="{ 'disabled': !downloadCode || downloadCode.length !== 6 }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="margin-right: 10px;">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        提取文件
      </button>
    </form>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()
const downloadCode = ref('')

const handleDownload = () => {
  if (!downloadCode.value) return
  router.push({
    path: `/result/${downloadCode.value}`,
    query: {isUploader: true}
  })
}
</script>

<style scoped>
.tab-content {
  /* 定义CSS变量以确保组件样式正常工作 */
  --primary: #4a6bdf;
  --primary-light: #6a8bff;
  --primary-dark: #3a56c4;
  --light: #fff;
  --gray-light: #f5f7fa;
  --gray: #6c757d;
  --gray-dark: #495057;
  --border: #dee2e6;
  --success: #28a745;
  --danger: #e74c3c;
  --warning: #ffc107;
}

.tab-content {
  display: block;
}

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

/* 取件码输入容器 */
.code-input-container {
  margin-bottom: 20px;
}

/* 增强的取件码输入框 */
.code-input-enhanced {
  width: 100%;
  padding: 18px 20px;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
  background: var(--light);
  color: var(--gray-dark);
  margin-bottom: 8px;
}

.code-input-enhanced:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 107, 223, 0.2);
  transform: translateY(-1px);
}

.code-input-enhanced.has-value {
  border-color: var(--primary-light);
  background: rgba(74, 107, 223, 0.05);
  color: var(--primary);
}

.code-input-enhanced::placeholder {
  color: var(--gray);
  font-weight: normal;
  letter-spacing: normal;
  text-transform: none;
  font-size: 1.1rem;
}

/* 输入提示 */
.code-input-hint {
  text-align: center;
  font-size: 0.9rem;
  color: var(--gray);
  margin-top: 5px;
  min-height: 20px;
}

.code-length-indicator {
  color: var(--primary);
  font-weight: 500;
}

/* 下载通知区域 */
.download-notice {
  background: #fff8e1;
  border-left: 4px solid var(--warning);
  padding: 20px;
  margin: 25px 0;
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.notice-header svg {
  color: var(--warning);
}

.notice-header strong {
  color: var(--warning);
  font-size: 1rem;
}

.notice-content {
  font-size: 0.9rem;
  color: var(--gray-dark);
  line-height: 1.6;
}

.notice-content p {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.notice-content p:before {
  content: "•";
  color: var(--warning);
  font-weight: bold;
  margin-right: 8px;
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

/* 下载按钮 */
.download-btn {
  background: var(--success);
  padding: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 10px;
}

.download-btn:hover:not(.disabled) {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.download-btn.disabled {
  background: var(--gray);
  cursor: not-allowed;
  opacity: 0.6;
}

.download-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .code-input-enhanced {
    font-size: 1.2rem;
    padding: 16px;
    letter-spacing: 3px;
  }

  .download-btn {
    padding: 14px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .code-input-enhanced {
    font-size: 1.1rem;
    padding: 14px;
    letter-spacing: 2px;
  }

  .download-btn {
    padding: 12px;
    font-size: 0.95rem;
  }
}
</style>