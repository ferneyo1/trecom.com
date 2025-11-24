import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../translations';

type Language = 'es' | 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  // FIX: Added replacements parameter to the `t` function signature to allow for dynamic values in translations.
  t: (key: string, replacements?: { [key: string]: string | number | undefined }) => any; // Allow returning strings, objects, or arrays
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Get language from localStorage or default to 'es'
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'es';
  });

  useEffect(() => {
    // Save language to localStorage whenever it changes
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number | undefined }): any => {
    const keys = key.split('.');
    
    const findTranslation = (lang: Language) => {
      let result: any = translations[lang];
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            return undefined;
        }
      }
      return result;
    }

    let result = findTranslation(language);
    if (result === undefined) {
        result = findTranslation('es'); // Fallback to Spanish
    }

    if (result === undefined) {
        return key; // Return key if not found in any language
    }

    if (typeof result === 'string' && replacements) {
        return Object.keys(replacements).reduce((acc, currentKey) => {
            const regex = new RegExp(`{${currentKey}}`, 'g');
            // Use String() to handle potential null/undefined values
            return acc.replace(regex, String(replacements[currentKey] ?? ''));
        }, result);
    }
    
    return result;
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};