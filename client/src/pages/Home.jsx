import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  TrendingUp, 
  Target, 
  Award,
  ChevronRight,
  Check
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Dumbbell,
      title: 'Bibliothèque d\'exercices',
      description: 'Accédez à des centaines d\'exercices détaillés pour tous les groupes musculaires',
    },
    {
      icon: Target,
      title: 'Programmes personnalisés',
      description: 'Créez vos propres programmes d\'entraînement adaptés à vos objectifs',
    },
    {
      icon: TrendingUp,
      title: 'Suivi de progression',
      description: 'Suivez votre évolution avec des graphiques et statistiques détaillés',
    },
    {
      icon: Award,
      title: 'Historique complet',
      description: 'Consultez l\'historique de toutes vos séances d\'entraînement',
    },
  ];

  const benefits = [
    'Suivi de vos performances en temps réel',
    'Programmes adaptés à tous les niveaux',
    'Interface intuitive et facile à utiliser',
    'Statistiques détaillées de progression',
    'Accessible partout, à tout moment',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-3 rounded-xl">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  FitTracker
                </span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Transformez votre
                <span className="block bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  corps et esprit
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Suivez vos entraînements, mesurez vos progrès et atteignez vos objectifs fitness avec FitTracker.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
                >
                  <span>Commencer gratuitement</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-lg"
                >
                  Se connecter
                </Link>
              </div>
            </div>

            {/* Right Content - Image/Illustration */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Progression</p>
                        <p className="text-white text-xl font-bold">+25%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Dumbbell className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Séances</p>
                        <p className="text-white text-xl font-bold">48</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white/80 text-sm">Objectifs atteints</p>
                        <p className="text-white text-xl font-bold">12</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Des outils puissants pour atteindre vos objectifs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="bg-primary-100 dark:bg-primary-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Pourquoi choisir FitTracker ?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Une solution complète pour suivre et améliorer vos performances sportives
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full flex-shrink-0">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-6">
                Prêt à commencer votre transformation ?
              </h3>
              <p className="text-xl mb-8 text-primary-100">
                Rejoignez des milliers d'utilisateurs qui ont déjà atteint leurs objectifs
              </p>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all font-semibold text-lg shadow-lg"
              >
                <span>Créer un compte gratuit</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Commencez dès aujourd'hui
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Gratuit, sans engagement, et accessible sur tous vos appareils
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            <span>S'inscrire maintenant</span>
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;