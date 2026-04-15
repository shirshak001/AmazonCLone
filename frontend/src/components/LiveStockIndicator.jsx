import React from 'react';
import { useRealtime } from '../context/RealtimeContext';

export default function LiveStockIndicator({ productId, initialStock }) {
  const { stockUpdates } = useRealtime();
  
  const stockStatus = stockUpdates[productId];
  const currentStock = stockStatus?.stock || initialStock;
  const isLowStock = currentStock < 10;
  const isOutOfStock = currentStock === 0;

  return (
    <div className="live-stock-indicator">
      {isOutOfStock ? (
        <div className="stock-badge stock-out">
          Out of Stock
        </div>
      ) : isLowStock ? (
        <div className="stock-badge stock-low">
          Only {currentStock} left!
        </div>
      ) : (
        <div className="stock-badge stock-available">
          In Stock ({currentStock})
        </div>
      )}
      {stockStatus && (
        <span className="stock-live-indicator">
          <span className="live-dot"></span> Live
        </span>
      )}
    </div>
  );
}
