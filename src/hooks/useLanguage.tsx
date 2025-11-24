import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'bn' | 'en') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLanguage = i18n.language as 'bn' | 'en';

  return {
    currentLanguage,
    changeLanguage,
    isBangla: currentLanguage === 'bn',
    isEnglish: currentLanguage === 'en',
  };
};
