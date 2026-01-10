import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  variant = 'error',
  className 
}) => {
  const variants = {
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-200',
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const style = variants[variant];
  const Icon = variant === 'error' ? XCircle : AlertCircle;

  return (
    <div className={cn(
      'rounded-lg border p-4',
      style.container,
      className
    )}>
      <div className="flex items-start">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', style.icon)} />
        <div className="ml-3 flex-1">
          <p className={cn('text-sm font-medium', style.text)}>
            {message || 'Une erreur est survenue'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                'mt-3 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                style.button
              )}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;