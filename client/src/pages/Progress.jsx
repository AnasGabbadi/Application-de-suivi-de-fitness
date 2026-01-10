import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Weight, Ruler, Target } from 'lucide-react';
import progressService from '../services/progressService';
import useAuth from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import WeightChart from '../components/progress/WeightChart';
import StatsCard from '../components/progress/StatsCard';
import { calculateIMC, getIMCCategory, formatIMC } from '../utils/formatters';

const Progress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    currentWeight: 0,
    weightChange: 0,
    imc: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await progressService.getProgress();
      const progressArray = Array.isArray(data) ? data : [];
      setProgress(progressArray);

      // Calculer les stats
      if (progressArray.length > 0) {
        const sorted = [...progressArray].sort((a, b) => new Date(a.date) - new Date(b.date));
        const latest = sorted[sorted.length - 1];
        const first = sorted[0];
        
        const currentWeight = latest.poids;
        const weightChange = ((currentWeight - first.poids) / first.poids) * 100;
        const imc = user?.taille ? calculateIMC(currentWeight, user.taille) : 0;

        setStats({
          currentWeight,
          weightChange,
          imc,
        });
      }
    } catch (err) {
      console.error('Erreur chargement progression:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const imcCategory = stats.imc ? getIMCCategory(stats.imc) : null;

  if (loading) {
    return <Loading fullScreen message="Chargement de votre progression..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={loadProgress} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ma progression
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez l'évolution de vos performances et mensurations
          </p>
        </div>
        <Link
          to="/progress/create"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter une mesure</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Weight}
          title="Poids actuel"
          value={stats.currentWeight > 0 ? stats.currentWeight.toFixed(1) : '-'}
          unit={stats.currentWeight > 0 ? 'kg' : ''}
          change={Math.abs(stats.weightChange).toFixed(1)}
          changeLabel={stats.weightChange > 0 ? 'en hausse' : 'en baisse'}
          color="blue"
        />

        {user?.taille && stats.imc > 0 && (
          <StatsCard
            icon={TrendingUp}
            title="IMC"
            value={formatIMC(stats.imc)}
            color="green"
          />
        )}

        {user?.taille && (
          <StatsCard
            icon={Ruler}
            title="Taille"
            value={user.taille}
            unit="cm"
            color="purple"
          />
        )}

        {user?.objectif && (
          <StatsCard
            icon={Target}
            title="Objectif"
            value={user.objectif === 'perte_poids' ? 'Perte' : user.objectif === 'prise_masse' ? 'Prise' : 'Maintien'}
            color="orange"
          />
        )}
      </div>

      {/* IMC Info */}
      {imcCategory && stats.imc > 0 && (
        <div className={`${imcCategory.bgColor} border ${imcCategory.textColor.replace('text-', 'border-')} rounded-xl p-6 mb-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Indice de Masse Corporelle (IMC)
              </h3>
              <p className={`text-2xl font-bold ${imcCategory.textColor} mb-1`}>
                {formatIMC(stats.imc)} - {imcCategory.label}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Plage normale: {imcCategory.range}
              </p>
            </div>
            <TrendingUp className={`h-12 w-12 ${imcCategory.textColor}`} />
          </div>
        </div>
      )}

      {/* Weight Chart */}
      {progress.length > 0 ? (
        <WeightChart progressData={progress} />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucune donnée de progression
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ajoutez vos premières mesures pour suivre votre évolution
          </p>
          <Link
            to="/progress/create"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter une mesure</span>
          </Link>
        </div>
      )}

      {/* Recent Measurements */}
      {progress.length > 0 && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dernières mesures
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Poids
                  </th>
                  {user?.taille && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      IMC
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {progress.slice(0, 10).map((item) => {
                  const imc = user?.taille ? calculateIMC(item.poids, user.taille) : null;
                  return (
                    <tr key={item._id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                        {item.poids.toFixed(1)} kg
                      </td>
                      {user?.taille && (
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {imc ? formatIMC(imc) : '-'}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;