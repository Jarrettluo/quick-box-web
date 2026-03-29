export default {
  app: {
    logo: 'QuickBox',
    slogan: 'QuickBox · Temporärer Datei-Sharing-Dienst',
    footer: '© 2025 QuickBox | Dateien werden max. 7 Tage gespeichert | Vollständig anonym'
  },
  tabs: {
    folderUpload: 'Ordner hochladen',
    fileUpload: 'Datei hochladen',
    download: 'Herunterladen'
  },
  upload: {
    selectFolder: 'Ordner auswählen (automatische Löschung nach 7 Tagen)',
    selectFile: 'Datei auswählen (automatische Löschung nach 7 Tagen)',
    clickSelectFolder: 'Klicken um Ordner auszuwählen oder hierher ziehen',
    clickSelectFile: 'Klicken um Datei auszuwählen oder hierher ziehen',
    folderHint: 'Unterstützt Auswahl des gesamten Ordners, Verzeichnisstruktur bleibt erhalten',
    fileHint: 'Unterstützt beliebige Dateitypen und -größen',
    filesCount: 'Dateien, insgesamt',
    uploading: 'Hochladen...',
    prepare: 'Bereit zum Hochladen',
    uploadProgress: 'Upload-Fortschritt',
    chunkProgress: 'Chunk-Fortschritt',
    fileProgress: 'Datei-Fortschritt',
    uploadFailed: 'Upload fehlgeschlagen',
    generateCode: 'Abholcode generieren',
    uploadingBtn: 'Hochladen...',
    notice: 'Verwendung: Nach dem Hochladen einer Datei generiert das System einen 6-stelligen Abholcode. Der Empfänger kann die Datei mit diesem Code herunterladen. Die Datei wird nach dem Download oder nach 7 Tagen automatisch gelöscht.',
    folderNotice: 'Verwendung: Nach dem Hochladen eines Ordners generiert das System einen 6-stelligen Abholcode. Der Empfänger kann den Ordner (ZIP-Paket) mit diesem Code herunterladen. Der Ordner wird nach dem Download oder nach 7 Tagen automatisch gelöscht.',
    noticeTitle: 'Verwendung:',
    removeFolder: 'Ordner entfernen',
    removeFile: 'Datei entfernen'
  },
  result: {
    codeGenerated: 'Abholcode wurde generiert',
    fileUploadSuccess: 'Datei erfolgreich hochgeladen! Bitte speichern Sie den Abholcode',
    folderUploadSuccess: 'Ordner erfolgreich hochgeladen! Bitte speichern Sie den Abholcode',
    expires: 'Läuft ab',
    copyCode: 'Code kopieren',
    shareLink: 'Download-Link teilen',
    uploadNew: 'Neue Datei hochladen',
    uploadNewFolder: 'Neuen Ordner hochladen',
    clickToCopy: 'Klicken zum Kopieren'
  },
  download: {
    inputCode: '6-stelligen Abholcode eingeben',
    placeholder: 'z.B.: 3A7B9C',
    enterCode: 'Bitte 6 alphanumerische Zeichen eingeben',
    entered: 'Eingegeben',
    bits: 'Ziffern',
    importantNotice: 'Wichtiger Hinweis',
    notice1: 'Jeder Abholcode kann nur einmal verwendet werden, Datei wird sofort nach dem Download gelöscht',
    notice2: 'Abholcode ist case-sensitive, bitte genau eingeben',
    notice3: 'Dateien werden maximal 7 Tage gespeichert, automatische Löschung nach Ablauf',
    extractFile: 'Datei abrufen'
  },
  resultPage: {
    uploadSuccess: 'Upload erfolgreich!',
    yourCode: 'Ihr Abholcode: ',
    tip: 'Hinweis: Dieser Abholcode ist 7 Tage gültig, Datei wird nach dem Download automatisch gelöscht',
    loading: 'Dateiinformationen werden geladen...',
    getFileFailed: 'Dateiinformationen konnten nicht abgerufen werden',
    checkCode: 'Bitte überprüfen Sie den Abholcode oder die Datei wurde möglicherweise gelöscht',
    uploadNewFile: 'Neue Datei hochladen',
    fileReady: 'Datei bereit',
    downloading: 'Herunterladen...',
    downloadNow: 'Jetzt herunterladen',
    downloadTip: 'Hinweis: Datei wird nach dem Download automatisch gelöscht',
    fileNotExist: 'Datei existiert nicht oder wurde gelöscht',
    codeFormatError: 'Ungültiges Abholcode-Format',
    serverError: 'Interner Serverfehler, bitte versuchen Sie es später erneut',
    networkError: 'Netzwerkverbindung fehlgeschlagen, bitte überprüfen Sie Ihre Verbindung',
    downloadFailed: 'Download fehlgeschlagen: '
  },
  modal: {
    shareLink: 'Link teilen',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen'
  },
  message: {
    codeCopied: 'Abholcode {code} in die Zwischenablage kopiert',
    copyCodeFailed: 'Abholcode konnte nicht kopiert werden, bitte manuell kopieren',
    noCode: 'Kein Abholcode zum Kopieren vorhanden',
    linkCopied: 'Download-Link in die Zwischenablage kopiert',
    copyLinkFailed: 'Link konnte nicht kopiert werden, bitte manuell kopieren',
    generateCodeFirst: 'Bitte generieren Sie zuerst einen Abholcode'
  },
  language: {
    select: 'Sprache',
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français'
  }
}
