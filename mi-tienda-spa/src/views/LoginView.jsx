import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config'

export default function LoginView({ onNavigate }) {
  const { login } = useAuth();
  
  // Estados del formulario
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer'
  });
  const [error, setError] = useState(null);

  // Manejar escritura en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Función para "enviar"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = isRegistering 
      ? `${API_BASE_URL}/api/register` 
      : `${API_BASE_URL}/api/login`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocurrió un error");
      }

      if (isRegistering) {
        alert("¡Registro exitoso! Ahora iniciamos tu sesión.");
        login(data.user);
        onNavigate('home');
      } else {
        // Si es login exitoso
        login(data);
        onNavigate('home');
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-[#27374D]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Crear una cuenta' : 'Iniciar Sesión'}
        </h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* rol y nombre usuarios registrados */}
          {isRegistering && (
            <>
              <input 
                type="text" name="name" placeholder="Tu nombre completo" required
                value={formData.name} onChange={handleChange}
                className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
              />
              <select 
                name="role" value={formData.role} onChange={handleChange}
                className="p-3 rounded border border-[#9DB2BF] bg-white focus:outline-none"
              >
                <option value="buyer">Quiero ser Comprador</option>
                <option value="seller">Quiero ser Vendedor</option>
              </select>
            </>
          )}

          <input 
            type="email" name="email" placeholder="Correo electrónico" required
            value={formData.email} onChange={handleChange}
            className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
          />
          <input 
            type="password" name="password" placeholder="Contraseña" required
            value={formData.password} onChange={handleChange}
            className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
          />

          <button 
            type="submit" 
            className="bg-[#526D82] text-white p-3 rounded-lg hover:bg-[#27374D] transition-all font-bold mt-2"
          >
            {isRegistering ? 'Registrarme' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[#526D82] font-bold ml-2 hover:underline"
          >
            {isRegistering ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </div>
  );
}