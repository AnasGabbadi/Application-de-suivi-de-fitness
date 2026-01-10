import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

const StatsCard = ({ 
  icon: Icon, 
  title, 
  value, 
  unit = '', 
  change = null,
  changeLabel = '',
  color = 'blue'
}) => {
  const colors = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-600 dark:text-blue-400',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-600 dark:text-green-400',
      icon: 'text-green-600 dark:text-green-400',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      text: 'text-purple-600 dark:text-purple-400',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-600 dark:text-orange-400',
      icon: 'text-orange-600 dark:text-orange-400',
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-600 dark:text-red-400',
    },
  };

  const colorScheme = colors[color] || colors.blue;

  const getTrendIcon = () => {
    if (change === null || change === 0) return <Minus className="h-4 w-4" />;
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (change === null || change === 0) return 'text-gray-500';
    if (change > 0) return 'text-green-600 dark:text-green-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {unit && (
              <span className="text-lg text-gray-500 dark:text-gray-400">
                {unit}
              </span>
            )}
          </div>

          {change !== null && (
            <div className={cn('flex items-center space-x-1 mt-3', getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">
                {Math.abs(change)}% {changeLabel}
              </span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg', colorScheme.bg)}>
          <Icon className={cn('h-6 w-6', colorScheme.icon)} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;