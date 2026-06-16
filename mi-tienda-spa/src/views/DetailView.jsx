import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DetailView({ product, onNavigate, onAddToCart }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', reviewImageUrl: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar reseñas cuando se abre el producto
  useEffect(() => {
    if (!product) return;
    fetch(`http://localhost:3001/api/products/${product.id}/reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error(err));
  }, [product]);

  if (!product) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReview,
          productId: product.id,
          buyerId: user.id
        })
      });
      if (!response.ok) throw new Error("Error al publicar");
      
      // Recargar reseñas
      const updatedReviews = await fetch(`http://localhost:3001/api/products/${product.id}/reviews`).then(res => res.json());
      setReviews(updatedReviews);
      setNewReview({ rating: 5, comment: '', reviewImageUrl: '' }); // Limpiar formulario
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    onAddToCart(product);
    onNavigate('checkout');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 animate-fade-in text-[#27374D]">
      <button onClick={() => onNavigate('home')} className="mb-4 text-[#526D82] font-bold hover:underline">
        &larr; Volver al catálogo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-md mb-8">
        {/* Imagen */}
        <div>
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-96 object-cover rounded-lg border border-[#DDE6ED]" 
            onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Sin+Imagen" }}
          />
        </div>

        {/* Información y Compra */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-black mb-2">{product.title}</h1>
            <p className="text-sm text-gray-500 mb-4">Ubicación de origen: {product.location}</p>
            <p className="text-4xl font-bold text-[#526D82] mb-6">${product.price} <span className="text-lg">MXN</span></p>
            
            <div className="bg-[#f8fafc] p-4 rounded-lg border border-[#DDE6ED] mb-6">
              <h3 className="font-bold mb-2">Descripción del producto</h3>
              <p className="whitespace-pre-line text-gray-700">{product.description}</p>
            </div>
            
            <p className="font-semibold text-sm mb-6">
              Disponibles: <span className="text-[#526D82]">{product.stock} unidades</span>
            </p>
          </div>

          {/* Botones de acción */}
          {user?.role === 'buyer' ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full py-3 rounded-lg font-bold border-2 border-[#526D82] text-[#526D82] hover:bg-[#DDE6ED] transition-colors"
              >
                Agregar al carrito
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full py-3 rounded-lg font-bold bg-[#526D82] text-white hover:bg-[#27374D] shadow-lg hover:-translate-y-1 transition-all"
              >
                Comprar ahora
              </button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-center">
              Debes iniciar sesión como <strong>Comprador</strong> para adquirir productos.
            </div>
          )}
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Calificaciones del producto</h2>
        
        {/* Formulario de Reseña (compradores logueados) */}
        {user?.role === 'buyer' && (
          <form onSubmit={handleReviewSubmit} className="mb-8 bg-[#DDE6ED] p-4 rounded-lg flex flex-col gap-3">
            <h4 className="font-bold">Escribir una reseña</h4>
            <div className="flex gap-4 items-center">
              <label className="text-sm font-semibold">Calificación:</label>
              <select 
                value={newReview.rating} 
                onChange={(e) => setNewReview({...newReview, rating: e.target.value})}
                className="p-2 rounded border border-[#9DB2BF]"
              >
                {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Estrellas</option>)}
              </select>
            </div>
            <textarea 
              required placeholder="¿Qué te pareció el producto?" rows="2"
              value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              className="p-2 rounded border border-[#9DB2BF] resize-none"
            ></textarea>
            <input 
              type="url" placeholder="Enlace de foto del producto (Opcional)"
              value={newReview.reviewImageUrl} onChange={(e) => setNewReview({...newReview, reviewImageUrl: e.target.value})}
              className="p-2 rounded border border-[#9DB2BF]"
            />
            <button type="submit" disabled={isSubmitting} className="self-end bg-[#526D82] text-white px-6 py-2 rounded-lg font-bold">
              {isSubmitting ? 'Subiendo...' : 'Publicar reseña'}
            </button>
          </form>
        )}

        {/* Lista de Reseñas */}
        <div className="flex flex-col gap-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">Aún no hay reseñas. ¡Sé el primero en calificar!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border border-[#DDE6ED] p-4 rounded-lg flex gap-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">{review.buyer?.name}</span>
                    <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
                {review.reviewImageUrl && (
                  <img src={review.reviewImageUrl} alt="Review" className="w-24 h-24 object-cover rounded border border-[#9DB2BF]" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}