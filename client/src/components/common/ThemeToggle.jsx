import { Moon, Sun } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import { cn } from '../../utils/cn';

const ThemeToggle = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all',
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={cn(
            'absolute inset-0 h-5 w-5 text-yellow-500 transition-all duration-300',
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          )} 
        />
        <Moon 
          className={cn(
            'absolute inset-0 h-5 w-5 text-blue-500 transition-all duration-300',
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          )} 
        />
      </div>
    </button>
  );
};

export default ThemeToggle;