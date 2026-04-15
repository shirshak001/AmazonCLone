import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard({ orders = [], products = [] }) {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalProducts = products.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get recent orders
  const recentOrders = orders.slice(-10).reverse();

  // Monthly revenue data (mock)
  const monthlyData = [
    { month: 'Jan', revenue: 25000 },
    { month: 'Feb', revenue: 35000 },
    { month: 'Mar', revenue: 45000 },
    { month: 'Apr', revenue: totalRevenue },
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={() => navigate('/admin/add-product')} className="btn-primary">
          + Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Orders</h4>
          <p className="stat-value">{totalOrders}</p>
          <span className="stat-label">Orders placed</span>
        </div>
        <div className="stat-card">
          <h4>Total Revenue</h4>
          <p className="stat-value">₹{totalRevenue.toLocaleString()}</p>
          <span className="stat-label">From all orders</span>
        </div>
        <div className="stat-card">
          <h4>Average Order</h4>
          <p className="stat-value">₹{Math.round(averageOrderValue).toLocaleString()}</p>
          <span className="stat-label">Per order</span>
        </div>
        <div className="stat-card">
          <h4>Total Products</h4>
          <p className="stat-value">{totalProducts}</p>
          <span className="stat-label">In catalog</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="admin-section">
          <h3>Revenue Chart</h3>
          <div className="chart-container">
            <div className="simple-bar-chart">
              {monthlyData.map((item, idx) => (
                <div key={idx} className="bar-group">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(item.revenue / maxRevenue) * 200}px`,
                      background: 'linear-gradient(135deg, #ff9900, #ffb01b)'
                    }}
                  />
                  <span className="bar-label">{item.month}</span>
                  <span className="bar-value">₹{(item.revenue / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-section">
          <h3>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No orders yet</td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order._id || order.id}>
                    <td>{(order._id || order.id).slice(-8)}</td>
                    <td>{order.userId?.name || 'Customer'}</td>
                    <td>₹{order.total?.toLocaleString() || 0}</td>
                    <td>
                      <span className={`badge badge-${order.status || 'pending'}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="admin-section">
          <h3>Products</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No products</td></tr>
              ) : (
                products.slice(0, 10).map(product => (
                  <tr key={product._id || product.id}>
                    <td>{product.name?.slice(0, 30)}...</td>
                    <td>{product.category}</td>
                    <td>₹{product.price?.toLocaleString()}</td>
                    <td>{product.stock || 'N/A'}</td>
                    <td>{product.rating || 0}★</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
