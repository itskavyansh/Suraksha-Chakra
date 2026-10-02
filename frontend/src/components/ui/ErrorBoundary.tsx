import React, { Component, type ErrorInfo } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Fallback component using hooks
const ErrorFallback: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-danger-100 flex items-center justify-center mb-4">
        <span className="text-danger-700 text-2xl" role="img" aria-label="Error">⚠️</span>
      </div>
      <h1 className="text-xl font-bold text-ink-900 mb-2">
        {t('errors.something_wrong')}
      </h1>
      <p className="text-ink-500 mb-6 text-sm">
        Please try refreshing the page or return home.
      </p>
      <a
        href="/"
        className="inline-flex items-center justify-center px-5 py-3 bg-brand-700 text-white font-semibold rounded-xl min-h-[44px] hover:bg-brand-900 transition-colors"
      >
        {t('errors.go_home')}
      </a>
    </div>
  );
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In production, this would go to a logging service
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
