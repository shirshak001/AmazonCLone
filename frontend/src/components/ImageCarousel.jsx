import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ImageCarousel({ images = [] }) {
  const [main, setMain] = useState(0);

  if (!images.length) return (
    <div className="carousel-placeholder">
      <img 
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=450&fit=crop" 
        alt="Product"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );

  const prev = () => setMain(i => (i - 1 + images.length) % images.length);
  const next = () => setMain(i => (i + 1) % images.length);

  return (
    <div className="carousel">
      <div className="carousel-thumbs">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`thumb-${i}`}
            className={`carousel-thumb ${i === main ? 'active' : ''}`}
            onClick={() => setMain(i)}
          />
        ))}
      </div>
      <div className="carousel-main">
        {images.length > 1 && (
          <button className="carousel-btn left" onClick={prev}><FiChevronLeft /></button>
        )}
        <img src={images[main]} alt="product" className="carousel-img" />
        {images.length > 1 && (
          <button className="carousel-btn right" onClick={next}><FiChevronRight /></button>
        )}
      </div>
    </div>
  );
}
