export default {
  app: {
    logo: 'クイックボックス',
    slogan: 'QuickBox · 一時ファイル共有サービス',
    footer: '© 2025 クイックボックス QuickBox | ファイルは最大7日間保持 | 完全匿名'
  },
  tabs: {
    folderUpload: 'フォルダアップロード',
    fileUpload: 'ファイルアップロード',
    download: 'ダウンロード'
  },
  upload: {
    selectFolder: 'フォルダを選択（7日後に自動削除）',
    selectFile: 'ファイルを選択（7日後に自動削除）',
    clickSelectFolder: 'クリックしてフォルダを選択またはここにドラッグ',
    clickSelectFile: 'クリックしてファイルを選択またはここにドラッグ',
    folderHint: 'フォルダ全体を選択をサポート、ディレクトリ構造を維持',
    fileHint: '任意のファイルタイプ、任意のサイズをサポート',
    filesCount: 'ファイル、合計',
    uploading: 'アップロード中...',
    prepare: 'アップロード準備完了',
    uploadProgress: 'アップロード進捗',
    chunkProgress: 'チャンク進捗',
    fileProgress: 'ファイル進捗',
    uploadFailed: 'アップロード失敗',
    generateCode: '受取コード生成',
    uploadingBtn: 'アップロード中...',
    notice: '使用方法：ファイルをアップロードすると、6桁の受取コードが生成されます。受信者は受取コードを使用してファイルをダウンロードできます。ファイルはダウンロード後または7日後に自動的に削除されます。',
    folderNotice: '使用方法：フォルダをアップロードすると、6桁の受取コードが生成されます。受信者は受取コードを使用してフォルダ（ZIP圧縮包）をダウンロードできます。フォルダはダウンロード後または7日後に自動的に削除されます。',
    noticeTitle: '使用方法：',
    removeFolder: 'フォルダを削除',
    removeFile: 'ファイルを削除'
  },
  result: {
    codeGenerated: '受取コードが生成されました',
    fileUploadSuccess: 'ファイルのアップロードが成功しました！受取コードを記録してください',
    folderUploadSuccess: 'フォルダのアップロードが成功しました！受取コードを記録してください',
    expires: '有効期限',
    copyCode: '受取コードをコピー',
    shareLink: 'ダウンロードリンクを共有',
    uploadNew: '新しいファイルをアップロード',
    uploadNewFolder: '新しいフォルダをアップロード',
    clickToCopy: 'クリックしてコピー'
  },
  download: {
    inputCode: '6桁の受取コードを入力',
    placeholder: '例: 3A7B9C',
    enterCode: '6桁の英数字を入力してください',
    entered: '入力済み',
    bits: '桁',
    importantNotice: '重要な注意',
    notice1: '各受取コードは1回のみ使用可能、ファイルはダウンロード後すぐに削除されます',
    notice2: '受取コードは英字大小を区別、正確に入力してください',
    notice3: 'ファイルは最大7日間保持、期限超過後は自動削除',
    extractFile: 'ファイルを抽出'
  },
  resultPage: {
    uploadSuccess: 'アップロード成功！',
    yourCode: '受取コード：',
    tip: '注意：この受取コードは7日間有効、ファイルはダウンロード後に自動削除されます',
    loading: 'ファイル情報を読み込み中...',
    getFileFailed: 'ファイル情報の取得に失敗しました',
    checkCode: '受取コードが正しいか確認するか、ファイルが削除された可能性があります',
    uploadNewFile: '新しいファイルをアップロード',
    fileReady: 'ファイル準備完了',
    downloading: 'ダウンロード中...',
    downloadNow: '今すぐダウンロード',
    downloadTip: '注意：ダウンロード後、ファイルは自動的に削除されます',
    fileNotExist: 'ファイルが存在しないか、削除されました',
    codeFormatError: '受取コード的形式エラー',
    serverError: 'サーバー内部エラー。後でもう一度お試しください',
    networkError: 'ネットワーク接続に失敗しました。接続を確認してください',
    downloadFailed: 'ダウンロード失敗：'
  },
  modal: {
    shareLink: 'リンクを共有',
    cancel: 'キャンセル',
    confirm: '確認'
  },
  message: {
    codeCopied: '受取コード {code} をクリップボードにコピーしました',
    copyCodeFailed: '受取コードのコピーに失敗しました。手動でコピーしてください',
    noCode: 'コピーする受取コードがありません',
    linkCopied: 'ダウンロードリンクをクリップボードにコピーしました',
    copyLinkFailed: 'リンクのコピーに失敗しました。手動でコピーしてください',
    generateCodeFirst: 'まず受取コードを生成してください'
  },
  language: {
    select: '言語',
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français'
  },
  history: {
    title: 'アップロード履歴',
    clearHistory: '履歴をクリア',
    loading: '読み込み中...',
    noRecords: 'アップロード記録なし',
    noRecordsHint: 'アップロードしたファイルがここに表示されます',
    expiresAt: '有効期限',
    copyCode: '受取コードをコピー',
    copied: 'コピー済み',
    delete: '削除',
    confirmDelete: 'この記録を削除してもよろしいですか？',
    recordDeleted: '記録が削除されました',
    deleteFailed: '削除に失敗しました',
    confirmClearAll: 'すべての履歴をクリアしてもよろしいですか？この操作は取り消せません。',
    historyCleared: '履歴がクリアされました',
    clearFailed: 'クリアに失敗しました'
  },
  timeUnits: {
    expired: '期限切れ',
    day: '日',
    hour: '時間',
    minute: '分',
    second: '秒'
  },
  fileCard: {
    size: 'サイズ',
    expires: '有効期限'
  }
}
