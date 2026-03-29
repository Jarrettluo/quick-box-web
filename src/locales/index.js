import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'
import ja from './ja'
import ko from './ko'
import ru from './ru'
import de from './de'
import fr from './fr'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
    ja,
    ko,
    ru,
    de,
    fr
  }
})

export default i18n
