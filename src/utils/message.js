// 简单的消息提示工具
class Message {
  constructor() {
    this.container = null
    this.init()
  }

  init() {
    // 创建消息容器
    this.container = document.createElement('div')
    this.container.className = 'global-message-container'
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `
    document.body.appendChild(this.container)
  }

  show(message, type = 'info', duration = 3000) {
    const messageEl = document.createElement('div')
    messageEl.className = `global-message global-message-${type}`
    messageEl.textContent = message
    messageEl.style.cssText = `
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease;
      max-width: 300px;
      word-break: break-word;
    `

    // 根据类型设置背景色
    const colors = {
      success: '#52c41a',
      error: '#f5222d',
      warning: '#faad14',
      info: '#1890ff'
    }
    messageEl.style.backgroundColor = colors[type] || colors.info

    this.container.appendChild(messageEl)

    // 自动移除
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.style.animation = 'slideOut 0.3s ease'
        setTimeout(() => {
          if (messageEl.parentNode) {
            this.container.removeChild(messageEl)
          }
        }, 300)
      }
    }, duration)

    // 点击关闭
    messageEl.addEventListener('click', () => {
      if (messageEl.parentNode) {
        this.container.removeChild(messageEl)
      }
    })
  }

  success(message, duration) {
    this.show(message, 'success', duration)
  }

  error(message, duration) {
    this.show(message, 'error', duration)
  }

  warning(message, duration) {
    this.show(message, 'warning', duration)
  }

  info(message, duration) {
    this.show(message, 'info', duration)
  }
}

// 创建全局实例
const message = new Message()

// 添加动画样式
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)

export default message