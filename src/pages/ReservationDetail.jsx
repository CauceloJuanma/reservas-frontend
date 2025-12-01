import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function ReservationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        fetchReservation();
    }, [id]);

    const fetchReservation = async () => {
        try {
            const res = await axios.get(`/api/reservations/${id}`);
            setReservation(res.data.reservation);
        } catch (err) {
            console.error(err);
            alert('Error al cargar la reserva');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!window.confirm('¿Confirmar esta reserva? Se reducirá el stock.')) return;

        setConfirming(true);
        try {
            const res = await axios.post(`/api/reservations/${id}/confirm`);
            if (res.data.success) {
                alert('✅ Reserva confirmada correctamente');
                fetchReservation();
            }
        } catch (err) {
            alert(`❌ Error: ${err.response?.data?.message || 'Error desconocido'}`);
        } finally {
            setConfirming(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('¿Cancelar esta reserva?')) return;

        setCanceling(true);
        try {
            const res = await axios.post(`/api/reservations/${id}/cancel`);
            if (res.data.success) {
                alert('✅ Reserva cancelada correctamente');
                fetchReservation();
            }
        } catch (err) {
            alert(`❌ Error: ${err.response?.data?.message || 'Error desconocido'}`);
        } finally {
            setCanceling(false);
        }
    };

    if (loading) return <p className="text-center py-12">Cargando...</p>;

    if (!reservation) return <p className="text-center py-12">Reserva no encontrada</p>;

    const total = reservation.lineas?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
    const isConfirmed = reservation.estado_id === 2;
    const isCanceled = reservation.estado_id === 3;
    const isPending = reservation.estado_id === 1;

    const getEstadoBadge = () => {
        if (isPending) return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Pendiente</span>;
        if (isConfirmed) return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Confirmada</span>;
        if (isCanceled) return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Cancelada</span>;
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">
                    Reserva #{reservation.id}
                </h1>
                {getEstadoBadge()}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-800 p-4 rounded-lg">
                <div>
                    <p className="text-gray-400">Empresa:</p>
                    <p className="text-white font-semibold">{reservation.empresa?.nombre}</p>
                </div>
                <div>
                    <p className="text-gray-400">Fecha:</p>
                    <p className="text-white font-semibold">
                        {new Date(reservation.created_at).toLocaleDateString('es-ES')}
                    </p>
                </div>
            </div>

            {/* Tabla de items */}
            <table className="w-full bg-slate-800 rounded-lg overflow-hidden mb-8">
                <thead className="bg-slate-700">
                    <tr>
                        <th className="p-4 text-left text-blue-400">Producto</th>
                        <th className="p-4 text-center text-blue-400">Cantidad</th>
                        <th className="p-4 text-center text-blue-400">Precio Unitario</th>
                        <th className="p-4 text-right text-blue-400">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {reservation.lineas?.map((item) => (
                        <tr key={item.id} className="border-t border-slate-700 hover:bg-slate-700/50">
                            <td className="p-4 text-gray-300">{item.producto.nombre}</td>
                            <td className="p-4 text-center text-white">{item.cantidad}</td>
                            <td className="p-4 text-center text-gray-400">{item.precio_unitario}€</td>
                            <td className="p-4 text-right text-blue-400 font-semibold">
                                {item.subtotal.toFixed(2)}€
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-8">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <p className="text-xl font-bold text-white">
                        Total: <span className="text-blue-400">{total.toFixed(2)}€</span>
                    </p>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 justify-end">
                <button
                    onClick={() => navigate('/reservations')}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg"
                >
                    Volver
                </button>

                {isPending && (
                    <>
                        <button
                            onClick={handleConfirm}
                            disabled={confirming}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                        >
                            {confirming ? 'Confirmando...' : '✅ Confirmar Reserva'}
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={canceling}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                        >
                            {canceling ? 'Cancelando...' : '❌ Cancelar'}
                        </button>
                    </>
                )}

                {isConfirmed && (
                    <button
                        onClick={handleCancel}
                        disabled={canceling}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                    >
                        {canceling ? 'Cancelando...' : '❌ Cancelar Reserva'}
                    </button>
                )}
            </div>
        </div>
    );
}