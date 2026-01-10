import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <LoginForm />
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

export default Login;