<template>
  <div class="container">
    <header>
      <h1 class="logo">快取柜</h1>
      <p class="slogan">QuickBox · 临时文件共享服务</p>
    </header>

    <div class="card">
      <div class="tab-container">
        <button
            class="tab"
            :class="{ active: activeTab === 'folder-upload' }"
            @click="switchTab('folder-upload')"
        >
          上传文件夹
        </button>
        <button
            class="tab"
            :class="{ active: activeTab === 'upload' }"
            @click="switchTab('upload')"
        >
          上传文件
        </button>
        <button
            class="tab"
            :class="{ active: activeTab === 'download' }"
            @click="switchTab('download')"
        >
          提取文件
        </button>
      </div>

      <!-- 上传文件夹区域 -->
      <FolderUploadTab v-if="activeTab === 'folder-upload'"/>

      <!-- 上传文件区域 -->
      <UploadTab v-if="activeTab === 'upload'"/>

      <!-- 提取文件区域 -->
      <DownloadTab v-if="activeTab === 'download'"/>
    </div>

    <!-- 使用弹窗组件 -->
    <Modal
        :isVisible="showModal"
        title="分享链接"
        @close="showModal = false"
        @confirm="handleConfirm"
    >
      <ModalContent/>
    </Modal>

    <footer>
      <p>© 2025 快取柜 QuickBox | 文件最长保留7天 | 完全匿名</p>
    </footer>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import UploadTab from '../components/UploadTab.vue'
import FolderUploadTab from '../components/FolderUploadTab.vue'
import DownloadTab from '../components/DownloadTab.vue'
import Modal from '../components/Modal.vue'
import ModalContent from '../components/ModalContent.vue'

const activeTab = ref('upload')
const showModal = ref(false)

const switchTab = (tab) => {
  console.log('Switching to tab:', tab)
  activeTab.value = tab
}

const handleConfirm = () => {
  alert('确认按钮被点击！')
  showModal.value = false
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
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
  color: var(--gray);
  font-size: 1.1rem;
}

.card {
  background: var(--light);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid var(--border);
}

.tab-container {
  display: flex;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border);
  gap: 10px;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  background: none;
  border: none;
  outline: none;
  color: var(--gray);
  font-size: 1rem;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  position: relative;
}

.tab:hover {
  color: var(--primary);
}

.tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
  font-weight: 600;
}

footer {
  text-align: center;
  margin-top: 50px;
  color: var(--gray);
  font-size: 0.9rem;
  padding: 20px 0;
  border-top: 1px solid var(--border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .card {
    padding: 20px;
  }

  .logo {
    font-size: 2rem;
  }

  .tab {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
    margin: 0 -15px;
  }

  .card {
    padding: 15px;
  }

  .tab-container {
    flex-direction: column;
    gap: 5px;
  }

  .tab {
    width: 100%;
    text-align: center;
  }
}
</style>