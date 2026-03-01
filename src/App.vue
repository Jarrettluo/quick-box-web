<template>
  <div id="app">
    <router-view></router-view>
    <div id="notifications"></div>
  </div>
</template>

<script setup>
// import { onMounted } from 'vue'
import {useFileStore} from './stores/fileStore'

const fileStore = useFileStore()
// onMounted(() => {
//   fileStore.$reset()
// })
</script>

<style>
/* Add these CSS variables to App.vue */
:root {
  --primary: #4a6bdf;
  --primary-light: #6a8bff;
  --primary-dark: #3a56c4;
  --secondary: #f8f9fa;
  --danger: #e74c3c;
  --success: #28a745;
  --warning: #ffc107;
  --text: #333;
  --light: #fff;
  --gray-light: #f5f7fa;
  --gray: #6c757d;
  --gray-dark: #495057;
  --border: #dee2e6;
}

body, html {
  height: 100%;
  margin: 0;
}

#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: var(--secondary);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* 移动端优化 */
@media (max-width: 768px) {
  #app {
    padding: 0 8px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  #app {
    padding: 0 6px;
  }

  /* 优化点击区域，提高可点击性 */
  button,
  .tab,
  .file-input-label,
  .file-remove-btn {
    min-height: 44px;
    touch-action: manipulation;
  }

  /* 防止输入框在焦点时缩放 */
  input[type="text"],
  input[type="file"],
  .code-input-enhanced {
    font-size: 16px !important;
  }
}

/* Add these animations */
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
  to {
    transform: rotate(360deg);
  }
}
</style>