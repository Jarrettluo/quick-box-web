import { defineStore } from 'pinia'
import storage from '@/utils/storage'
export const useFileStore = defineStore('file', {
  state: () => ({
    fileInfo: null,
    uploadCode: null,
    uploadTime: null,
    history: []
  }),

  actions: {
    setFileInfo(info) {
      this.fileInfo = info
    },

    async setUploadResult(code, fileInfo) {
      this.uploadCode = code
      this.uploadTime = new Date().toISOString()

      const record = {
        code: code,
        filename: fileInfo.name,
        size: fileInfo.size,
        uploadTime: this.uploadTime,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      await storage.addRecord(record)

      await this.loadHistory()
    },

    clearUploadResult() {
      this.fileInfo = null
      this.uploadCode = null
      this.uploadTime = null
    },

    async loadHistory() {
      try {
        this.history = await storage.getHistory()
      } catch (error) {
        console.error('加载历史记录失败:', error)
        this.history = []
      }
    },

    async deleteHistoryRecord(code) {
      try {
        await storage.deleteRecord(code)
        await this.loadHistory()
        return true
      } catch (error) {
        console.error('删除记录失败:', error)
        return false
      }
    },

    async clearHistory() {
      try {
        await storage.clearHistory()
        this.history = []
        return true
      } catch (error) {
        console.error('清空历史记录失败:', error)
        return false
      }
    }
  }
})
