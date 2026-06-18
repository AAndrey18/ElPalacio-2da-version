import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';


export default function PublishView({ onNavigate }) {
  const { user } = useAuth(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    location: '',
    imageUrl: ''
  });

  // evitar compras sin rol
  if (!user || user.role !== 'seller') {
    return (
      <div className="text-center mt-20 text-[#27374D]">
        <h2 className="text-2xl font-bold">Acceso Denegado</h2>
        <p>Solo los vendedores registrados pueden publicar productos.</p>
        <button onClick={() => onNavigate('home')} className="mt-4 text-[#526D82] underline">Volver al inicio</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      //envia los datos al backend
      const response = await fetch(`http://localhost:3001/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sellerId: user.id 
        }),
      });

      if (!response.ok) throw new Error('Error al publicar');

      alert("¡Producto publicado con éxito!");
      onNavigate('dashboard'); 

    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 animate-fade-in text-[#27374D]">
      <h2 className="text-3xl font-bold mb-6 border-b-2 border-[#DDE6ED] pb-4">Publicar un nuevo producto</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Título y Precio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-[#526D82]">Título del producto *</label>
            <input 
              type="text" name="title" required value={formData.title} onChange={handleChange}
              placeholder="Ej. Mouse Logitech G502"
              className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-[#526D82]">Precio (MXN) *</label>
            <input 
              type="number" name="price" step="0.01" required value={formData.price} onChange={handleChange}
              placeholder="Ej. 1200.50"
              className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-[#526D82]">Descripción detallada *</label>
          <textarea 
            name="description" required rows="4" value={formData.description} onChange={handleChange}
            placeholder="Describe las características principales..."
            className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82] resize-none"
          ></textarea>
        </div>

        {/* Stock y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-[#526D82]">Unidades disponibles (Stock) *</label>
            <input 
              type="number" name="stock" required value={formData.stock} onChange={handleChange}
              placeholder="Ej. 15"
              className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-[#526D82]">Ubicación de origen *</label>
            <input 
              type="text" name="location" required value={formData.location} onChange={handleChange}
              placeholder="Ej. Campeche, México"
              className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
            />
          </div>
        </div>

        {/* URL de la Imagen */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm text-[#526D82]">Enlace de la imagen (URL)</label>
          <input 
            type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
            placeholder="https://ejemplo.com/foto-producto.jpg"
            className="p-3 rounded border border-[#9DB2BF] focus:outline-none focus:ring-2 focus:ring-[#526D82]"
          />
          <span className="text-xs text-gray-500">Pega un enlace directo a una imagen. Si lo dejas vacío, se usará una imagen por defecto.</span>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-4 border-t-2 border-[#DDE6ED] pt-6">
          <button 
            type="button" onClick={() => onNavigate('home')}
            className="px-6 py-2 rounded-lg text-[#526D82] font-bold border-2 border-[#526D82] hover:bg-[#DDE6ED] transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" disabled={isSubmitting}
            className="px-6 py-2 rounded-lg text-white font-bold bg-[#526D82] hover:bg-[#27374D] hover:-translate-y-1 transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Producto'}
          </button>
        </div>

      </form>
    </div>
  );
}