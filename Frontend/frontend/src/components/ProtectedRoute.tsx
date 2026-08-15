import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();
   console.log('ProtectedRoute check:', { token, loading });

  if (loading) {
    return <div>Loading...</div>; // localStorage check hone tak wait
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}