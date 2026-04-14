import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../services/api';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id)
      .then(res => setOrder(res.data.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Spinner /></>;
  if (!order) return (
    <><Navbar />
    <div className="page-container">
      <p>Order not found. <Link to="/">Go to Home</Link></p>
    </div></>
  );

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="confirm-card">
          {/* Success Header */}
          <div className="confirm-header">
            <FiCheckCircle className="confirm-tick" size={64} />
            <h1 className="confirm-title">Order Placed Successfully!</h1>
            <p className="confirm-sub">Thank you, {order.address.fullName}! Your order has been confirmed.</p>
          </div>

          {/* Order ID + Delivery */}
          <div className="confirm-info">
            <div className="confirm-info-box">
              <p className="confirm-label">Order ID</p>
              <p className="confirm-value" id="order-id">{order.orderId}</p>
            </div>
            <div className="confirm-info-box">
              <p className="confirm-label">Estimated Delivery</p>
              <p className="confirm-value">{deliveryDate}</p>
            </div>
            <div className="confirm-info-box">
              <p className="confirm-label">Order Total</p>
              <p className="confirm-value">₹{order.total.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="confirm-steps">
            <div className="step active"><FiCheckCircle /><span>Order Confirmed</span></div>
            <div className="step-line"></div>
            <div className="step"><FiPackage /><span>Processing</span></div>
            <div className="step-line"></div>
            <div className="step"><FiTruck /><span>Shipped</span></div>
            <div className="step-line"></div>
            <div className="step"><FiHome /><span>Delivered</span></div>
          </div>

          {/* Delivery Address */}
          <div className="confirm-section">
            <h3>Delivering to:</h3>
            <p>{order.address.fullName}</p>
            <p>{order.address.street}, {order.address.city}</p>
            <p>{order.address.state} - {order.address.pincode}</p>
            <p>{order.address.phone}</p>
          </div>

          {/* Items */}
          <div className="confirm-section">
            <h3>Items in this order ({order.items.length})</h3>
            {order.items.map((item, i) => (
              <div key={i} className="confirm-item">
                <img src={item.image} alt={item.name} className="confirm-item-img" />
                <div>
                  <p className="confirm-item-name">{item.name}</p>
                  <p className="confirm-item-detail">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <p className="confirm-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>

          <div className="confirm-actions">
            <Link to="/" className="btn-continue-shop">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  );
}
