import React, { useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function Login() {

  const [form, setForm] = useState({ correo: "", pass: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useContext(AuthContext);


  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
        console.log("🔐 Iniciando login...");
        
        // 1. Obtener CSRF cookie
        await axios.get("/sanctum/csrf-cookie");
        console.log("✅ CSRF cookie obtenida");

        // 2. Esperar más tiempo
        await new Promise(resolve => setTimeout(resolve, 300));

        // 3. Enviar login
        const response = await axios.post("/api/login", form);
        console.log("✅ Login exitoso:", response.data);
        
        // 4. Actualizar contexto sin verificar inmediatamente
        login(response.data.usuario);

        setMessage("Login correcto ✅");
        
        // 5. Verificar cookies
        console.log("🍪 Cookies:", document.cookie);
        
        // 6. Redirigir CON RECARGA COMPLETA (importante)
        const from = location.state?.from || '/'; // ← Si viene de otra página, va ahí; sino a home
        setTimeout(() => {
            navigate(from, { replace: true }); // ← replace evita que quede el login en el historial
        }, 800);
        
    } catch (err) {
        console.error("❌ Error:", err);
        
        if (err.response?.status === 401) {
            setMessage("Credenciales incorrectas ❌");
        } else if (err.response?.status === 419) {
            setMessage("Error de sesión. Intenta de nuevo ❌");
        } else {
            setMessage("Error de login ❌");
        }
    }
};

  return (
    <>
      <div className="bg-gray-900 min-h-screen flex flex-col text-gray-300">
        <Header />

        <main className="flex-grow flex items-center justify-center px-6">
          <form
            onSubmit={handleSubmit}
            className="bg-white bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-xl max-w-md w-full"
          >
            <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8 uppercase tracking-wider">
              Iniciar Sesión
            </h2>

            {message && (
              <p
                className={`mb-6 p-3 rounded text-center font-semibold ${
                  message.includes("correcto") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="correo">
                Correo
              </label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="correo@ejemplo.com"
                value={form.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <div className="mb-7">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="pass">
                Contraseña
              </label>
              <input
                id="pass"
                name="pass"
                type="password"
                placeholder="********"
                value={form.pass}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg transition duration-200"
            >
              Entrar
            </button>
          </form>
        </main>

        <Footer />
      </div>
    </>
  );
}