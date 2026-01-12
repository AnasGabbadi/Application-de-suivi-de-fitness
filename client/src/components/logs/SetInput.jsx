import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const SetInput = ({ 
  setNumber, 
  value, 
  onChange, 
  completed, 
  onToggle,
  type = 'reps' // 'reps' or 'weight'
}) => {
  return (
    <div className={cn(
      'flex items-center space-x-2 p-3 rounded-lg border-2 transition-all',
      completed 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
    )}>
      {/* Set number */}
      <span className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300">
        {setNumber}
      </span>

      {/* Input */}
      <input
        type="number"
        value={value}
        onChange={onChange}
        min="0"
        step={type === 'weight' ? '0.5' : '1'}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {/* Unit */}
      <span className="text-sm text-gray-500 dark:text-gray-400 w-10">
        {type === 'weight' ? 'kg' : 'reps'}
      </span>

      {/* Toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
          completed
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300'
        )}
      >
        <Check className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SetInput;