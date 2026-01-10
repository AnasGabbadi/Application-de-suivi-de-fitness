import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  X,
  Timer,
  Dumbbell,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import workoutService from '../services/workoutService';
import logService from '../services/logService';
import Loading from '../components/common/Loading';
import { cn } from '../utils/cn';

const StartWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadWorkout();
    setStartTime(new Date());
  }, [id]);

  // Timer pour le repos
  useEffect(() => {
    let interval;
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            toast.success('Repos terminé ! 💪');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  const loadWorkout = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getWorkoutById(id);
      setWorkout(data);
    } catch (error) {
      toast.error('Erreur lors du chargement du programme');
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = workout?.exercices?.[currentExerciseIndex];
  const totalExercises = workout?.exercices?.length || 0;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;
  const isLastSet = currentSet === (currentExercise?.seriesCible || 3);

  const markSetComplete = () => {
    const key = `${currentExerciseIndex}-${currentSet}`;
    setCompletedSets((prev) => ({ ...prev, [key]: true }));

    if (isLastSet) {
      if (isLastExercise) {
        // Programme terminé
        completeWorkout();
      } else {
        // Passer à l'exercice suivant
        toast.success('Exercice terminé ! 🎉');
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
      }
    } else {
      // Passer à la série suivante avec repos
      setCurrentSet((prev) => prev + 1);
      startRest();
    }
  };

  const startRest = () => {
    setIsResting(true);
    setRestTimeLeft(currentExercise?.tempsRepos || 60);
    toast(`⏱️ Repos de ${currentExercise?.tempsRepos || 60}s`, {
      icon: '💤',
      duration: 2000,
    });
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const completeWorkout = async () => {
    try {
      const endTime = new Date();
      const duration = Math.round((endTime - startTime) / 1000 / 60);

      // Vérifications
      if (!workout || !workout.exercices || workout.exercices.length === 0) {
        toast.error('Aucun exercice à enregistrer');
        return;
      }

      // Construire les exercices pour le log
      const exercicesForLog = workout.exercices
        .map((ex) => {
          const exerciceId = ex.exerciceId?._id || ex.exerciceId;
          
          if (!exerciceId) return null;

          const seriesCible = parseInt(ex.seriesCible) || 3;
          const repsCible = parseInt(ex.repsCible) || 10;

          return {
            exerciceId: exerciceId,
            series: Array.from({ length: seriesCible }, () => ({
              poids: 0,
              reps: repsCible
            }))
          };
        })
        .filter(ex => ex !== null);

      if (exercicesForLog.length === 0) {
        toast.error('Aucun exercice valide à enregistrer');
        return;
      }

      const logData = {
        workoutId: id,
        date: startTime.toISOString(),
        duree: duration > 0 ? duration : 1,
        notes: notes || '',
        exercices: exercicesForLog
      };

      await logService.createLog(logData);

      toast.success('🎉 Programme terminé ! Félicitations !', {
        duration: 4000,
      });

      navigate('/history');
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const abandonWorkout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir abandonner cette séance ?')) {
      navigate('/workouts');
    }
  };

  if (loading) {
    return <Loading fullScreen message="Chargement du programme..." />;
  }

  if (!workout || totalExercises === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Programme introuvable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={abandonWorkout}
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Abandonner</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {workout.nom}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Exercice {currentExerciseIndex + 1} / {totalExercises}</span>
          <span>•</span>
          <span>Série {currentSet} / {currentExercise?.seriesCible || 3}</span>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(((currentExerciseIndex) / totalExercises) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-600 to-primary-700 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentExerciseIndex) / totalExercises) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercice actuel */}
      {currentExercise && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          {/* Nom de l'exercice */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4">
              <Dumbbell className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {currentExercise.exerciceId?.nom || 'Exercice'}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span>{currentExercise.exerciceId?.groupeMusculaire || 'N/A'}</span>
            </div>
          </div>

          {/* Timer de repos */}
          {isResting ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <Timer className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto animate-pulse" />
              </div>
              <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                {restTimeLeft}s
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Temps de repos
              </p>
              <button
                onClick={skipRest}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Passer le repos
              </button>
            </div>
          ) : (
            <>
              {/* Informations série */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentSet}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Série actuelle
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentExercise.repsCible || 10}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Répétitions
                  </div>
                </div>
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentExercise.tempsRepos || 60}s
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Repos
                  </div>
                </div>
              </div>

              {/* Notes de l'exercice */}
              {currentExercise.notes && (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 {currentExercise.notes}
                  </p>
                </div>
              )}

              {/* Bouton terminer la série */}
              <button
                onClick={markSetComplete}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Check className="h-6 w-6" />
                <span>Série terminée</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Notes de séance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes de séance (optionnel)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          placeholder="Comment vous sentez-vous ? Des remarques ?"
          className="block w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Liste des exercices */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Exercices du programme
        </h3>
        <div className="space-y-2">
          {workout.exercices.map((ex, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg transition-colors',
                index === currentExerciseIndex
                  ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800'
                  : index < currentExerciseIndex
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700'
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                  index === currentExerciseIndex
                    ? 'bg-primary-600 text-white'
                    : index < currentExerciseIndex
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                )}>
                  {index < currentExerciseIndex ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span className={cn(
                  'font-medium',
                  index === currentExerciseIndex
                    ? 'text-primary-900 dark:text-primary-100'
                    : 'text-gray-900 dark:text-white'
                )}>
                  {ex.exerciceId?.nom || 'Exercice'}
                </span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {ex.seriesCible || 3} x {ex.repsCible || 10}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartWorkout;