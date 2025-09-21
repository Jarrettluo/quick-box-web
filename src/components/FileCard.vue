<template>
  <div class="file-card">
    <div class="file-icon">📄</div>
    <div class="file-details">
      <h3>{{ file.name }}</h3>
      <p>大小: {{ file.size }}</p>
      <p>过期时间: {{ file.expires }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  file: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.file-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.file-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.file-details h3 {
  margin-bottom: 5px;
}

.file-details p {
  color: #666;
  font-size: 0.9rem;
  margin: 3px 0;
}
</style>