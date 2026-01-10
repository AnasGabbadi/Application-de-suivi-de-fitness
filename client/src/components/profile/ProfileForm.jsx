import { 
  User, 
  Mail, 
  Calendar,
  Target,
  Weight,
  Ruler,
  Save
} from 'lucide-react';
import useForm from '../../hooks/useForm';
import { validateProfile } from '../../utils/validators';
import { OBJECTIVES, OBJECTIVE_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';

const ProfileForm = ({ initialData, onSubmit, isSubmitting }) => {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    initialData || {
      nom: '',
      prenom: '',
      email: '',
      age: '',
      poids: '',
      taille: '',
      objectif: 'maintien',
    },
    validateProfile
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nom & Prénom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="nom"
              value={values.nom}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.nom ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              )}
            />
          </div>
          {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prénom
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="prenom"
              value={values.prenom}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.prenom ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              )}
            />
          </div>
          {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              'block w-full pl-10 pr-3 py-3 border rounded-lg',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            )}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>

      {/* Âge, Poids, Taille */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Âge
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="age"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.age ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="25"
            />
          </div>
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Poids (kg)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Weight className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="poids"
              value={values.poids}
              onChange={handleChange}
              onBlur={handleBlur}
              step="0.1"
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.poids ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="75.0"
            />
          </div>
          {errors.poids && <p className="mt-1 text-sm text-red-600">{errors.poids}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Taille (cm)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Ruler className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              name="taille"
              value={values.taille}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'block w-full pl-10 pr-3 py-3 border rounded-lg',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.taille ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="180"
            />
          </div>
          {errors.taille && <p className="mt-1 text-sm text-red-600">{errors.taille}</p>}
        </div>
      </div>

      {/* Objectif */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Objectif fitness
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <select
            name="objectif"
            value={values.objectif}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(
              'block w-full pl-10 pr-3 py-3 border rounded-lg appearance-none',
              'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              errors.objectif ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
            )}
          >
            {OBJECTIVES.map((obj) => (
              <option key={obj} value={obj}>
                {OBJECTIVE_LABELS[obj]}
              </option>
            ))}
          </select>
        </div>
        {errors.objectif && <p className="mt-1 text-sm text-red-600">{errors.objectif}</p>}
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all font-medium',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Enregistrer les modifications</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;