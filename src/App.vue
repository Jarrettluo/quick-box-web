<template>
  <div id="app">
    <router-view></router-view>
    <div id="notifications"></div>
  </div>
</template>

<script setup>
// import { onMounted } from 'vue'
import { useFileStore } from './stores/fileStore'

const fileStore = useFileStore()
// onMounted(() => {
//   fileStore.$reset()
// })
</script>

<style>
body, html {
  height: 100%;
  margin: 0;
}
#app {
  --primary: #4a6bdf;
  --secondary: #f8f9fa;
  --danger: #e74c3c;
  --text: #333;
  --light: #fff;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: var(--secondary);
  color: var(--text);
  line-height: 1.6;
  min-height: 100vh;
}

@media (max-width: 768px) {
  #app {
    padding: 0 10px;
  }
}
</style>