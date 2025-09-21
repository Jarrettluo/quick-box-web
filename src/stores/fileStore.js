import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFileStore = defineStore('file', () => {
    const uploadProgress = ref(0)
    const pickupCode = ref('')
    const fileInfo = ref(null)

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase()
    }

    return { uploadProgress, pickupCode, fileInfo, generateCode }
})