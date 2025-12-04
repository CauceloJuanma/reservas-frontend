import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from "../components/Header";
import Footer from "../components/Footer";



export default function Companies() {
    const { loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        axios.get('/api/companies')
        .then(response => {
            setCompanies(response.data);
        })
        .catch(error => {
            console.error('Error fetching empresas:', error);
        });
    }, []);


    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col text-gray-300">
            <Header />
            <main className="flex-grow max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-10 text-center">
                    Lista de Empresas
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company) => (
                    <div
                        key={company.id}
                        className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full min-h-[260px] hover:-translate-y-2 hover:border-blue-400"
                    >
                        <h3 className="text-xl font-semibold text-blue-400">
                            {company.nombre}
                        </h3>
                            <div className="mt-4 text-sm text-gray-400 space-y-1">
                                <p><span className="text-gray-500">📍 Dirección:</span> {company.direccion}</p>
                                <p><span className="text-gray-500">📞 Teléfono:</span> {company.telefono}</p>
                                <p><span className="text-gray-500">✉️ Email:</span> {company.email}</p>
                            </div>
                        

                        <button
                            onClick={() => navigate(`/products/${company.id}`)}
                            className="mt-auto w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Ver productos
                        </button>
                    </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}