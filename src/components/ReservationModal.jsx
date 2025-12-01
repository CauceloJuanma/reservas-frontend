import React, { useState } from 'react';
import axios from '../api/axios';

export default function ReservationModal({ product, onClose, onSuccess }) {
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        // Validar contra stock disponible
        if (value <= product.stock) {
            setCantidad(value);
            setError('');
        } else {
            setError(`Stock máximo disponible: ${product.stock}`);
        }
    };

    const handleIncrement = () => {
        if (cantidad < product.stock) {
            setCantidad(cantidad + 1);
            setError('');
        } else {
            setError(`Stock máximo disponible: ${product.stock}`);
        }
    };

    const handleDecrement = () => {
        if (cantidad > 1) {
            setCantidad(cantidad - 1);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/reservations', {
                empresa_id: product.empresa_id, // Ajusta según tu BD
                items: [
                    {
                        producto_id: product.id,
                        cantidad: cantidad,
                    },
                ],
            });

            if (response.data.success) {
                alert(`✅ ${cantidad} unidad(es) reservada(s) correctamente`);
                onSuccess(response.data.reservation_id);
                onClose();
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 
                'Error al crear la reserva'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-8 w-96 border border-slate-700">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">
                    {product.nombre}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Info del producto */}
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-gray-400">
                            💲 Precio: <span className="text-white font-semibold">{product.precio}€</span>
                        </p>
                        <p className="text-gray-400 mt-2">
                            📦 Stock disponible: <span className="text-white font-semibold">{product.stock}</span>
                        </p>
                    </div>

                    {/* Selector de cantidad */}
                    <div className="space-y-2">
                        <label className="block text-gray-300 font-semibold">
                            Cantidad
                        </label>

                        {/* Controles con botones + input */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleDecrement}
                                disabled={cantidad <= 1}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-bold"
                            >
                                −
                            </button>

                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={cantidad}
                                onChange={handleQuantityChange}
                                className="w-20 px-3 py-2 bg-slate-700 text-white text-center border border-slate-600 rounded-lg focus:border-blue-400 outline-none"
                            />

                            <button
                                type="button"
                                onClick={handleIncrement}
                                disabled={cantidad >= product.stock}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-bold"
                            >
                                +
                            </button>
                        </div>

                        {/* Mostrar subtotal */}
                        <p className="text-gray-400 text-sm">
                            Subtotal: <span className="text-blue-400 font-semibold">
                                {(product.precio * cantidad).toFixed(2)}€
                            </span>
                        </p>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Reservando...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}