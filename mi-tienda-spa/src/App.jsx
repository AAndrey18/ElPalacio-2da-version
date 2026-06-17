import React, { useState } from 'react';
import { useAuth } from './context/AuthContext'; // Importar el contexto
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import DetailView from './views/DetailView';
import CheckoutView from './views/CheckoutView';
import LoginView from './views/LoginView';
import PublishView from './views/PublishView';
import CartView from './views/CartView';
import AddressesView from './views/AddressesView';
import PaymentsView from './views/PaymentsView';


export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const { user } = useAuth(); 

  //Métodos de navegación
  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const goToDetail = (product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
  };

  //arreglo carrito
  const handleAddToCart = (product) => {

  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    setCart(cart.map(item => 
      item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  } else {
    setCart([...cart, { ...product, quantity: 1 }]);
  }
  alert(`¡${product.title} agregado al carrito!`);
};

  // Vista principal
 

  return (
    <div className="app-container min-h-screen bg-[#DDE6ED]">
      {}
      <Navbar onNavigate={handleNavigate} />
      
      <main className="main-content max-w-7xl mx-auto py-8">
        {currentView === 'home' && <HomeView onSelectProduct={goToDetail}/>}
        
        {currentView === 'login' && <LoginView onNavigate={handleNavigate}/>}
        
        {currentView === 'detail' && (
          <DetailView 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
            onAddToCart={handleAddToCart} 
          />
        )}
        
        {currentView === 'checkout' && (
          <CheckoutView 
            cart={cart} 
            setCart={setCart} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'publish' && <PublishView onNavigate={handleNavigate} />}

        {currentView === 'cart' && (
          <CartView 
            cart={cart} 
            setCart={setCart} 
            onNavigate={handleNavigate} 
          />
        )}

        {currentView === 'addresses' && <AddressesView onNavigate={handleNavigate} />}

{currentView === 'payments' && <PaymentsView onNavigate={handleNavigate} />}
      </main>
    </div>
  );
}
