import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page introuvable
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            
            <Link
              to="/dashboard"
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-medium"
            >
              <Home className="h-5 w-5" />
              <span>Accueil</span>
            </Link>
          </div>
        </div>

        {/* Links */}
        <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Pages populaires :</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/dashboard" className="hover:text-primary-600 dark:hover:text-primary-400">
              Dashboard
            </Link>
            <Link to="/exercises" className="hover:text-primary-600 dark:hover:text-primary-400">
              Exercices
            </Link>
            <Link to="/workouts" className="hover:text-primary-600 dark:hover:text-primary-400">
              Programmes
            </Link>
            <Link to="/progress" className="hover:text-primary-600 dark:hover:text-primary-400">
              Progression
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;