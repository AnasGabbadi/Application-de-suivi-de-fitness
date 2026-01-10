import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePassword from '../components/profile/ChangePassword';
import DeleteAccount from '../components/profile/DeleteAccount';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const updatedUser = await userService.updateProfile(data);
      updateUser(updatedUser);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mon profil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos informations personnelles et vos paramètres de sécurité
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Informations personnelles
            </h2>
            <ProfileForm
              initialData={user}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Changer le mot de passe */}
          <ChangePassword />

          {/* Supprimer le compte */}
          <DeleteAccount />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Avatar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
              {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {user?.prenom} {user?.nom}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {user?.email}
            </p>
          </div>

          {/* Objectif */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Mon objectif</h3>
            <p className="text-primary-100 mb-2">
              {user?.objectif === 'perte_poids' && '🔥 Perte de poids'}
              {user?.objectif === 'prise_masse' && '💪 Prise de masse'}
              {user?.objectif === 'maintien' && '⚖️ Maintien'}
              {user?.objectif === 'endurance' && '🏃 Endurance'}
              {!user?.objectif && '🎯 Non défini'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;