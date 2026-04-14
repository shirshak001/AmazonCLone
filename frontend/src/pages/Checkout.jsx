import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { placeOrderApi } from '../services/api';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const INIT = { fullName: '', email: '', phone: '', street: '', city: '', state: '', pincode: '' };

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const items = cart?.items || [];
  const shipping = cartTotal > 499 ? 0 : 40;
  const total = cartTotal + shipping;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.match(/^[\w-.]+@[\w-]+\.\w+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^\d{10}$/)) e.phone = '10-digit phone required';
    if (!form.street.trim()) e.street = 'Street address required';
    if (!form.city.trim()) e.city = 'City required';
    if (!form.state.trim()) e.state = 'State required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = '6-digit pincode required';
    return e;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (items.length === 0) { toast.error('Cart is empty!'); return; }
    setLoading(true);
    try {
      const res = await placeOrderApi(form);
      const order = res.data.data;
      await clearCart();
      navigate(`/order/${order.orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="checkout-layout">
          {/* Form */}
          <div className="checkout-form-card">
            <h2 className="checkout-heading">Shipping Address</h2>
            <form onSubmit={handleSubmit} noValidate>
              {[
                { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit mobile number' },
                { name: 'street', label: 'Street Address', type: 'text', placeholder: 'House No., Street, Area' },
                { name: 'city', label: 'City', type: 'text', placeholder: 'Mumbai' },
                { name: 'state', label: 'State', type: 'text', placeholder: 'Maharashtra' },
                { name: 'pincode', label: 'PIN Code', type: 'text', placeholder: '400001' },
              ].map(field => (
                <div key={field.name} className="form-group">
                  <label className="form-label" htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={handleChange}
                    className={`form-input ${errors[field.name] ? 'input-error' : ''}`}
                  />
                  {errors[field.name] && <span className="error-msg">{errors[field.name]}</span>}
                </div>
              ))}

              <button type="submit" className="btn-place-order" disabled={loading} id="btn-place-order">
                <FiLock size={14} /> {loading ? 'Placing Order...' : 'Place your order'}
              </button>
              <p className="order-terms">By placing your order, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.</p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-box">
              <button type="submit" form="checkout-form" className="btn-place-order" onClick={handleSubmit} disabled={loading} id="btn-place-order-sidebar">
                <FiLock size={14} /> {loading ? 'Placing Order...' : 'Place your order'}
              </button>
              <p className="checkout-terms-mini">By placing your order, you agree to our terms.</p>
              <hr />
              <h3 className="checkout-summary-title">Order Summary</h3>
              <div className="summary-row"><span>Items ({items.reduce((s,i)=>s+i.quantity,0)})</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{color:'#007600'}}>FREE</span> : `₹${shipping}`}</span></div>
              <hr />
              <div className="summary-row total-row">
                <strong>Order Total</strong>
                <strong className="summary-total-price">₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <hr />
              <h3 className="checkout-summary-title">Order Items</h3>
              {items.map(item => {
                const p = item.productId;
                if (!p) return null;
                return (
                  <div key={p._id || p.id} className="checkout-item">
                    <img src={p.images?.[0]} alt={p.name} className="checkout-item-img" />
                    <div>
                      <p className="checkout-item-name">{p.name?.slice(0,50)}...</p>
                      <p className="checkout-item-qty">Qty: {item.quantity}</p>
                      <p className="checkout-item-price">₹{(p.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
