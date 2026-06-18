import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';


export default function AddressesView({ onNavigate }) {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({ street: '', colony: '', zipCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE_URL}/api/users/${user.id}/addresses`)
        .then(res => res.json())
        .then(data => setAddresses(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: user.id })
      });
      if (!response.ok) throw new Error('Error al guardar');
      
      const newAddress = await response.json();
      setAddresses([...addresses, newAddress]); 
      setFormData({ street: '', colony: '', zipCode: '' });
      alert("Dirección guardada exitosamente");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in text-[#27374D]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-black">Mis Direcciones</h2>
        <button onClick={() => onNavigate('home')} className="text-[#526D82] font-bold hover:underline">Volver</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#DDE6ED] h-fit">
          <h3 className="text-xl font-bold mb-4">Agregar nueva dirección</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input required type="text" placeholder="Calle y número exterior/interior" 
              value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})}
              className="p-3 rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
            
            <input required type="text" placeholder="Colonia" 
              value={formData.colony} onChange={(e) => setFormData({...formData, colony: e.target.value})}
              className="p-3 rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
            
            <input required type="text" placeholder="Código Postal (Ej. 24000)" maxLength="5"
              value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              className="p-3 rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
            
            <button type="submit" disabled={isSubmitting} className="bg-[#526D82] text-white py-3 rounded font-bold hover:bg-[#27374D] transition-colors">
              {isSubmitting ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </form>
        </div>

        {/* Lista de Direcciones */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-2">Direcciones guardadas</h3>
          {addresses.length === 0 ? (
            <p className="text-gray-500 italic">No tienes direcciones guardadas.</p>
          ) : (
            addresses.map(addr => (
              <div key={addr.id} className="bg-white p-4 rounded-xl shadow-sm border border-[#DDE6ED]">
                <p className="font-bold">{addr.street}</p>
                <p className="text-sm text-gray-600">Colonia: {addr.colony}</p>
                <p className="text-sm text-gray-600">CP: {addr.zipCode}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}