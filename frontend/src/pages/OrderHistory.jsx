import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      toast.error('Please login to view orders');
      navigate('/login');
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // For now, fetch orders from session
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <FiClock color="#FF9900" size={20} />;
      case 'confirmed':
        return <FiPackage color="#007600" size={20} />;
      case 'shipped':
        return <FiTruck color="#0066c0" size={20} />;
      case 'delivered':
        return <FiCheckCircle color="#007600" size={20} />;
      default:
        return <FiClock size={20} />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Spinner />;

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="orders-header">
          <h1 className="page-title">Your Orders</h1>
          <p className="page-subtitle">Track your purchases and manage returns</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">[ No Orders ]</div>
            <h2>No Orders Yet</h2>
            <p>You haven't placed any orders yet. Start shopping!</p>
            <button className="btn-primary" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span className="status-text">{order.status.toUpperCase()}</span>
                    </div>
                    <div className="order-details">
                      <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                      <p className="order-date">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="order-total">
                    <span className="order-amount">₹{order.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="order-items">
                  <div className="items-header">
                    <span className="items-label">Items ({order.items.length})</span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="item-image" />
                      )}
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Quantity: {item.quantity}</p>
                      </div>
                      <div className="item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="delivery-address">
                    <span className="label">Delivering to:</span>
                    <p className="address">
                      {order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.pincode}
                    </p>
                  </div>
                  <button className="btn-order-details" onClick={() => navigate(`/order-confirmation/${order.id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
