import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../components/Layouts/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminDashboard from '../pages/AdminDashboard';
import AuditLog from '../pages/AuditLog';
import Users from '../pages/Users';
import UserDashboard from '../pages/UserDashboard';
import Profile from '../pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRole="ADMIN" fallbackPath="/user">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'audit-logs', element: <AuditLog /> },
      { path: 'users', element: <Users /> },
    ],
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute fallbackPath="/">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <UserDashboard /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]);

export default router;
