import RegisterForm from '../components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center dark:from-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <RegisterForm />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-black text-sm">
            © 2026 FitTracker. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;