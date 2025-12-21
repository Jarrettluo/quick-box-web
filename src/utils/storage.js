// 使用 IndexedDB 的本地存储工具类
class IndexedDBStorage {
    constructor(dbName = 'QuickBoxDB', storeName = 'upload_history') {
        this.dbName = dbName
        this.storeName = storeName
        this.db = null
        this.version = 1
    }

    // 初始化数据库连接
    async init() {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version)

            request.onerror = (event) => {
                console.error('IndexedDB 初始化失败:', event.target.error)
                reject(event.target.error)
            }

            request.onsuccess = (event) => {
                this.db = event.target.result
                resolve(this.db)
            }

            request.onupgradeneeded = (event) => {
                const db = event.target.result

                // 创建对象存储空间
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: 'code'
                    })

                    // 创建索引以便按时间排序
                    store.createIndex('uploadTime', 'uploadTime', { unique: false })
                    store.createIndex('expiresAt', 'expiresAt', { unique: false })
                }
            }
        })
    }

    // 获取数据库连接
    async getDB() {
        if (!this.db) {
            await this.init()
        }
        return this.db
    }

    // 获取所有历史记录（按时间倒序）
    async getHistory() {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly')
                const store = transaction.objectStore(this.storeName)
                const index = store.index('uploadTime')
                const request = index.openCursor(null, 'prev') // 倒序排列

                const history = []

                request.onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        history.push(cursor.value)
                        cursor.continue()
                    } else {
                        resolve(history)
                    }
                }

                request.onerror = (event) => {
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('获取历史记录失败:', error)
            return []
        }
    }

    // 添加或更新记录
    async addRecord(record) {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite')
                const store = transaction.objectStore(this.storeName)
                const request = store.put(record)

                request.onsuccess = () => {
                    resolve(true)
                }

                request.onerror = (event) => {
                    console.error('保存记录失败:', event.target.error)
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('保存记录失败:', error)
            return false
        }
    }

    // 获取单个记录
    async getRecord(code) {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly')
                const store = transaction.objectStore(this.storeName)
                const request = store.get(code)

                request.onsuccess = (event) => {
                    resolve(event.target.result || null)
                }

                request.onerror = (event) => {
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('获取记录失败:', error)
            return null
        }
    }

    // 删除指定记录
    async deleteRecord(code) {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite')
                const store = transaction.objectStore(this.storeName)
                const request = store.delete(code)

                request.onsuccess = () => {
                    resolve(true)
                }

                request.onerror = (event) => {
                    console.error('删除记录失败:', event.target.error)
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('删除记录失败:', error)
            return false
        }
    }

    // 清空所有历史记录
    async clearHistory() {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite')
                const store = transaction.objectStore(this.storeName)
                const request = store.clear()

                request.onsuccess = () => {
                    resolve(true)
                }

                request.onerror = (event) => {
                    console.error('清空历史记录失败:', event.target.error)
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('清空历史记录失败:', error)
            return false
        }
    }

    // 获取记录数量
    async getCount() {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly')
                const store = transaction.objectStore(this.storeName)
                const request = store.count()

                request.onsuccess = (event) => {
                    resolve(event.target.result)
                }

                request.onerror = (event) => {
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('获取记录数量失败:', error)
            return 0
        }
    }

    // 删除过期记录（可选功能）
    async deleteExpiredRecords() {
        try {
            const db = await this.getDB()
            const now = new Date().toISOString()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite')
                const store = transaction.objectStore(this.storeName)
                const index = store.index('expiresAt')
                const range = IDBKeyRange.upperBound(now)
                const request = index.openCursor(range)
                let deletedCount = 0

                request.onsuccess = (event) => {
                    const cursor = event.target.result
                    if (cursor) {
                        cursor.delete()
                        deletedCount++
                        cursor.continue()
                    } else {
                        resolve(deletedCount)
                    }
                }

                request.onerror = (event) => {
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('删除过期记录失败:', error)
            return 0
        }
    }

    // 批量操作（可选功能）
    async bulkAdd(records) {
        try {
            const db = await this.getDB()

            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite')
                const store = transaction.objectStore(this.storeName)

                records.forEach(record => {
                    store.put(record)
                })

                transaction.oncomplete = () => {
                    resolve(true)
                }

                transaction.onerror = (event) => {
                    reject(event.target.error)
                }
            })
        } catch (error) {
            console.error('批量添加失败:', error)
            return false
        }
    }
}

// 创建单例实例
const storage = new IndexedDBStorage()

// 导出初始化函数和实例
export const initStorage = async () => {
    await storage.init()
    return storage
}

export default storage