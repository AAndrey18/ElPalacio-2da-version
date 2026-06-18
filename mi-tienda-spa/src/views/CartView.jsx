import React from 'react';
import API_BASE_URL from '../config'

export default function CartView({ cart, setCart, onNavigate }) {
  //Logica de simulacion
  
  //1. Calcular Subtotal
  const subtotal = cart.reduce((suma, item) => suma + (item.price * item.quantity), 0);
  
  // 2. Simular costo de envío (Envío gratis en compras mayores a $999)
  const shippingCost = subtotal > 999 || subtotal === 0 ? 0 : 150;
  
  // 3. Calcular Total final
  const total = subtotal + shippingCost;

  // 4. Simular fecha de entrega (Calcula entre 3 a 5 días desde "hoy")
  const getEstimatedDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 4); //suma 4 días promedio
    //Formato agradable
    return today.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  //Metodos de control
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  //Renderizado
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-[#27374D]">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">¡Descubre nuestros productos y encuentra lo que buscas!</p>
        <button 
          onClick={() => onNavigate('home')} 
          className="bg-[#526D82] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#27374D] transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in text-[#27374D]">
      <h2 className="text-3xl font-black mb-8 border-b pb-4">Carrito de Compras</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Lista de productos */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {cart.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-[#DDE6ED] flex flex-col sm:flex-row items-center gap-4">
              
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-24 h-24 object-cover rounded-lg border border-[#9DB2BF]"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Sin+Imagen" }}
              />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">Stock disponible: {item.stock}</p>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm font-bold mt-2 hover:underline"
                >
                  Eliminar
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-[#DDE6ED] font-bold text-[#27374D] hover:bg-[#9DB2BF]"
                >
                  -
                </button>
                <span className="font-semibold w-6 text-center">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock} // Evita que compren más de lo que hay
                  className="w-8 h-8 rounded-full bg-[#DDE6ED] font-bold text-[#27374D] hover:bg-[#9DB2BF] disabled:opacity-50"
                >
                  +
                </button>
              </div>

              <div className="text-right w-32">
                <p className="font-bold text-xl text-[#526D82]">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de compra */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-[#DDE6ED] sticky top-24">
            <h3 className="text-xl font-bold mb-4">Resumen de compra</h3>
            
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)} MXN</span>
            </div>
            
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Envío a domicilio:</span>
              {shippingCost === 0 ? (
                <span className="text-green-600 font-bold">¡Gratis!</span>
              ) : (
                <span>${shippingCost.toFixed(2)} MXN</span>
              )}
            </div>

            <div className="bg-[#DDE6ED] p-3 rounded-lg mb-6 text-sm">
              <span className="font-bold">🚚 Llega el:</span> {getEstimatedDate()} a Campeche y alrededores.
            </div>

            <div className="flex justify-between items-center border-t pt-4 mb-6">
              <span className="text-lg font-bold">Total a pagar:</span>
              <span className="text-2xl font-black text-[#526D82]">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => onNavigate('checkout')}
              className="w-full bg-[#526D82] text-white py-3 rounded-lg font-bold hover:bg-[#27374D] transition-all shadow-md hover:-translate-y-1"
            >
              Continuar compra
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}