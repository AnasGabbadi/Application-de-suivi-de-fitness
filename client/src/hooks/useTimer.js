import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook pour gérer un timer/chronomètre
 * @param {number} initialTime - Temps initial en secondes
 * @param {Object} options - Options du timer
 * @returns {Object} État et contrôles du timer
 */
const useTimer = (initialTime = 0, options = {}) => {
  const {
    countDown = true,      // True = compte à rebours, False = chronomètre
    autoStart = false,     // Démarrer automatiquement
    onComplete = null,     // Callback quand le timer atteint 0 (countdown) ou le temps initial (count up)
    interval = 1000,       // Intervalle en ms (défaut: 1 seconde)
  } = options;

  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  // Démarrer le timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Mettre en pause
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Réinitialiser
  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(initialTime);
  }, [initialTime]);

  // Toggle (start/pause)
  const toggle = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  // Effet pour gérer le timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (countDown) {
            // Compte à rebours
            if (prevTime <= 0) {
              setIsRunning(false);
              if (onComplete) onComplete();
              return 0;
            }
            return prevTime - 1;
          } else {
            // Chronomètre
            const newTime = prevTime + 1;
            if (initialTime > 0 && newTime >= initialTime) {
              setIsRunning(false);
              if (onComplete) onComplete();
              return initialTime;
            }
            return newTime;
          }
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, countDown, initialTime, onComplete, interval]);

  // Formater le temps en MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  return {
    time,
    formattedTime: formatTime(time),
    isRunning,
    start,
    pause,
    reset,
    toggle,
  };
};

export default useTimer;