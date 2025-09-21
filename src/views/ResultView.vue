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
<!--        <h2>文件已准备就绪</h2>-->
        <FileCard :file="mockFileInfo" />
        <button class="btn btn-block" @click="downloadFile">立即下载</button>
        <button class="btn btn-block copy-btn" @click="resetUpload">上传新文件</button>
        <div class="notice">
          注意：下载后文件将自动删除
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import { useRoute } from 'vue-router'
import { useFileStore } from '../stores/fileStore'
import FileCard from "@/components/FileCard.vue";

const route = useRoute()
const fileStore = useFileStore()
const code = route.params.code

// 判断当前用户是上传者还是下载者
const isUploader = ref(false)// computed(() => code === fileStore.pickupCode)

// 模拟从后端获取的文件信息（实际开发需调用API）
const mockFileInfo = {
  name: '示例文件.pdf',
  size: '2.45 MB',
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
}

const downloadFile = () => {
  alert(`模拟下载文件（取件码: ${code}）\n实际开发需调用后端下载API`)
}
</script>

<style scoped>

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
.tab-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.tab {
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
}
.tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}
.tab-content {
  display: none;
}
.tab-content.active {
  display: block;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}
input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
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
footer {
  text-align: center;
  margin-top: 50px;
  color: #777;
  font-size: 0.9rem;
}
@media (max-width: 600px) {
  .logo {
    font-size: 2rem;
  }
  .card {
    padding: 20px;
  }
}

.copy-btn {
  background: #28a745;
  margin-top: 8px;
}

.copy-btn:hover {
  background: #218838;
}
</style>