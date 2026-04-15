import React from 'react';

export default function OrderTracking({ order }) {
  const statuses = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const currentStatusIndex = statuses.indexOf(order?.status || 'Order Placed');

  const getStatusDate = (status, days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
  };

  return (
    <div className="order-tracking">
      <h3>Order Status: {order?.orderId}</h3>
      
      <div className="timeline">
        {statuses.map((status, index) => (
          <div 
            key={index}
            className={`timeline-item ${index <= currentStatusIndex ? 'completed' : ''} ${index === currentStatusIndex ? 'active' : ''}`}
          >
            <div className="timeline-dot">
              {index <= currentStatusIndex ? '✓' : index + 1}
            </div>
            <div className="timeline-content">
              <h5>{status}</h5>
              <p>{getStatusDate(status, index * 2)}</p>
            </div>
            {index < statuses.length - 1 && (
              <div className={`timeline-line ${index < currentStatusIndex ? 'completed' : ''}`} />
            )}
          </div>
        ))}
      </div>

      <div className="tracking-details">
        <div className="detail-box">
          <h4>Estimated Delivery</h4>
          <p>{getStatusDate('Delivered', 5)}</p>
        </div>
        <div className="detail-box">
          <h4>Tracking Number</h4>
          <p>{order?.orderId || 'N/A'}</p>
        </div>
        <div className="detail-box">
          <h4>Current Location</h4>
          <p>{order?.status === 'Delivered' ? 'Delivered' : 'In Transit'}</p>
        </div>
      </div>
    </div>
  );
}
