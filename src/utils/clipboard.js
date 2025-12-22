/**
 * 剪贴板工具类
 * 提供跨浏览器兼容的复制功能
 */

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @param {string} itemName - 项目名称（用于提示消息）
 * @returns {Promise<boolean>} 是否复制成功
 */
export const copyToClipboard = async (text, itemName = '内容') => {
    if (!text) {
        console.warn('复制内容为空')
        return false
    }

    try {
        // 方法1: 使用现代 Clipboard API（HTTPS 环境）
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        }

        // 方法2: 降级到 execCommand
        return fallbackCopyToClipboard(text)
    } catch (error) {
        console.error('复制失败:', error)
        // 方法3: 提示用户手动复制
        promptManualCopy(text, itemName)
        return false
    }
}

/**
 * 降级复制方法（使用 execCommand）
 * @param {string} text - 要复制的文本
 * @returns {boolean} 是否复制成功
 */
const fallbackCopyToClipboard = (text) => {
    try {
        // 创建临时 textarea 元素
        const textArea = document.createElement('textarea')
        textArea.value = text

        // 设置样式使其不可见
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        textArea.style.opacity = '0'
        textArea.style.pointerEvents = 'none'

        document.body.appendChild(textArea)

        // 选择文本
        textArea.select()
        textArea.setSelectionRange(0, textArea.value.length)

        // 执行复制命令
        const successful = document.execCommand('copy')

        // 清理
        document.body.removeChild(textArea)

        return successful
    } catch (error) {
        console.error('降级复制方法失败:', error)
        return false
    }
}

/**
 * 提示用户手动复制
 * @param {string} text - 要复制的文本
 * @param {string} itemName - 项目名称
 */
const promptManualCopy = (text, itemName) => {
    // 显示提示框让用户手动复制
    const message = `${itemName}：${text}`
    const result = window.prompt(`请手动复制${itemName}：`, text)

    if (result !== null) {
        console.log('用户确认手动复制')
    }
}

/**
 * 检查剪贴板支持情况
 * @returns {object} 支持情况对象
 */
export const checkClipboardSupport = () => {
    return {
        hasClipboardAPI: !!(navigator.clipboard && navigator.clipboard.writeText),
        isSecureContext: window.isSecureContext,
        hasExecCommand: document.queryCommandSupported('copy'),
        userAgent: navigator.userAgent
    }
}

/**
 * 复制取件码（封装常用功能）
 * @param {string} pickupCode - 取件码
 * @param {Function} successCallback - 成功回调
 * @param {Function} errorCallback - 失败回调
 */
export const copyPickupCode = async (pickupCode, successCallback, errorCallback) => {
    const success = await copyToClipboard(pickupCode, '取件码')
    if (success && successCallback) {
        successCallback(pickupCode)
    } else if (!success && errorCallback) {
        errorCallback()
    }
    return success
}

/**
 * 复制下载链接（封装常用功能）
 * @param {string} pickupCode - 取件码
 * @param {Function} successCallback - 成功回调
 * @param {Function} errorCallback - 失败回调
 */
export const copyDownloadLink = async (pickupCode, successCallback, errorCallback) => {
    const baseUrl = window.location.origin
    const downloadLink = `${baseUrl}/result/${pickupCode}`

    const success = await copyToClipboard(downloadLink, '下载链接')
    if (success && successCallback) {
        successCallback(downloadLink)
    } else if (!success && errorCallback) {
        errorCallback()
    }
    return success
}

export default {
    copyToClipboard,
    copyPickupCode,
    copyDownloadLink,
    checkClipboardSupport
}