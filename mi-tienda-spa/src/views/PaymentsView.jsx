import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function PaymentsView({ onNavigate }) {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Datos completos para la simulación visual
  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardBrand: 'Visa' 
  });

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/users/${user.id}/payments`)
        .then(res => res.json())
        .then(data => setPayments(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  // Detector simple de marca de tarjeta
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    let brand = 'Visa';
    if (value.startsWith('5')) brand = 'MasterCard';
    if (value.startsWith('3')) brand = 'Amex';
    setFormData({ ...formData, cardNumber: value, cardBrand: brand });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // enviar cardNumber y cardBrand (Seguridad simulada)
      const response = await fetch('http://localhost:3001/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          cardNumber: formData.cardNumber, 
          cardBrand: formData.cardBrand 
        })
      });
      
      if (!response.ok) throw new Error('Error al guardar tarjeta');
      
      const newPayment = await response.json();
      setPayments([...payments, newPayment]);
      setFormData({ cardHolder: '', cardNumber: '', expiry: '', cvv: '', cardBrand: 'Visa' });
      alert("Tarjeta guardada de forma segura");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in text-[#27374D]">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-3xl font-black">Métodos de Pago</h2>
        <button onClick={() => onNavigate('home')} className="text-[#526D82] font-bold hover:underline">Volver</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Formulario */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#DDE6ED] h-fit">
          <h3 className="text-xl font-bold mb-4">Añadir nueva tarjeta</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <input required type="text" placeholder="Nombre en la tarjeta" 
              value={formData.cardHolder} onChange={(e) => setFormData({...formData, cardHolder: e.target.value})}
              className="p-3 rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
            
            <div className="relative">
              <input required type="text" placeholder="Número de tarjeta (16 dígitos)" maxLength="16"
                value={formData.cardNumber} onChange={handleCardNumberChange}
                className="p-3 w-full rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
              <span className="absolute right-3 top-3 font-bold text-gray-400 italic">{formData.cardBrand}</span>
            </div>

            <div className="flex gap-4">
              <input required type="text" placeholder="MM/AA" maxLength="5"
                value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                className="p-3 w-1/2 rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
              
              <input required type="password" placeholder="CVV" maxLength="4"
                value={formData.cvv} onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                className="p-3 w-1/2 rounded border focus:ring-2 focus:ring-[#526D82] outline-none" />
            </div>

            <p className="text-xs text-gray-500 italic">Los datos de expiración y CVV se utilizan para validación pero no se almacenan en nuestros servidores.</p>
            
            <button type="submit" disabled={isSubmitting} className="bg-[#526D82] text-white py-3 rounded font-bold hover:bg-[#27374D] transition-colors mt-2">
              {isSubmitting ? 'Guardando...' : 'Guardar Tarjeta'}
            </button>
          </form>
        </div>

        {/* Lista de Tarjetas */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-bold mb-2">Tarjetas guardadas</h3>
          {payments.length === 0 ? (
            <p className="text-gray-500 italic">No tienes métodos de pago guardados.</p>
          ) : (
            payments.map(pay => (
              <div key={pay.id} className="bg-[#27374D] text-white p-5 rounded-xl shadow-md border border-[#526D82] flex justify-between items-center">
                <div>
                  <p className="font-black text-lg">{pay.cardBrand}</p>
                  <p className="tracking-widest mt-2">{pay.cardNumber}</p>
                </div>
                <div className="text-2xl opacity-50">💳</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}