import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config'

export default function CheckoutView({ cart = [], setCart, onNavigate }) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  //Simulación de listas 
  const savedAddresses = []; 
  const savedPayments = [];

  //Mismos totales que el carrito
  const subtotal = cart.reduce((suma, item) => suma + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 999 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shippingCost;

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    
    setTimeout(() => {
      alert("¡Pago procesado con éxito usando tarjeta de prueba! Tu pedido está en camino a Campeche.");
      setCart([]); 
      setIsProcessing(false);
      onNavigate('home'); 
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20 text-[#27374D]">
        <h2 className="text-2xl font-bold">No hay nada que pagar</h2>
        <button onClick={() => onNavigate('home')} className="mt-4 text-[#526D82] underline font-bold">Volver al catálogo</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8 text-[#27374D] animate-fade-in">
      <h2 className="text-2xl font-black mb-6 border-b-2 border-[#DDE6ED] pb-2">Finalizar Compra</h2>
      
      <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Formularios de Dirección y Pago */}
        <div className="space-y-6">
          <section className="bg-[#f8fafc] p-4 rounded-lg border border-[#DDE6ED]">
            <h3 className="font-bold text-lg mb-3">1. Dirección de Entrega</h3>
            <select className="w-full p-3 rounded border border-[#9DB2BF] bg-white focus:outline-none focus:ring-2 focus:ring-[#526D82]" required>
              <option value="">Selecciona una dirección...</option>
              {savedAddresses.map(addr => (
                <option key={addr.id} value={addr.id}>{addr.street}</option>
              ))}
              <option value="new">+ Agregar nueva dirección (Simulada)</option>
            </select>
          </section>

          <section className="bg-[#f8fafc] p-4 rounded-lg border border-[#DDE6ED]">
            <h3 className="font-bold text-lg mb-3">2. Método de Pago</h3>
            <select className="w-full p-3 rounded border border-[#9DB2BF] bg-white focus:outline-none focus:ring-2 focus:ring-[#526D82]" required>
              <option value="">Selecciona tu tarjeta...</option>
              {savedPayments.map(pay => (
                <option key={pay.id} value={pay.id}>{pay.cardBrand} terminada en {pay.cardLastFour}</option>
              ))}
              <option value="new">+ Ingresar tarjeta ficticia de prueba</option>
            </select>
          </section>
        </div>

        {/* Resumen de Compra */}
        <div className="bg-[#DDE6ED] p-6 rounded-lg h-fit shadow-inner">
          <h3 className="font-black text-xl mb-4 text-[#27374D]">Resumen del Pedido</h3>
          
          <div className="space-y-3 mb-4 border-b border-[#9DB2BF] pb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm font-medium">
                <span className="truncate w-2/3">{item.quantity}x {item.title}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-sm mb-2 text-gray-600 font-semibold">
            <span>Envío:</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-black text-2xl mb-6 text-[#27374D]">
            <span>Total:</span>
            <span>${total.toFixed(2)} MXN</span>
          </div>
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-[#526D82] text-white py-3 rounded-lg font-bold hover:bg-[#27374D] hover:-translate-y-1 transition-all shadow-lg disabled:opacity-50"
          >
            {isProcessing ? 'Procesando pago seguro...' : 'Confirmar y Pagar'}
          </button>
        </div>
      </form>
    </div>
  );
}