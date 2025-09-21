import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://your-api-domain.com/api',
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
    // 可在此添加token等全局headers
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(response => {
    return response.data
}, error => {
    // 统一错误处理
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
})

export default instance