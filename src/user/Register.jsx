import React, { useState } from "react";
import axios from "../api/axios"; // Axios con withCredentials: true
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function Register() {
  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    pass: "",
    pass_confirmation: "",
  });
  const [error, setError] = useState("");


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Obtener CSRF cookie
      await axios.get("/sanctum/csrf-cookie");

      // Enviar registro
      await axios.post("/api/register", form);

      navigate("/login");
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors)[0][0]);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error al registrar usuario");
      }
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-gray-300">
      <Header />
      <main className="flex-grow flex items-center justify-center px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-90 backdrop-blur-md p-5 rounded-3xl shadow-xl max-w-md w-full"
        >
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 uppercase tracking-wider">
            Registro de Usuario
          </h2>

          {error && (
            <p className="bg-red-100 text-red-700 mb-6 p-3 rounded text-center font-semibold">
              {error}
            </p>
          )}

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="Tu nombre"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="Tu apellido"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="correo">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="pass">
              Contraseña
            </label>
            <input
              id="pass"
              name="pass"
              type="password"
              value={form.pass}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="********"
            />
          </div>

          <div className="mb-7">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="pass_confirmation"
            >
              Confirmar Contraseña
            </label>
            <input
              id="pass_confirmation"
              name="pass_confirmation"
              type="password"
              value={form.pass_confirmation}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition duration-200"
          >
            Registrarse
          </button>
        </form>
        </main>
        <Footer />
    </div>
  );
}