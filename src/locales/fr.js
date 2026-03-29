export default {
  app: {
    logo: 'QuickBox',
    slogan: 'QuickBox · Service de partage de fichiers temporaire',
    footer: '© 2025 QuickBox | Fichiers conservés max 7 jours | Entièrement anonyme'
  },
  tabs: {
    folderUpload: 'Télécharger dossier',
    fileUpload: 'Télécharger fichier',
    download: 'Télécharger'
  },
  upload: {
    selectFolder: 'Sélectionner dossier (suppression auto après 7 jours)',
    selectFile: 'Sélectionner fichier (suppression auto après 7 jours)',
    clickSelectFolder: 'Cliquez pour sélectionner un dossier ou glissez ici',
    clickSelectFile: 'Cliquez pour sélectionner un fichier ou glissez ici',
    folderHint: 'Prend en charge la sélection du dossier entier, conservation de la structure',
    fileHint: 'Prend en charge tout type et taille de fichier',
    filesCount: 'fichiers, total',
    uploading: 'Téléchargement...',
    prepare: 'Prêt à télécharger',
    uploadProgress: 'Progression du téléchargement',
    chunkProgress: 'Progression des morceaux',
    fileProgress: 'Progression du fichier',
    uploadFailed: 'Échec du téléchargement',
    generateCode: 'Générer code de récupération',
    uploadingBtn: 'Téléchargement...',
    notice: 'Utilisation: Après le téléchargement d\'un fichier, le système génère un code de récupération à 6 chiffres. Le destinataire peut télécharger le fichier en utilisant ce code. Le fichier sera automatiquement supprimé après le téléchargement ou après 7 jours.',
    folderNotice: 'Utilisation: Après le téléchargement d\'un dossier, le système génère un code de récupération à 6 chiffres. Le destinataire peut télécharger le dossier (fichier ZIP) en utilisant ce code. Le dossier sera automatiquement supprimé après le téléchargement ou après 7 jours.',
    noticeTitle: 'Utilisation:',
    removeFolder: 'Supprimer le dossier',
    removeFile: 'Supprimer le fichier'
  },
  result: {
    codeGenerated: 'Code de récupération généré',
    fileUploadSuccess: 'Fichier téléchargé avec succès! Veuillez conserver le code de récupération',
    folderUploadSuccess: 'Dossier téléchargé avec succès! Veuillez conserver le code de récupération',
    expires: 'Expire le',
    copyCode: 'Copier le code',
    shareLink: 'Partager le lien',
    uploadNew: 'Télécharger nouveau fichier',
    uploadNewFolder: 'Télécharger nouveau dossier',
    clickToCopy: 'Cliquez pour copier'
  },
  download: {
    inputCode: 'Entrez le code de récupération à 6 chiffres',
    placeholder: 'Ex: 3A7B9C',
    enterCode: 'Veuillez entrer 6 caractères alphanumériques',
    entered: 'Entré',
    bits: 'caractères',
    importantNotice: 'Avis important',
    notice1: 'Chaque code de récupération ne peut être utilisé qu\'une seule fois, fichier supprimé immédiatement après téléchargement',
    notice2: 'Le code de récupération est sensible à la casse, veuillez entrer exactement',
    notice3: 'Les fichiers sont conservés maximum 7 jours, suppression automatique après expiration',
    extractFile: 'Extraire le fichier'
  },
  resultPage: {
    uploadSuccess: 'Téléchargement réussi!',
    yourCode: 'Votre code de récupération: ',
    tip: 'Note: Ce code de récupération est valide 7 jours, le fichier sera automatiquement supprimé après téléchargement',
    loading: 'Chargement des informations du fichier...',
    getFileFailed: 'Échec de la récupération des informations du fichier',
    checkCode: 'Veuillez vérifier si le code de récupération est correct ou le fichier a peut-être été supprimé',
    uploadNewFile: 'Télécharger nouveau fichier',
    fileReady: 'Fichier prêt',
    downloading: 'Téléchargement...',
    downloadNow: 'Télécharger maintenant',
    downloadTip: 'Note: Le fichier sera automatiquement supprimé après téléchargement',
    fileNotExist: 'Le fichier n\'existe pas ou a été supprimé',
    codeFormatError: 'Format de code de récupération invalide',
    serverError: 'Erreur interne du serveur, veuillez réessayer plus tard',
    networkError: 'Échec de la connexion réseau, veuillez vérifier votre connexion',
    downloadFailed: 'Échec du téléchargement: '
  },
  modal: {
    shareLink: 'Partager le lien',
    cancel: 'Annuler',
    confirm: 'Confirmer'
  },
  message: {
    codeCopied: 'Code de récupération {code} copié dans le presse-papiers',
    copyCodeFailed: 'Échec de la copie du code, veuillez copier manuellement',
    noCode: 'Aucun code de récupération à copier',
    linkCopied: 'Lien de téléchargement copié dans le presse-papiers',
    copyLinkFailed: 'Échec de la copie du lien, veuillez copier manuellement',
    generateCodeFirst: 'Veuillez d\'abord générer un code de récupération'
  },
  language: {
    select: 'Langue',
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    ru: 'Русский',
    de: 'Deutsch',
    fr: 'Français'
  }
}
