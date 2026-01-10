import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus,
  Calendar,
  Target,
  Weight,
  Ruler
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateRegister } from '../../utils/validators';
import { OBJECTIVES, OBJECTIVE_LABELS } from '../../utils/constants';
import { cn } from '../../utils/cn';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
  } = useForm(
    {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      poids: '',
      taille: '',
      objectif: 'maintien',
    },
    validateRegister
  );

  const onSubmit = async (data) => {
    try {
      // Supprimer confirmPassword avant d'envoyer
      const { confirmPassword, ...registerData } = data;
      
      // Convertir les nombres
      registerData.age = parseInt(registerData.age);
      registerData.poids = parseFloat(registerData.poids);
      registerData.taille = parseFloat(registerData.taille);

      await registerUser(registerData);
      navigate('/dashboard');
      toast.success('Inscription réussie ! Bienvenue sur FitTracker');
    } catch (error) {
      setFieldError('email', error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Créer un compte
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Commencez votre transformation fitness dès aujourd'hui
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nom & Prénom */}
        <div className="grid grid-cols-2 gap-4">
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
                  'block w-full pl-10 pr-3 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.nom ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="Doe"
              />
            </div>
            {errors.nom && <p className="mt-1 text-xs text-red-600">{errors.nom}</p>}
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
                  'block w-full pl-10 pr-3 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.prenom ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="John"
              />
            </div>
            {errors.prenom && <p className="mt-1 text-xs text-red-600">{errors.prenom}</p>}
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
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg',
                'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                errors.email ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
              )}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Password & Confirm */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  'block w-full pl-10 pr-10 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.password ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmer
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={cn(
                  'block w-full pl-10 pr-10 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Age, Poids, Taille */}
        <div className="grid grid-cols-3 gap-4">
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
                  'block w-full pl-10 pr-3 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.age ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="25"
              />
            </div>
            {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
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
                className={cn(
                  'block w-full pl-10 pr-3 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.poids ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="75"
                step="0.1"
              />
            </div>
            {errors.poids && <p className="mt-1 text-xs text-red-600">{errors.poids}</p>}
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
                  'block w-full pl-10 pr-3 py-2.5 border rounded-lg',
                  'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  errors.taille ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                )}
                placeholder="180"
              />
            </div>
            {errors.taille && <p className="mt-1 text-xs text-red-600">{errors.taille}</p>}
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
                'block w-full pl-10 pr-3 py-2.5 border rounded-lg appearance-none',
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
          {errors.objectif && <p className="mt-1 text-xs text-red-600">{errors.objectif}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg',
            'bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold',
            'hover:from-primary-700 hover:to-primary-800',
            'focus:outline-none focus:ring-2 focus:ring-primary-500',
            'transition-all duration-200 transform hover:scale-[1.02]',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Création du compte...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" />
              <span>Créer mon compte</span>
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;