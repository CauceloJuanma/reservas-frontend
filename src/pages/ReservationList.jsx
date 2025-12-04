import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

export default function ReservationsList() {
    const navigate = useNavigate();
    const { loading: authLoading } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading) {
            fetchReservations();
        }
    }, [authLoading]);

    const fetchReservations = async () => {
        try {
            setError('');
            const res = await axios.get('/api/reservations');
            
            if (res.data.success) {
                setReservations(res.data.reservas || []);
            } else {
                setError('Error al cargar las reservas');
            }
        } catch (err) {
            console.error('Error al cargar reservas:', err);
            setError(err.response?.data?.message || 'Error al cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const getEstadoBadge = (estadoId) => {
        if (estadoId === 1) return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Pendiente</span>;
        if (estadoId === 2) return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Confirmada</span>;
        if (estadoId === 3) return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Cancelada</span>;
    };

    if (authLoading || loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando reservas...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow bg-gray-900 text-gray-300 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-white mb-8">Mis Reservas</h1>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-8">
                            ❌ {error}
                        </div>
                    )}

                    {reservations.length === 0 ? (
                        <div className="bg-slate-800 p-8 rounded-lg text-center">
                            <p className="text-gray-400 mb-4">No tienes reservas aún</p>
                            <button
                                onClick={() => navigate('/companies')}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                            >
                                Ver Empresas
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {reservations.map((reserva) => (
                                <div
                                    key={reserva.id}
                                    onClick={() => navigate(`/reservations/${reserva.id}`)}
                                    className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h3 className="text-xl font-semibold text-blue-400">
                                                    {reserva.producto ? `${reserva.producto}` : `Reserva #${reserva.id}`}
                                                </h3>
                                                {getEstadoBadge(reserva.estado_id)}
                                            </div>
                                            <p className="text-gray-400 mb-2">
                                                📦 <span className="text-white font-semibold">{reserva.empresa}</span>
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📅 {reserva.fecha}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-gray-400 mb-1">
                                                Items: <span className="text-white font-semibold">{reserva.items_count}</span>
                                            </p>
                                            <p className="text-2xl font-bold text-blue-400">
                                                {(reserva.total || 0).toFixed(2)}€
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg"
                        >
                            ← Volver
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}