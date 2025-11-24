import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const currentLang = i18n.language;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors active:scale-95"
      >
        <Languages className="size-5" color="#059669" />
        <span className="text-sm font-medium uppercase">{currentLang}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
            <button
              onClick={() => changeLanguage('fr')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition ${
                currentLang === 'fr' ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-700'
              }`}
            >
              Français
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 transition ${
                currentLang === 'en' ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-700'
              }`}
            >
              English
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
