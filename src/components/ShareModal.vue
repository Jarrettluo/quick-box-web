<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeOnOverlay && close()">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>分享下载链接</h3>
        <button class="modal-close" @click="close">&times;</button>
      </div>
      <div class="modal-content">
        <div class="qr-code-container">
          <canvas ref="qrCanvas"></canvas>
        </div>
        <p class="link-label">下载链接</p>
        <div class="link-box" @click="copyLink">
          <span class="link-text">{{ link }}</span>
          <span class="copy-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </span>
        </div>
        <p class="copy-hint">{{ linkCopiedText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import QRCode from 'qrcode'

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'link-copied'])

const qrCanvas = ref(null)
const linkCopiedText = ref('')

const close = () => {
  emit('close')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(props.link)
    linkCopiedText.value = '链接已复制'
    emit('link-copied')
    setTimeout(() => {
      linkCopiedText.value = ''
    }, 2000)
  } catch (err) {
    linkCopiedText.value = '复制失败，请手动复制'
  }
}

const generateQRCode = async () => {
  if (!qrCanvas.value || !props.link) return

  try {
    await QRCode.toCanvas(qrCanvas.value, props.link, {
      width: 200,
      margin: 2,
      color: {
        dark: '#4a6bdf',
        light: '#ffffff'
      }
    })
  } catch (err) {
    console.error('生成二维码失败:', err)
  }
}

watch(() => props.isVisible, async (newVal) => {
  if (newVal) {
    linkCopiedText.value = ''
    await nextTick()
    generateQRCode()
  }
})

watch(() => props.link, async () => {
  if (props.isVisible) {
    await nextTick()
    generateQRCode()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 340px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.modal-close:hover {
  color: #666;
  background: #f5f5f5;
}

.modal-content {
  padding: 24px 20px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-code-container {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(74, 107, 223, 0.15);
  margin-bottom: 20px;
}

.qr-code-container canvas {
  display: block;
}

.link-label {
  font-size: 0.85rem;
  color: #888;
  margin: 0 0 10px;
  align-self: flex-start;
}

.link-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f5f7fa;
  border: 1px solid #e8eaed;
  border-radius: 8px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.link-box:hover {
  background: #eef1f5;
  border-color: #d0d5dd;
}

.link-text {
  font-size: 0.8rem;
  color: #333;
  word-break: break-all;
  flex: 1;
  margin-right: 10px;
  line-height: 1.4;
}

.copy-icon {
  flex-shrink: 0;
  color: #4a6bdf;
  display: flex;
  align-items: center;
}

.copy-hint {
  font-size: 0.85rem;
  color: #4a6bdf;
  margin: 16px 0 0;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
    align-items: flex-end;
  }

  .modal-container {
    max-width: none;
    border-radius: 16px 16px 0 0;
    max-height: 85vh;
  }

  .modal-header {
    padding: 16px 18px;
  }

  .modal-header h3 {
    font-size: 1rem;
  }

  .modal-content {
    padding: 20px 18px 28px;
  }

  .qr-code-container {
    padding: 10px;
  }

  .link-box {
    padding: 10px 12px;
  }

  .link-text {
    font-size: 0.75rem;
  }
}
</style>
