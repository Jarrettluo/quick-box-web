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
    },

    // ==================== 文件夹上传API ====================
    // 初始化文件夹上传
    initFolderUpload(data) {
        return request.post('/api/upload/folder/init', data)
            .then(response => {
                return response.data
            })
    },

    // 上传文件夹分片
    uploadFolderChunk(sessionId, chunkNumber, file, params = {}) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('sessionId', sessionId)
        formData.append('chunkNumber', chunkNumber)
        formData.append('totalChunks', params.totalChunks)
        formData.append('currentChunkSize', file.size)
        formData.append('filename', params.filename)
        formData.append('relativePath', params.relativePath)

        return request.post('/api/upload/folder/chunk', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 0
        })
    },

    // 合并文件夹分片
    mergeFolderChunks(sessionId) {
        return request.post('/api/upload/folder/merge', null, {
            params: { sessionId }
        }).then(response => {
            return response.data
        })
    },

    // 获取文件夹信息
    getFolderInfo(accessCode) {
        return request.get(`/api/upload/folder/info/${accessCode}`)
            .then(response => {
                return response.data
            })
    },

    // 下载文件夹（ZIP压缩包）
    downloadFolder(accessCode) {
        return request.get(`/api/upload/folder/download/${accessCode}`, {
            responseType: 'blob'
        }).then(response => {
            console.log('文件夹下载响应:', response)
            console.log('response.data 类型:', typeof response.data, response.data instanceof Blob)

            let filename = `${accessCode}.zip`

            // 尝试从 header 中解析文件名
            try {
                const disposition = response.headers?.['content-disposition'] ||
                    response.headers?.['Content-Disposition']
                if (disposition) {
                    const utf8FilenameMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i)
                    if (utf8FilenameMatch) {
                        filename = decodeURIComponent(utf8FilenameMatch[1])
                    } else {
                        const filenameMatch = disposition.match(/filename="([^"]+)"/i)
                        if (filenameMatch) {
                            filename = decodeURIComponent(filenameMatch[1].replace(/\+/g, ' '))
                        }
                    }
                }
            } catch (e) {
                // 解析失败，使用默认文件名
                console.warn('解析文件夹下载文件名失败，使用默认文件名')
            }

            return {
                blob: response.data,
                filename: filename
            }
        })
    },

    // 下载文件夹中的单个文件
    downloadFolderFile(accessCode, filePath) {
        return request.get(`/api/upload/folder/file/${accessCode}`, {
            params: { path: filePath },
            responseType: 'blob'
        }).then(response => {
            const disposition = response.headers['content-disposition'] ||
                response.headers['Content-Disposition']
            let filename = filePath.split('/').pop() || `file_${accessCode}`

            if (disposition) {
                const utf8FilenameMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i)
                if (utf8FilenameMatch) {
                    filename = decodeURIComponent(utf8FilenameMatch[1])
                } else {
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

    // 取消文件夹上传
    cancelFolderUpload(sessionId) {
        return request.post('/api/upload/folder/cancel', null, {
            params: { sessionId }
        }).then(response => {
            return response.data
        })
    },

    // 验证取件码
    validateAccessCode(accessCode) {
        return request.get(`/api/upload/folder/validate/${accessCode}`)
            .then(response => {
                return response.data
            })
    },

    // 获取文件夹统计信息
    getFolderStats() {
        return request.get('/api/upload/folder/stats')
            .then(response => {
                return response.data
            })
    },

    // 获取上传进度
    getUploadProgress(sessionId) {
        return request.get(`/api/upload/folder/progress/${sessionId}`)
            .then(response => {
                return response.data
            })
    },

    // 删除文件夹
    deleteFolder(accessCode) {
        return request.delete(`/api/upload/folder/${accessCode}`)
            .then(response => {
                return response.data
            })
    },

    // 批量删除文件夹
    batchDeleteFolders(accessCodes) {
        return request.post('/api/upload/folder/batch-delete', accessCodes)
            .then(response => {
                return response.data
            })
    },

    // 生成取件码
    generateAccessCode() {
        return request.get('/api/upload/folder/generate-code')
            .then(response => {
                return response.data
            })
    },

    // 清理过期文件夹（管理员接口）
    cleanupExpiredFolders() {
        return request.post('/api/upload/folder/cleanup')
            .then(response => {
                return response.data
            })
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

// 高级文件夹上传服务类
export class FolderUploadService {
    constructor(options = {}) {
        this.chunkSize = options.chunkSize || CHUNK_SIZE
        this.maxRetries = options.maxRetries || MAX_RETRIES
        this.concurrentUploads = options.concurrentUploads || 3
    }

    // 上传整个文件夹（通过FileList或文件数组）
    async uploadFolder(files, folderName, options = {}) {
        const {
            onProgress,
            onFileProgress,
            onError,
            expireSeconds = 604800
        } = options

        try {
            // 1. 计算总大小和文件数
            const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0)
            const totalFiles = files.length

            // 2. 初始化文件夹上传（只传4个必需参数）
            const initResponse = await fileApi.initFolderUpload({
                folderName: folderName || 'untitled_folder',
                totalFiles,
                totalSize,
                expireSeconds
            })
            const { sessionId, folderId, accessCode } = initResponse

            // 3. 构建所有分片任务队列
            const tasks = []
            for (const file of files) {
                const relativePath = file.webkitRelativePath || file.relativePath || file.name
                const fileSize = file.size
                const totalChunks = Math.ceil(fileSize / this.chunkSize)

                for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
                    const start = (chunkNumber - 1) * this.chunkSize
                    const end = Math.min(start + this.chunkSize, fileSize)
                    tasks.push({
                        file,
                        relativePath,
                        chunkNumber,
                        totalChunks,
                        start,
                        end,
                        fileSize
                    })
                }
            }

            // 4. 并行上传分片
            let uploadedSize = 0
            let completedTasks = 0
            const totalTasks = tasks.length

            // 并发控制器
            const runTask = async (task) => {
                const { file, relativePath, chunkNumber, totalChunks, start, end, fileSize } = task
                const chunkBlob = file.slice(start, end)
                const chunkFile = new File([chunkBlob], file.name, { type: file.type || 'application/octet-stream' })

                await fileApi.uploadFolderChunk(sessionId, chunkNumber, chunkFile, {
                    totalChunks,
                    filename: file.name,
                    relativePath
                })

                return { file, relativePath, chunkNumber, totalChunks, end: end - start, fileSize }
            }

            // 使用批处理控制并发
            for (let i = 0; i < totalTasks; i += this.concurrentUploads) {
                const batch = tasks.slice(i, i + this.concurrentUploads)
                await Promise.all(
                    batch.map(task => runTask(task).then(result => {
                        uploadedSize += result.end
                        completedTasks++

                        const overallProgress = Math.round((completedTasks * 100) / totalTasks)
                        onProgress?.({
                            overallProgress,
                            uploadedFiles: Math.ceil(completedTasks / (totalTasks / totalFiles)),
                            totalFiles,
                            uploadedSize,
                            totalSize,
                            currentFile: result.file.name
                        })

                        onFileProgress?.({
                            file: result.file.name,
                            relativePath: result.relativePath,
                            progress: Math.round((result.chunkNumber * 100) / result.totalChunks),
                            uploadedSize: result.end,
                            totalSize: result.fileSize
                        })
                    }))
                )
            }

            // 5. 合并分片
            const finalResult = await fileApi.mergeFolderChunks(sessionId)
            return {
                ...finalResult,
                sessionId,
                folderId,
                accessCode,
                uploadedFiles: totalFiles,
                totalFiles
            }

        } catch (error) {
            onError?.(error)
            throw error
        }
    }

    // 下载整个文件夹
    async downloadFolder(accessCode, options = {}) {
        const { onProgress, onError } = options

        try {
            const result = await fileApi.downloadFolder(accessCode)

            // 创建下载链接
            const url = window.URL.createObjectURL(result.blob)
            const a = document.createElement('a')
            a.href = url
            a.download = result.filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            return result
        } catch (error) {
            onError?.(error)
            throw error
        }
    }

    // 获取文件夹信息
    async getFolderInfo(accessCode) {
        return await fileApi.getFolderInfo(accessCode)
    }

    // 取消文件夹上传
    async cancelFolderUpload(sessionId) {
        return await fileApi.cancelFolderUpload(sessionId)
    }

    // 验证取件码
    async validateAccessCode(accessCode) {
        return await fileApi.validateAccessCode(accessCode)
    }

    // 获取上传进度
    async getUploadProgress(sessionId) {
        return await fileApi.getUploadProgress(sessionId)
    }

    // 删除文件夹
    async deleteFolder(accessCode) {
        return await fileApi.deleteFolder(accessCode)
    }
}

// 导出默认实例
export const folderUploadService = new FolderUploadService()
export default new FileUploadService()