import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { formatSeconds } from '../../utils/formatters';
import { cn } from '../../utils/cn';

const Timer = ({ restTime = 90, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(restTime);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(restTime);
    setIsRunning(false);
  };

  const progress = ((restTime - timeLeft) / restTime) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Temps de repos
          </h3>
        </div>
      </div>

      {/* Timer display */}
      <div className="relative mb-6">
        {/* Progress circle */}
        <svg className="w-48 h-48 mx-auto transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            className={cn(
              'transition-all duration-1000',
              timeLeft === 0 
                ? 'text-green-500' 
                : timeLeft <= 10 
                ? 'text-red-500' 
                : 'text-primary-600'
            )}
            strokeLinecap="round"
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className={cn(
              'text-5xl font-bold',
              timeLeft === 0 
                ? 'text-green-600' 
                : timeLeft <= 10 
                ? 'text-red-600 animate-pulse' 
                : 'text-gray-900 dark:text-white'
            )}>
              {formatSeconds(timeLeft)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {timeLeft === 0 ? 'Terminé !' : 'Repos'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTimer}
          className={cn(
            'flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors',
            isRunning
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          )}
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Démarrer</span>
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Réinitialiser"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Timer;