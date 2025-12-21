import axios from 'axios'
import message from './message'

// 创建axios实例
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/',
    timeout: 30000, // 分片上传需要较长时间
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 添加token等认证信息
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        // 处理分片上传的特殊响应
        if (response.config.url.includes('/upload')) {
            return response.data // 直接返回data，因为你的后端返回ApiResult包装
        }
        return response.data
    },
    (error) => {
        // 处理上传错误
        if (error.config?.url?.includes('/upload')) {
            message.error('上传失败：' + (error.response?.data?.message || error.message))
        }
        return Promise.reject(error)
    }
)

export default instance