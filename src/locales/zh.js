export default {
  app: {
    logo: '快取柜',
    slogan: 'QuickBox · 临时文件共享服务',
    footer: '© 2025 快取柜 QuickBox | 文件最长保留7天 | 完全匿名'
  },
  tabs: {
    folderUpload: '上传文件夹',
    fileUpload: '上传文件',
    download: '提取文件'
  },
  upload: {
    selectFolder: '选择文件夹（7天后自动删除）',
    selectFile: '选择文件（7天后自动删除）',
    clickSelectFolder: '点击选择文件夹或拖拽到此处',
    clickSelectFile: '点击选择文件或拖拽到此处',
    folderHint: '支持选择整个文件夹，保持目录结构',
    fileHint: '支持任意文件类型，任意大小',
    filesCount: '个文件，总计',
    uploading: '正在上传...',
    prepare: '准备上传',
    uploadProgress: '上传进度',
    chunkProgress: '分片进度',
    fileProgress: '文件进度',
    uploadFailed: '上传失败',
    generateCode: '生成取件码',
    uploadingBtn: '上传中...',
    notice: '使用说明：上传文件后系统会生成6位取件码，接收方通过取件码下载文件，文件下载后自动删除或7天后过期。',
    folderNotice: '使用说明：上传文件夹后系统会生成6位取件码，接收方通过取件码下载文件夹（ZIP压缩包），文件夹下载后自动删除或7天后过期。',
    noticeTitle: '使用说明：',
    removeFolder: '移除文件夹',
    removeFile: '移除文件'
  },
  result: {
    codeGenerated: '取件码已生成',
    fileUploadSuccess: '文件上传成功！请保存以下取件码',
    folderUploadSuccess: '文件夹上传成功！请保存以下取件码',
    expires: '有效期至',
    copyCode: '复制取件码',
    shareLink: '分享下载链接',
    uploadNew: '上传新文件',
    uploadNewFolder: '上传新文件夹',
    clickToCopy: '点击复制'
  },
  download: {
    inputCode: '输入6位取件码',
    placeholder: '例如: 3A7B9C',
    enterCode: '请输入6位字母数字组合',
    entered: '已输入',
    bits: '位',
    importantNotice: '重要提示',
    notice1: '每个取件码仅能使用一次，文件下载后立即失效',
    notice2: '取件码区分大小写，请准确输入',
    notice3: '文件最长保留7天，过期自动删除',
    extractFile: '提取文件'
  },
  resultPage: {
    uploadSuccess: '上传成功！',
    yourCode: '您的取件码：',
    tip: '提示：此取件码7天内有效，文件被下载后自动删除',
    loading: '正在加载文件信息...',
    getFileFailed: '获取文件信息失败',
    checkCode: '请检查取件码是否正确，或文件可能已被删除',
    uploadNewFile: '上传新文件',
    fileReady: '文件已准备就绪',
    downloading: '下载中...',
    downloadNow: '立即下载',
    downloadTip: '注意：下载后文件将自动删除',
    fileNotExist: '文件不存在或已被删除',
    codeFormatError: '取件码格式错误',
    serverError: '服务器内部错误，请稍后重试',
    networkError: '网络连接失败，请检查网络连接',
    downloadFailed: '下载文件失败：'
  },
  modal: {
    shareLink: '分享链接',
    cancel: '取消',
    confirm: '确认'
  },
  message: {
    codeCopied: '取件码 {code} 已复制到剪贴板',
    copyCodeFailed: '复制取件码失败，请手动复制',
    noCode: '没有可复制的取件码',
    linkCopied: '下载链接已复制到剪贴板',
    copyLinkFailed: '复制链接失败，请手动复制',
    generateCodeFirst: '请先生成取件码'
  },
  language: {
    select: '语言',
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français'
  }
}
