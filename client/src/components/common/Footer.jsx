import { Heart, Github, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              À propos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              FitTracker vous aide à suivre vos entraînements, progresser et atteindre vos objectifs fitness.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Liens rapides
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/exercises" className="hover:text-primary-600 transition-colors">
                  Exercices
                </a>
              </li>
              <li>
                <a href="/workouts" className="hover:text-primary-600 transition-colors">
                  Programmes
                </a>
              </li>
              <li>
                <a href="/progress" className="hover:text-primary-600 transition-colors">
                  Ma progression
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@fittracker.com"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} FitTracker. Fait avec{' '}
            <Heart className="inline h-4 w-4 text-red-500" />{' '}
            pour votre santé.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;