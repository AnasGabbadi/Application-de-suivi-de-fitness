import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  TrendingUp, 
  Calendar, 
  Plus,
  Play,
  BookOpen,
  Activity,
  Target,
  Award,
  Clock
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import exerciseService from '../services/exerciseService';
import workoutService from '../services/workoutService';
import logService from '../services/logService';
import progressService from '../services/progressService';
import Loading from '../components/common/Loading';
import StatsCard from '../components/progress/StatsCard';
import WeightChart from '../components/progress/WeightChart';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExercises: 0,
    totalWorkouts: 0,
    totalLogs: 0,
    currentWeight: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger toutes les données en parallèle
      const [exercises, workouts, logs, progress] = await Promise.all([
        exerciseService.getExercises().catch(() => []),
        workoutService.getWorkouts({ limit: 3 }).catch(() => []),
        logService.getLogs({ limit: 5 }).catch(() => []),
        progressService.getProgress().catch(() => []),
      ]);

      // Statistiques
      setStats({
        totalExercises: exercises.length || 0,
        totalWorkouts: workouts.length || 0,
        totalLogs: logs.length || 0,
        currentWeight: progress.length > 0 
          ? progress[progress.length - 1].poids 
          : 0,
      });

      setRecentLogs(logs.slice(0, 5));
      setRecentWorkouts(workouts.slice(0, 3));
      setProgressData(progress);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  if (loading) {
    return <Loading fullScreen message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {getGreeting()}, {user?.nom || 'Athlète'} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Voici un résumé de votre activité
        </p>
      </div>

      {/* Boutons d'action rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/workouts"
          className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Play className="h-6 w-6" />
          <span className="font-medium">Démarrer un programme</span>
        </Link>

        <Link
          to="/workouts/create"
          className="flex items-center justify-center space-x-3 p-4 bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-all"
        >
          <Plus className="h-6 w-6" />
          <span className="font-medium">Créer un programme</span>
        </Link>

        <Link
          to="/progress/create"
          className="flex items-center justify-center space-x-3 p-4 bg-white dark:bg-gray-800 border-2 border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-all"
        >
          <TrendingUp className="h-6 w-6" />
          <span className="font-medium">Ajouter une mesure</span>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Dumbbell}
          title="Exercices"
          value={stats.totalExercises}
          color="blue"
        />
        <StatsCard
          icon={BookOpen}
          title="Programmes"
          value={stats.totalWorkouts}
          color="purple"
        />
        <StatsCard
          icon={Calendar}
          title="Séances"
          value={stats.totalLogs}
          color="green"
        />
        <StatsCard
          icon={Target}
          title="Poids actuel"
          value={stats.currentWeight > 0 ? stats.currentWeight.toFixed(1) : '-'}
          unit={stats.currentWeight > 0 ? 'kg' : ''}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche - 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          

          {/* Dernières séances */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Activity className="h-6 w-6 text-primary-600" />
                <span>Activité récente</span>
              </h2>
              <Link
                to="/history"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Voir tout
              </Link>
            </div>

            {recentLogs.length > 0 ? (
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div
                    key={log._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        <Dumbbell className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.workoutId?.nom || 'Séance libre'}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(log.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                            })}
                          </span>
                          {log.duree && (
                            <>
                              <span>•</span>
                              <span>{log.duree} min</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Aucune séance enregistrée
                </p>
                <Link
                  to="/workouts"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>Commencer un programme</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Colonne droite - 1/3 */}
        <div className="space-y-8">
          {/* Programmes récents */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Mes programmes
              </h2>
              <Link
                to="/workouts"
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Voir tout
              </Link>
            </div>

            {recentWorkouts.length > 0 ? (
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <Link
                    key={workout._id}
                    to={`/workouts/${workout._id}`}
                    className="block p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 transition-all border border-primary-200 dark:border-primary-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          {workout.nom}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workout.exercices?.length || 0} exercices
                        </p>
                      </div>
                      <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Aucun programme créé
                </p>
                <Link
                  to="/workouts/create"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Créer un programme</span>
                </Link>
              </div>
            )}
          </div>

          {/* Conseils du jour */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Conseil du jour</span>
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              La régularité est la clé du succès. Même 20 minutes d'entraînement
              valent mieux que rien. Continuez comme ça ! 💪
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;