import { useState } from 'react';
import { Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import userService from '../../services/userService';
import useAuth from '../../hooks/useAuth';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      toast.error('Veuillez entrer votre mot de passe');
      return;
    }

    try {
      setIsDeleting(true);
      await userService.deleteAccount(password);
      
      toast.success('Compte supprimé avec succès');
      
      // Déconnexion et redirection
      logout();
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la suppression du compte');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-900 p-6">
      <div className="flex items-start space-x-3 mb-6">
        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            Zone dangereuse
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            La suppression de votre compte est irréversible
          </p>
        </div>
      </div>

      {!showConfirm ? (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              ⚠️ Attention
            </h3>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-1 list-disc list-inside">
              <li>Tous vos programmes seront supprimés</li>
              <li>Toutes vos séances d'entraînement seront perdues</li>
              <li>Toutes vos mesures de progression seront effacées</li>
              <li>Cette action est irréversible</li>
            </ul>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Trash2 className="h-5 w-5" />
            <span>Je veux supprimer mon compte</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg p-4 space-y-4">
            <p className="text-sm text-red-800 dark:text-red-200 font-semibold">
              ⚠️ Confirmez la suppression de votre compte
            </p>
            
            <div>
              <label
                htmlFor="delete-password"
                className="block text-sm font-medium text-red-900 dark:text-red-100 mb-2"
              >
                Entrez votre mot de passe pour confirmer
              </label>
              <div className="relative">
                <input
                  id="delete-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="block w-full px-4 py-2.5 pr-10 border border-red-300 dark:border-red-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-red-700 dark:text-red-300">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setShowConfirm(false);
                setPassword('');
              }}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={!password || isDeleting}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <span>Suppression...</span>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  <span>Supprimer définitivement</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;