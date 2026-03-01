<template>
  <div class="result-container">
    <div class="success-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
    <h3>取件码已生成</h3>
    <p class="success-message">文件上传成功！请保存以下取件码</p>
    <div
        class="code-display"
        @click="$emit('copy-code')"
        title="点击复制"
    >
      {{ pickupCode }}
    </div>
    <p class="expiry-info">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           style="vertical-align: middle; margin-right: 6px;">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
      有效期至: {{ fileInfo.expires }}
    </p>
    <div class="action-buttons">
      <button class="btn btn-action copy-btn" @click="$emit('copy-code')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="margin-right: 8px;">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        复制取件码
      </button>
      <button class="btn btn-action share-btn" @click="$emit('copy-link')">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             style="margin-right: 8px;">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
          <polyline points="16 6 12 2 8 6"></polyline>
          <line x1="12" y1="2" x2="12" y2="15"></line>
        </svg>
        分享下载链接
      </button>
    </div>
    <button class="btn btn-block new-upload-btn" @click="$emit('new-upload')">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           style="margin-right: 8px;">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
      上传新文件
    </button>
  </div>
</template>

<script setup>
defineProps({
  fileInfo: Object,
  pickupCode: String
})

defineEmits(['copy-code', 'copy-link', 'new-upload'])
</script>

<style scoped>
/* 定义CSS变量以确保组件样式正常工作 */
.result-container {
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

/* 上传结果区域 */
.result-container {
  text-align: center;
  padding: 30px 20px;
  background: var(--gray-light);
  border-radius: 12px;
  margin-top: 20px;
}

.success-icon {
  margin-bottom: 20px;
}

.success-icon svg {
  color: var(--success);
}

.success-message {
  color: var(--gray);
  margin-bottom: 20px;
  font-size: 1rem;
}

.code-display {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--primary);
  margin: 20px 0;
  padding: 20px;
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
  border: 2px solid transparent;
}

.code-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-light);
}

.code-display:active {
  transform: translateY(0);
}

.expiry-info {
  color: var(--gray);
  margin-bottom: 25px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

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

.btn-action {
  flex: 1;
  padding: 12px;
  font-size: 0.95rem;
}

.copy-btn {
  background: var(--success);
}

.copy-btn:hover {
  background: #218838;
}

.share-btn {
  background: var(--primary);
}

.share-btn:hover {
  background: var(--primary-dark);
}

.new-upload-btn {
  background: var(--light);
  color: var(--primary);
  border: 2px solid var(--primary);
}

.new-upload-btn:hover {
  background: var(--primary);
  color: var(--light);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .result-container {
    padding: 25px 16px;
  }

  .success-icon svg {
    width: 40px;
    height: 40px;
  }

  .success-message {
    font-size: 0.95rem;
    margin-bottom: 18px;
  }

  .code-display {
    font-size: 1.8rem;
    padding: 15px;
    letter-spacing: 2px;
    margin: 18px 0;
  }

  .expiry-info {
    font-size: 0.9rem;
    margin-bottom: 22px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .btn-action {
    width: 100%;
    padding: 14px;
    font-size: 0.95rem;
  }

  .new-upload-btn {
    padding: 14px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .result-container {
    padding: 20px 14px;
  }

  .success-icon svg {
    width: 36px;
    height: 36px;
  }

  h3 {
    font-size: 1.2rem;
  }

  .success-message {
    font-size: 0.9rem;
    margin-bottom: 16px;
  }

  .code-display {
    font-size: 1.6rem;
    padding: 12px;
    letter-spacing: 1px;
  }

  .expiry-info {
    font-size: 0.85rem;
    margin-bottom: 20px;
  }

  .btn-action {
    padding: 12px;
    font-size: 0.9rem;
  }

  .new-upload-btn {
    padding: 12px;
    font-size: 0.9rem;
  }
}
</style>