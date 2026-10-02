import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import router from './router';
import '../i18n';

const App: React.FC = () => {
  const { language } = useAppStore();

  // Sync document.lang on mount and on language change
  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return <RouterProvider router={router} />;
};

export default App;
