import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useRealtime } from '../context/RealtimeContext';
import Navbar from '../components/Navbar';
import PaymentIntegration from '../components/PaymentIntegration';
import { placeOrderApi } from '../services/api';
import { FiLock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const INIT = { fullName: '', email: '', phone: '', street: '', city: '', state: '', pincode: '' };

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { addNotification } = useRealtime();
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const paymentRef = useRef(null);
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

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (items.length === 0) { toast.error('Cart is empty!'); return; }
    
    setLoading(true);
    try {
      // Create order in backend first
      const res = await placeOrderApi(form);
      const order = res.data.data;
      
      // Store order details for payment handling
      localStorage.setItem('pendingOrder', JSON.stringify({
        orderId: order.orderId,
        customerName: form.fullName,
        customerEmail: form.email,
        amount: Math.round(total),
        address: form
      }));
      
      // Show payment component
      setShowPayment(true);
      addNotification({
        type: 'info',
        title: 'Ready for Payment',
        message: 'Please complete payment to confirm your order',
      });
      
      setTimeout(() => paymentRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed. Please try again.');
      addNotification({
        type: 'warning',
        title: 'Order Failed',
        message: 'Unable to process your order. Please try again.',
      });
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
            <form onSubmit={handleProceedToPayment} noValidate>
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

              <button type="submit" className="btn-place-order" disabled={loading}>
                <FiLock size={14} /> {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
              <p className="order-terms">By proceeding, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.</p>
            </form>

            {/* Payment Integration Section */}
            {showPayment && (
              <div ref={paymentRef} className="payment-section">
                <hr style={{ margin: '32px 0', borderColor: '#d5d9d9' }} />
                <PaymentIntegration 
                  amount={total}
                  orderId={JSON.parse(localStorage.getItem('pendingOrder')).orderId}
                  customerName={form.fullName}
                  customerEmail={form.email}
                  onSuccess={async (paymentId) => {
                    await clearCart();
                    const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder'));
                    navigate(`/order-confirmation/${pendingOrder.orderId}?paymentId=${paymentId}`);
                  }}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="checkout-summary-box">
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
