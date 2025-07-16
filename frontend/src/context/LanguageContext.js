import { createContext, useState } from 'react';

// Création du contexte
const LanguageContext = createContext({
  lang: 'fr',
  toggleLang: () => {}
});

// Provider component
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('fr');
  
  const toggleLang = () => {
    setLang(prevLang => prevLang === 'fr' ? 'ar' : 'fr');
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Export à la fois par défaut et nommé pour la compatibilité
export default LanguageContext;
export { LanguageContext };