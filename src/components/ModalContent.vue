<template>
  <div class="modal-content-component">
    <h4>这是从另一个组件引入的内容</h4>
    <p>当前时间：{{ currentTime }}</p>
    <div class="form-group">
      <label for="message">输入消息：</label>
      <input
          type="text"
          id="message"
          v-model="message"
          class="form-input"
          placeholder="请输入内容..."
      />
    </div>
    <div class="info-box">
      <p>这是一个独立的组件，可以被任何弹窗复用。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalContent',
  data() {
    return {
      currentTime: new Date().toLocaleTimeString(),
      message: ''
    };
  },
  mounted() {
    // 每秒更新时间
    this.timer = setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
</script>

<style scoped>
.modal-content-component {
  font-family: Arial, sans-serif;
}

.form-group {
  margin: 15px 0;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 5px;
  box-sizing: border-box;
}

.info-box {
  background-color: #f8f9fa;
  border-left: 4px solid #007bff;
  padding: 10px 15px;
  margin-top: 15px;
  border-radius: 4px;
}
</style>