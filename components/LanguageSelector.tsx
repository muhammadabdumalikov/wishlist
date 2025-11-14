'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'react-feather';

interface LanguageSelectorProps {
  currentLang: 'en' | 'ru' | 'uz';
  onLanguageChange: (lang: 'en' | 'ru' | 'uz') => void;
}

const languages = {
  en: { code: 'en', label: 'English', short: 'EN' },
  ru: { code: 'ru', label: 'Русский', short: 'RU' },
  uz: { code: 'uz', label: "O'zbek", short: 'UZ' },
};

export default function LanguageSelector({
  currentLang,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentLanguage = languages[currentLang];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 bg-white border border-grey-light rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary hover:bg-gray-50 transition-all shadow-xs"
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">{currentLanguage.short}</span>
        <span className="sm:hidden">{currentLanguage.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-22 sm:w-32 bg-white border border-grey-light rounded-lg shadow-lg z-50 overflow-hidden">
          {Object.values(languages).map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                onLanguageChange(lang.code as 'en' | 'ru' | 'uz');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                currentLang === lang.code
                  ? 'bg-primary text-primary-foreground'
                  : 'text-grey hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{lang.short}</span>
                <span className="text-xs opacity-70 hidden sm:inline">{lang.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

