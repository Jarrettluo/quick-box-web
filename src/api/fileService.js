import axios from '../utils/axios'

export const FileService = {
    /**
     * 上传文件
     * @param {File} file
     * @param {function} onProgress 进度回调
     * @returns {Promise<string>} 取件码
     */
    async upload(file, onProgress) {
        const formData = new FormData()
        formData.append('file', file)

        const res = await axios.post('/upload', formData, {
            onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                onProgress?.(percent)
            }
        })
        return res.code
    },

    /**
     * 下载文件
     * @param {string} code 取件码
     * @returns {Promise<void>}
     */
    async download(code) {
        const res = await axios.get(`/download/${code}`, {
            responseType: 'blob'
        })

        // 从Content-Disposition提取文件名
        const disposition = res.headers['content-disposition']
        const filename = disposition
            ? disposition.split('filename=')[1].replace(/"/g, '')
            : `file_${code}`

        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    },

    /**
     * 获取文件信息
     * @param {string} code
     * @returns {Promise<{name: string, size: string, expires: string}>}
     */
    async getFileInfo(code) {
        return await axios.get(`/file-info/${code}`)
    }
}