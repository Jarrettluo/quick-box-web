export default {
  app: {
    logo: '퀵박스',
    slogan: 'QuickBox · 임시 파일 공유 서비스',
    footer: '© 2025 퀵박스 QuickBox | 파일은 최대 7일 보관 | 완전 익명'
  },
  tabs: {
    folderUpload: '폴더 업로드',
    fileUpload: '파일 업로드',
    download: '다운로드'
  },
  upload: {
    selectFolder: '폴더 선택 (7일 후 자동 삭제)',
    selectFile: '파일 선택 (7일 후 자동 삭제)',
    clickSelectFolder: '클릭하여 폴더 선택 또는 여기에 드래그',
    clickSelectFile: '클릭하여 파일 선택 또는 여기에 드래그',
    folderHint: '전체 폴더 선택 지원, 디렉토리 구조 유지',
    fileHint: '모든 파일 유형, 모든 크기 지원',
    filesCount: '개 파일, 총',
    uploading: '업로드 중...',
    prepare: '업로드 준비',
    uploadProgress: '업로드 진행률',
    chunkProgress: '청크 진행률',
    fileProgress: '파일 진행률',
    uploadFailed: '업로드 실패',
    generateCode: '수령 코드 생성',
    uploadingBtn: '업로드 중...',
    notice: '사용법: 파일을 업로드하면 6자리 수령 코드가 생성됩니다. 수신자는 수령 코드를 사용하여 파일을 다운로드할 수 있습니다. 파일은 다운로드 후 또는 7일 후 자동으로 삭제됩니다.',
    folderNotice: '사용법: 폴더를 업로드하면 6자리 수령 코드가 생성됩니다. 수신자는 수령 코드를 사용하여 폴더(ZIP 압축파일)를 다운로드할 수 있습니다. 폴더는 다운로드 후 또는 7일 후 자동으로 삭제됩니다.',
    noticeTitle: '사용법:',
    removeFolder: '폴더 제거',
    removeFile: '파일 제거'
  },
  result: {
    codeGenerated: '수령 코드가 생성되었습니다',
    fileUploadSuccess: '파일 업로드가 완료되었습니다! 수령 코드를 저장해 주세요',
    folderUploadSuccess: '폴더 업로드가 완료되었습니다! 수령 코드를 저장해 주세요',
    expires: '유효 기간',
    copyCode: '수령 코드 복사',
    shareLink: '다운로드 링크 공유',
    uploadNew: '새 파일 업로드',
    uploadNewFolder: '새 폴더 업로드',
    clickToCopy: '클릭하여 복사'
  },
  download: {
    inputCode: '6자리 수령 코드 입력',
    placeholder: '예: 3A7B9C',
    enterCode: '6자리 영숫자를 입력해 주세요',
    entered: '입력됨',
    bits: '자리',
    importantNotice: '중요 안내',
    notice1: '각 수령 코드는 한 번만 사용 가능, 파일 다운로드 후 즉시 삭제',
    notice2: '수령 코드는 대소문자 구분, 정확히 입력해 주세요',
    notice3: '파일은 최대 7일 보관, 기간 만료 후 자동 삭제',
    extractFile: '파일 추출'
  },
  resultPage: {
    uploadSuccess: '업로드 성공!',
    yourCode: '수령 코드: ',
    tip: '참고: 이 수령 코드는 7일 동안 유효하며, 파일은 다운로드 후 자동으로 삭제됩니다',
    loading: '파일 정보 로딩 중...',
    getFileFailed: '파일 정보를 가져오지 못했습니다',
    checkCode: '수령 코드가 정확한지 확인하거나 파일이 삭제되었을 수 있습니다',
    uploadNewFile: '새 파일 업로드',
    fileReady: '파일 준비 완료',
    downloading: '다운로드 중...',
    downloadNow: '지금 다운로드',
    downloadTip: '참고: 다운로드 후 파일이 자동으로 삭제됩니다',
    fileNotExist: '파일이 존재하지 않거나 삭제되었습니다',
    codeFormatError: '수령 코드 형식 오류',
    serverError: '서버 내부 오류, 나중에 다시 시도해 주세요',
    networkError: '네트워크 연결 실패, 연결을 확인해 주세요',
    downloadFailed: '다운로드 실패: '
  },
  modal: {
    shareLink: '링크 공유',
    cancel: '취소',
    confirm: '확인'
  },
  message: {
    codeCopied: '수령 코드 {code}가 클립보드에 복사되었습니다',
    copyCodeFailed: '수령 코드 복사에 실패했습니다.手動으로 복사해 주세요',
    noCode: '복사할 수령 코드가 없습니다',
    linkCopied: '다운로드 링크가 클립보드에 복사되었습니다',
    copyLinkFailed: '링크 복사에 실패했습니다.手動으로 복사해 주세요',
    generateCodeFirst: '먼저 수령 코드를 생성해 주세요'
  },
  language: {
    select: '언어',
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français'
  }
}
