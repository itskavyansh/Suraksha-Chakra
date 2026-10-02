import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

// ── Types ────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// ── Context ──────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

// ── Display ──────────────────────────────────────
const ICON: Record<ToastType, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLOR: Record<ToastType, string> = {
  success: 'bg-brand-700 text-white',
  error: 'bg-danger-700 text-white',
  info: 'bg-ink-900 text-white',
};

interface ToastDisplayProps {
  toast: ToastMessage;
  onDismiss: () => void;
}

const ToastDisplay: React.FC<ToastDisplayProps> = ({ toast, onDismiss }) => {
  const Icon = ICON[toast.type];
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        fixed bottom-24 left-1/2 -translate-x-1/2 z-[200]
        w-[min(90vw,380px)] px-4 py-3 rounded-xl shadow-lg
        flex items-start gap-3 text-sm font-medium
        animate-[fadeInDown_0.25s_ease-out]
        ${COLOR[toast.type]}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span className="flex-1 leading-snug">{toast.message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity p-0.5"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
};

// ── Provider ─────────────────────────────────────
interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const id = `toast-${Date.now()}`;
    setToast({ id, message, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <ToastDisplay toast={toast} onDismiss={dismiss} />}
    </ToastContext.Provider>
  );
};
