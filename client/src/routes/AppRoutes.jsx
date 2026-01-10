import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Layouts
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Exercises from '../pages/Exercises';
import CreateExercise from '../pages/CreateExercise'; // ✅ AJOUTÉ
import ExerciseDetail from '../pages/ExerciseDetail';
import WorkoutPlans from '../pages/WorkoutPlans';
import CreateWorkout from '../pages/CreateWorkout';
import StartWorkout from '../pages/StartWorkout';
import History from '../pages/History';
import Progress from '../pages/Progress';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import WorkoutDetail from '../pages/WorkoutDetail';
import CreateProgress from '../pages/CreateProgress';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Pages d'authentification */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Pages privées */}
      <Route
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/exercises/create" element={<CreateExercise />} />
        <Route path="/exercises/:id/edit" element={<CreateExercise />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/workouts" element={<WorkoutPlans />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
        <Route path="/workouts/create" element={<CreateWorkout />} />
        <Route path="/workouts/:id/edit" element={<CreateWorkout />} />
        <Route path="/workouts/:id/start" element={<StartWorkout />} />
        <Route path="/history" element={<History />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/progress/create" element={<CreateProgress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/" element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;