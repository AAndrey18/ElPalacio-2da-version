import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#27374D] text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Logo y Nombre */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="bg-[#526D82] p-2 rounded text-sm font-bold">LOGO</div>
          <h1 className="text-xl font-semibold">El Palacio</h1>
        </div>

        {/* Búsqueda (Renderiza diferente según el rol) */}
        {user?.role !== 'seller' && (
          <div className="w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              className="w-full px-4 py-2 rounded-full text-[#27374D] focus:outline-none focus:ring-2 focus:ring-[#9DB2BF] transition-all"
            />
          </div>
        )}

        {/* Menú de Navegación Condicional */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {!user ? (
            <button onClick={() => onNavigate('login')} className="hover:text-[#9DB2BF] transition-colors">
              Iniciar Sesión
            </button>
          ) : (
            <>
              {user.role === 'buyer' && (
                <>
                  <button onClick={() => onNavigate('purchases')} className="hover:text-[#9DB2BF]">Mis Compras</button>
                  <button onClick={() => onNavigate('cart')} className="hover:text-[#9DB2BF]">🛒 Carrito</button>
                </>
              )}
              
              {user.role === 'seller' && (
                <>
                  <button onClick={() => onNavigate('dashboard')} className="hover:text-[#9DB2BF]">Mis Ventas</button>
                  <button onClick={() => onNavigate('publish')} className="bg-[#526D82] px-4 py-2 rounded-lg hover:bg-[#9DB2BF] hover:text-[#27374D] transition-all">
                    Publicar Producto
                  </button>
                </>
              )}

              {/* Cuenta Dropdown / Botón */}
              <div className="relative group">
                <button className="flex items-center gap-2 hover:text-[#9DB2BF]">
                  Mi Cuenta ⚙️
                </button>
                {/* Menú desplegable */}
                <div className="absolute right-0 mt-2 w-48 bg-white text-[#27374D] rounded-lg shadow-xl hidden group-hover:block overflow-hidden">
                  {user.role === 'buyer' && (
                    <>
                      <button onClick={() => onNavigate('addresses')} className="block w-full text-left px-4 py-2 hover:bg-[#DDE6ED]">Mis Direcciones</button>
                      <button onClick={() => onNavigate('payments')} className="block w-full text-left px-4 py-2 hover:bg-[#DDE6ED]">Métodos de Pago</button>
                    </>
                  )}
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Cerrar Sesión</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
