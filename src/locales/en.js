export default {
  app: {
    logo: 'QuickBox',
    slogan: 'QuickBox · Temporary File Sharing Service',
    footer: '© 2025 QuickBox | Files retained for max 7 days | Fully Anonymous'
  },
  tabs: {
    folderUpload: 'Upload Folder',
    fileUpload: 'Upload File',
    download: 'Download'
  },
  upload: {
    selectFolder: 'Select Folder (auto-delete after 7 days)',
    selectFile: 'Select File (auto-delete after 7 days)',
    clickSelectFolder: 'Click to select folder or drag here',
    clickSelectFile: 'Click to select file or drag here',
    folderHint: 'Supports selecting entire folder, maintaining directory structure',
    fileHint: 'Supports any file type, any size',
    filesCount: 'files, total',
    uploading: 'Uploading...',
    prepare: 'Ready to upload',
    uploadProgress: 'Upload Progress',
    chunkProgress: 'Chunk Progress',
    fileProgress: 'File Progress',
    uploadFailed: 'Upload Failed',
    generateCode: 'Generate Pickup Code',
    uploadingBtn: 'Uploading...',
    notice: 'Usage: After uploading, the system will generate a 6-digit pickup code. The recipient can download the file using the pickup code. The file will be automatically deleted after download or after 7 days.',
    folderNotice: 'Usage: After uploading folder, the system will generate a 6-digit pickup code. The recipient can download the folder (ZIP package) using the pickup code. The folder will be automatically deleted after download or after 7 days.',
    noticeTitle: 'Usage:',
    removeFolder: 'Remove folder',
    removeFile: 'Remove file'
  },
  result: {
    codeGenerated: 'Pickup Code Generated',
    fileUploadSuccess: 'File uploaded successfully! Please save the pickup code',
    folderUploadSuccess: 'Folder uploaded successfully! Please save the pickup code',
    expires: 'Expires',
    copyCode: 'Copy Code',
    shareLink: 'Share Download Link',
    uploadNew: 'Upload New File',
    uploadNewFolder: 'Upload New Folder',
    clickToCopy: 'Click to copy'
  },
  download: {
    inputCode: 'Enter 6-digit Pickup Code',
    placeholder: 'e.g.: 3A7B9C',
    enterCode: 'Please enter 6 alphanumeric characters',
    entered: 'Entered',
    bits: '',
    importantNotice: 'Important Notice',
    notice1: 'Each pickup code can only be used once, file is deleted immediately after download',
    notice2: 'Pickup code is case-sensitive, please enter accurately',
    notice3: 'Files are retained for maximum 7 days, auto-deleted after expiration',
    extractFile: 'Extract File'
  },
  resultPage: {
    uploadSuccess: 'Upload Success!',
    yourCode: 'Your pickup code: ',
    tip: 'Note: This pickup code is valid for 7 days, file will be automatically deleted after download',
    loading: 'Loading file information...',
    getFileFailed: 'Failed to get file information',
    checkCode: 'Please check if the pickup code is correct, or the file may have been deleted',
    uploadNewFile: 'Upload New File',
    fileReady: 'File Ready',
    downloading: 'Downloading...',
    downloadNow: 'Download Now',
    downloadTip: 'Note: File will be automatically deleted after download',
    fileNotExist: 'File does not exist or has been deleted',
    codeFormatError: 'Invalid pickup code format',
    serverError: 'Server internal error, please try again later',
    networkError: 'Network connection failed, please check your connection',
    downloadFailed: 'Download failed: '
  },
  modal: {
    shareLink: 'Share Link',
    cancel: 'Cancel',
    confirm: 'Confirm'
  },
  message: {
    codeCopied: 'Pickup code {code} copied to clipboard',
    copyCodeFailed: 'Failed to copy pickup code, please copy manually',
    noCode: 'No pickup code to copy',
    linkCopied: 'Download link copied to clipboard',
    copyLinkFailed: 'Failed to copy link, please copy manually',
    generateCodeFirst: 'Please generate pickup code first'
  },
  language: {
    select: 'Language',
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français'
  },
  history: {
    title: 'Upload History',
    clearHistory: 'Clear History',
    loading: 'Loading...',
    noRecords: 'No Upload Records',
    noRecordsHint: 'Your uploaded files will appear here',
    expiresAt: 'Expires',
    copyCode: 'Copy Pickup Code',
    copied: 'Copied',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this record?',
    recordDeleted: 'Record deleted',
    deleteFailed: 'Delete failed',
    confirmClearAll: 'Are you sure you want to clear all history? This action cannot be undone.',
    historyCleared: 'History cleared',
    clearFailed: 'Clear failed'
  },
  timeUnits: {
    expired: 'Expired',
    day: 'd',
    hour: 'h',
    minute: 'm',
    second: 's'
  },
  fileCard: {
    size: 'Size',
    expires: 'Expires'
  }
}
