import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ToastProvider } from '../components/ui/Toast';
import router from './router';
import '../i18n';

const App: React.FC = () => {
  const { language } = useAppStore();

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
};

export default App;
