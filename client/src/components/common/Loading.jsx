import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const Loading = ({ 
  fullScreen = false, 
  message = 'Chargement...', 
  size = 'md',
  className 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="text-center">
          <Loader2 className={cn('animate-spin text-primary-600 mx-auto', sizes.lg)} />
          {message && (
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary-600', sizes[size])} />
      {message && (
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          {message}
        </span>
      )}
    </div>
  );
};

export default Loading;