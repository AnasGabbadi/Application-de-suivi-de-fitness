import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Dumbbell, 
  TrendingUp,
  Trash2,
  Eye,
  Filter,
  ChevronDown
} from 'lucide-react';
import logService from '../services/logService';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatDate, formatDuration } from '../utils/formatters';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const History = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, week, month
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, [filter]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {};
      const now = new Date();
      
      if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filters.startDate = weekAgo.toISOString();
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filters.startDate = monthAgo.toISOString();
      }

      const data = await logService.getLogs(filters);
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      try {
        await logService.deleteLog(id);
        setLogs(logs.filter(log => log._id !== id));
        toast.success('Séance supprimée');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const toggleExpand = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  if (loading) {
    return <Loading fullScreen message="Chargement de l'historique..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={loadLogs} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Historique des séances
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {logs.length} séance{logs.length > 1 ? 's' : ''} enregistrée{logs.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filter */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              filter === 'all'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('week')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              filter === 'week'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            7 jours
          </button>
          <button
            onClick={() => setFilter('month')}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              filter === 'month'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            30 jours
          </button>
        </div>
      </div>

      {/* Logs List */}
      {logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {log.workoutId?.nom || 'Séance'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(log.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(log.duree)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dumbbell className="h-4 w-4" />
                        <span>{log.exercices?.length || 0} exercices</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleExpand(log._id)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Voir détails"
                    >
                      <ChevronDown 
                        className={cn(
                          'h-5 w-5 transition-transform',
                          expandedLog === log._id && 'rotate-180'
                        )} 
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                {log.notes && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {log.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {expandedLog === log._id && log.exercices && log.exercices.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-6">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
                    Détails des exercices
                  </h4>
                  <div className="space-y-4">
                    {log.exercices.map((ex, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-gray-700 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {ex.exerciceId?.nom || 'Exercice'}
                          </h5>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {ex.series?.length || 0} séries
                          </span>
                        </div>

                        {ex.series && ex.series.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {ex.series.map((set, setIndex) => (
                              <div
                                key={setIndex}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 rounded px-3 py-2 text-sm"
                              >
                                <span className="text-gray-600 dark:text-gray-400">
                                  Série {setIndex + 1}
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {set.reps} × {set.poids}kg
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune séance enregistrée
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Commencez à enregistrer vos séances d'entraînement
          </p>
          <Link
            to="/workouts"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Dumbbell className="h-5 w-5" />
            <span>Voir mes programmes</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default History;