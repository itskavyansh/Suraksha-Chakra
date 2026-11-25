import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastItem | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast((current) => (current?.id === toast.id ? null : current));
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const typeConfig = {
    success: {
      bg: 'bg-brand-900 text-white',
      icon: <CheckCircle className="w-5 h-5 text-brand-500 mr-2 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-danger-700 text-white',
      icon: <AlertCircle className="w-5 h-5 text-white mr-2 flex-shrink-0" />,
    },
    info: {
      bg: 'bg-ink-900 text-white',
      icon: <Info className="w-5 h-5 text-info-600 mr-2 flex-shrink-0" />,
    },
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-20 z-50 w-[90%] max-w-sm pointer-events-auto"
          aria-live="polite"
          role="status"
        >
          <div
            className={`flex items-center justify-between p-3.5 rounded-xl shadow-lg border border-white/10 ${
              typeConfig[toast.type].bg
            } transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className="flex items-center min-w-0 mr-2">
              {typeConfig[toast.type].icon}
              <span className="text-sm font-medium leading-snug break-words">
                {toast.message}
              </span>
            </div>
            <button
              type="button"
              onClick={hideToast}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 text-white/70 hover:text-white rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
