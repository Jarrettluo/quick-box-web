import request from '../utils/axios'

// 分片上传相关常量
export const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_RETRIES = 3 // 分片上传重试次数
export const CONCURRENT_UPLOADS = 3 // 并发上传数

// 基础文件API
export const fileApi = {
    // 初始化分片上传
    initChunkUpload(data) {
        return request.post('/api/upload/init', data)
            .then(response => {
                return response.data
            })
    },

    // 上传分片 - 根据后端接口调整
    uploadChunk(uploadId, chunkNumber, file, totalChunks, totalSize, onProgress) {
        const formData = new FormData()
        formData.append('file', file)

        // 将ChunkUploadRequest的所有字段添加到FormData中
        formData.append('uploadId', uploadId)
        formData.append('chunkNumber', chunkNumber)
        formData.append('chunkSize', file.size)
        formData.append('currentChunkSize', file.size)
        formData.append('totalChunks', totalChunks)
        formData.append('totalSize', totalSize)
        formData.append('filename', file.name)
        formData.append('contentType', file.type || 'application/octet-stream')

        return request.post('/api/upload/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: onProgress,
            timeout: 0
        })
    },
    // 合并分片
    mergeChunks(uploadId) {
        return request.post('/api/upload/merge', null, {
            params: {accessCode: uploadId}
        }).then(response => {
            return response.data
        })
    },

    // 获取文件信息
    getFileInfo(accessCode) {
        return request.get(`/api/upload/info/${accessCode}`)
            .then(response => {
                return response.data
            })
    },

    // 下载文件
    downloadFile(accessCode) {
        return request.get(`/api/upload/download/${accessCode}`, {
            responseType: 'blob'
        }).then(response => {
            // 从Content-Disposition提取文件名
            const disposition = response.headers['content-disposition'] ||
                response.headers['Content-Disposition']
            let filename = `file_${accessCode}`

            if (disposition) {
                // 优先解析 filename* (RFC 5987)
                const utf8FilenameMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i)
                if (utf8FilenameMatch) {
                    filename = decodeURIComponent(utf8FilenameMatch[1])
                } else {
                    // 回退到 filename 参数
                    const filenameMatch = disposition.match(/filename="([^"]+)"/i)
                    if (filenameMatch) {
                        filename = decodeURIComponent(filenameMatch[1].replace(/\+/g, ' '))
                    }
                }
            }

            return {
                blob: response.data,
                filename: filename
            }
        })
    },

    // 检查分片上传状态（如果需要）
    checkUploadStatus(uploadId) {
        return request.get(`/api/upload/status/${uploadId}`)
    },

    // 取消上传（如果需要）
    cancelUpload(uploadId) {
        return request.delete(`/api/upload/${uploadId}`)
    }


}

// 高级文件服务类（封装复杂逻辑）
export class FileUploadService {
    constructor(options = {}) {
        this.chunkSize = options.chunkSize || CHUNK_SIZE
        this.maxRetries = options.maxRetries || MAX_RETRIES
        this.concurrentUploads = options.concurrentUploads || 3 // 并发上传数
    }

    // 完整的分片上传流程
    async uploadFile(file, options = {}) {
        const {
            onProgress,
            onChunkUploaded,
            onError
        } = options

        try {
            // 计算总分片数
            const totalChunks = Math.ceil(file.size / this.chunkSize)

            // 1. 初始化上传会话
            const session = await fileApi.initChunkUpload({
                filename: file.name,
                totalSize: file.size,
                chunkSize: this.chunkSize,
                totalChunks: totalChunks,  // 添加总分片数
                ...options.metadata
            })

            const {uploadId} = session
            const actualTotalChunks = Math.ceil(file.size / this.chunkSize)

            // 2. 创建分片队列
            const chunks = this.createChunks(file)
            let uploadedCount = 0

            // 3. 并发上传分片
            const results = await this.uploadChunksConcurrently(
                uploadId,
                chunks,
                file.size,
                actualTotalChunks,
                (chunkIndex, progress) => {
                    // 计算整体进度
                    const overallProgress = Math.round(
                        ((uploadedCount * 100) + progress) / actualTotalChunks
                    )
                    onProgress?.(overallProgress)
                }
            )

            // 4. 合并分片
            const fileCode = await fileApi.mergeChunks(uploadId)
            return fileCode

        } catch (error) {
            onError?.(error)
            throw error
        }
    }

    // 创建分片
    createChunks(file) {
        const chunks = []
        const totalChunks = Math.ceil(file.size / this.chunkSize)

        for (let i = 0; i < totalChunks; i++) {
            const start = i * this.chunkSize
            const end = Math.min(start + this.chunkSize, file.size)
            const chunkBlob = file.slice(start, end)

            // 创建File对象，保留文件名信息
            const chunkFile = new File([chunkBlob], `${file.name}.part${i + 1}`, {
                type: file.type || 'application/octet-stream'
            })

            chunks.push({
                index: i + 1,
                file: chunkFile,
                size: end - start
            })
        }

        return chunks
    }

    // 并发上传分片
    async uploadChunksConcurrently(uploadId, chunks, totalSize, totalChunks, onProgress) {
        const results = []
        const queue = [...chunks]

        // 创建并发任务
        const workers = Array(this.concurrentUploads).fill().map(async () => {
            while (queue.length > 0) {
                const chunk = queue.shift()
                try {
                    await this.uploadChunkWithRetry(
                        uploadId,
                        chunk,
                        totalChunks,
                        totalSize
                    )
                    results.push({chunk: chunk.index, success: true})
                    onProgress?.(chunk.index, 100)
                } catch (error) {
                    results.push({chunk: chunk.index, success: false, error})
                    throw error
                }
            }
        })

        await Promise.all(workers)
        return results
    }

    // 带重试的分片上传
    async uploadChunkWithRetry(uploadId, chunk, totalChunks, totalSize, retryCount = 0) {
        try {
            await fileApi.uploadChunk(
                uploadId,
                chunk.index,
                chunk.file,
                totalChunks,
                totalSize,
                (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                }
            )
        } catch (error) {
            if (retryCount < this.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
                return this.uploadChunkWithRetry(
                    uploadId,
                    chunk,
                    totalChunks,
                    totalSize,
                    retryCount + 1
                )
            }
            throw error
        }
    }
}

// 导出默认实例
export default new FileUploadService()