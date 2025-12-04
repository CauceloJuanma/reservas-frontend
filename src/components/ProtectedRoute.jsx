import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        );
    }

    // Si no hay usuario, redirigir a login
    if (!user) {
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Si hay usuario, mostrar el componente
    return children;
}