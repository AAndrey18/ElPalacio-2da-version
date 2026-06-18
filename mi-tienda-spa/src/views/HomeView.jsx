import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config'

export default function HomeView({ onSelectProduct }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error('Error al conectar con el servidor');
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false); //Quitar pantalla de carga
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-2xl font-bold text-[#526D82] animate-pulse">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="view-container animate-fade-in p-6">
      {/* Saludo personalizado si el usuario inició sesión */}
      {user && (
        <h2 className="text-2xl font-bold mb-6 text-[#27374D]">
          ¡Hola, {user.name}! Mira lo más nuevo:
        </h2>
      )}

      {products.length === 0 ? (
        <div className="text-center mt-10 p-8 bg-white rounded-xl shadow-sm text-[#27374D]">
          <p className="text-xl font-semibold">Aún no hay productos publicados.</p>
          <p className="text-[#526D82]">¡Sé el primero en vender algo!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 border border-[#DDE6ED]" 
              onClick={() => onSelectProduct(product)}
            >
              {/* Imagen del producto */}
              <img 
                src={product.imageUrl} 
                alt={product.title} 
                className="w-full h-48 object-cover border-b border-[#DDE6ED]" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Sin+Imagen" }} // Por si el enlace de la imagen falla
              />
              
              {/* Información del producto */}
              <div className="p-4 flex flex-col gap-2">
                <p className="text-xs text-[#9DB2BF] font-semibold truncate">
                  Vendido por: {product.seller?.name || 'Desconocido'}
                </p>
                <h3 className="font-bold text-lg text-[#27374D] truncate" title={product.title}>
                  {product.title}
                </h3>
                <p className="text-2xl font-black text-[#526D82]">
                  ${product.price} <span className="text-sm font-normal text-gray-500">MXN</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">📍 {product.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}