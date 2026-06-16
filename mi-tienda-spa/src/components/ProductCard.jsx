import React from 'react';

export default function ProductCard({ product, onClick }) {
  return (
    <div className="product-card" onClick={onClick}>
      <img src={product.image} alt={product.title} className="card-image" />
      <div className="card-info">
        <h3>{product.title}</h3>
        <p className="price">{product.price}</p>
      </div>
    </div>
  );
}