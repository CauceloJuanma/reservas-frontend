import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Empresas', href: '/companies' },
    { name: 'Reservas', href: '/reservations' },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (href) => {
        navigate(href);
        setMobileMenuOpen(false);
    };

    // Determinar página actual
    const isCurrentPage = (href) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => handleNavigation('/')}
                            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            Reserva!
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-1">
                        {navigation.map((item) => {
                            const isCurrent = isCurrentPage(item.href);
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={classNames(
                                        isCurrent
                                            ? 'bg-blue-500/20 text-blue-400 border-b-2 border-blue-400'
                                            : 'text-gray-300 hover:text-white',
                                        'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/5'
                                    )}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Action Buttons */}
                    <div className="hidden md:flex space-x-4">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => handleNavigation('/login')}
                                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    Iniciar sesión
                                </button>
                                <button
                                    onClick={() => handleNavigation('/register')}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                                >
                                    Registrarse
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                            >
                                Cerrar sesión
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden pb-4 space-y-2">
                        {navigation.map((item) => {
                            const isCurrent = isCurrentPage(item.href);
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={classNames(
                                        isCurrent
                                            ? 'bg-blue-500/20 text-blue-400'
                                            : 'text-gray-300 hover:text-white',
                                        'w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-all'
                                    )}
                                >
                                    {item.name}
                                </button>
                            );
                        })}

                        {/* Botones para móvil */}
                        <div className="mt-4 space-y-2">
                            {!user ? (
                                <>
                                    <button
                                        onClick={() => handleNavigation('/login')}
                                        className="w-full px-4 py-2 text-gray-300 hover:text-white transition-colors border border-gray-600 rounded-md"
                                    >
                                        Iniciar sesión
                                    </button>
                                    <button
                                        onClick={() => handleNavigation('/register')}
                                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:shadow-lg transition-all"
                                    >
                                        Registrarse
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={logout}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:shadow-lg transition-all duration-200"
                                >
                                    Cerrar sesión
                                </button>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}