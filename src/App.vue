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

@media (max-width: 768px) {
  #app {
    padding: 0 10px;
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