'use client';

import { useEffect } from 'react';

export default function FontProvider({ currentLang }: { currentLang: 'en' | 'ru' | 'uz' }) {
  useEffect(() => {
    // Remove existing font classes
    document.documentElement.classList.remove('font-inconsolata', 'font-source-sans');
    document.body.classList.remove('font-inconsolata', 'font-source-sans');

    // Apply font based on language
    if (currentLang === 'ru') {
      document.documentElement.classList.add('font-source-sans');
      document.body.classList.add('font-source-sans');
    } else {
      document.documentElement.classList.add('font-inconsolata');
      document.body.classList.add('font-inconsolata');
    }
  }, [currentLang]);

  return null;
}

