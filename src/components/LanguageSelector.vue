<template>
  <div class="language-selector">
    <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
      <option value="zh">{{ $t('language.zh') }}</option>
      <option value="en">{{ $t('language.en') }}</option>
      <option value="ja">{{ $t('language.ja') }}</option>
      <option value="ko">{{ $t('language.ko') }}</option>
      <option value="ru">{{ $t('language.ru') }}</option>
      <option value="de">{{ $t('language.de') }}</option>
      <option value="fr">{{ $t('language.fr') }}</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

watch(locale, (newVal) => {
  currentLocale.value = newVal
})
</script>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.lang-select {
  padding: 8px 32px 8px 12px;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--light);
  color: var(--gray-dark);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  outline: none;
  transition: border-color 0.2s ease;
}

.lang-select:hover {
  border-color: var(--primary);
}

.lang-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(74, 107, 223, 0.1);
}

@media (max-width: 480px) {
  .lang-select {
    padding: 6px 28px 6px 10px;
    font-size: 0.85rem;
  }
}
</style>
