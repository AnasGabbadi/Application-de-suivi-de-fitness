import { useState } from 'react';
import { Filter, X, Search } from 'lucide-react';
import { MUSCLE_GROUPS, DIFFICULTIES, CATEGORIES } from '../../utils/constants';
import { cn } from '../../utils/cn';
import useDebounce from '../../hooks/useDebounce';
import { useEffect } from 'react';

const ExerciseFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    groupeMusculaire: initialFilters.groupeMusculaire || '',
    difficulte: initialFilters.difficulte || '',
    categorie: initialFilters.categorie || '',
  });

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    onFilterChange({
      ...filters,
      search: debouncedSearch,
    });
  }, [filters, debouncedSearch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      groupeMusculaire: '',
      difficulte: '',
      categorie: '',
    });
    setSearchTerm('');
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Barre de recherche et bouton filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un exercice..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg border transition-colors',
            isOpen || activeFiltersCount > 0
              ? 'bg-primary-600 text-white border-primary-600 hover:bg-primary-700'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          )}
        >
          <Filter className="h-5 w-5" />
          <span className="font-medium">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Panel de filtres */}
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filtres
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
              >
                <X className="h-4 w-4" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Groupe musculaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Groupe musculaire
              </label>
              <select
                value={filters.groupeMusculaire}
                onChange={(e) => handleFilterChange('groupeMusculaire', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Tous les groupes</option>
                {MUSCLE_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulté */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulté
              </label>
              <select
                value={filters.difficulte}
                onChange={(e) => handleFilterChange('difficulte', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Toutes les difficultés</option>
                {DIFFICULTIES.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={filters.categorie}
                onChange={(e) => handleFilterChange('categorie', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active filters pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.groupeMusculaire && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium">
              <span>{filters.groupeMusculaire}</span>
              <button
                onClick={() => handleFilterChange('groupeMusculaire', '')}
                className="ml-1 hover:text-primary-900 dark:hover:text-primary-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.difficulte && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
              <span>{filters.difficulte}</span>
              <button
                onClick={() => handleFilterChange('difficulte', '')}
                className="ml-1 hover:text-green-900 dark:hover:text-green-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.categorie && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
              <span>{filters.categorie}</span>
              <button
                onClick={() => handleFilterChange('categorie', '')}
                className="ml-1 hover:text-blue-900 dark:hover:text-blue-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseFilter;