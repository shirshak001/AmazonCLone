import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { FiTrash2, FiPlus, FiMinus, FiCheckCircle, FiHeart } from 'react-icons/fi';
import { BsFillStarFill } from 'react-icons/bs';

export default function Cart() {
  const { cart, cartTotal, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];
  const shipping = cartTotal > 499 ? 0 : 40;
  const total = cartTotal + shipping;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="page-container empty-cart">
          <div className="empty-cart-box">
            <img src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB445243794_.svg" alt="empty cart" className="empty-cart-img" />
            <h2>Your Amazon Cart is empty</h2>
            <p>Your shopping cart lives here. Start shopping!</p>
            <Link to="/" className="btn-continue">Continue Shopping</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            <h2 className="cart-title">Shopping Cart</h2>
            <div className="cart-price-header">Price</div>
            <hr />
            {items.map(item => {
              const p = item.productId;
              if (!p) return null;
              const pid = p._id || p.id;
              return (
                <div key={pid} className="cart-item">
                  <img src={p.images?.[0]} alt={p.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <Link to={`/product/${pid}`} className="cart-item-name">{p.name}</Link>
                    <p className="cart-item-stock" style={{ color: '#007600' }}>In Stock</p>
                    {p.price > 499 && <p className="cart-item-delivery">FREE Delivery</p>}

                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button onClick={() => updateQty(pid, item.quantity - 1)} className="qty-btn" disabled={item.quantity <= 1}>
                          <FiMinus size={12} />
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button onClick={() => updateQty(pid, item.quantity + 1)} className="qty-btn">
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <span className="cart-divider">|</span>
                      <button onClick={() => removeItem(pid)} className="cart-delete">
                        <FiTrash2 size={14} /> Delete
                      </button>
                      <span className="cart-divider">|</span>
                      <button className="cart-wishlist">Save for later</button>
                    </div>
                  </div>
                  <div className="cart-item-price">₹{(p.price * item.quantity).toLocaleString('en-IN')}</div>
                </div>
              );
            })}
            <hr />
            <div className="cart-subtotal-right">
              Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items): <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary">
            <div className="cart-summary-box">
              <p className="cart-summary-free"><FiCheckCircle size={14} style={{verticalAlign:'middle',marginRight:5,color:'#007600'}} /> Your order qualifies for FREE Delivery</p>
              <div className="cart-summary-row">
                <span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{color:'#007600'}}>FREE</span> : `₹${shipping}`}</span>
              </div>
              <hr />
              <div className="cart-summary-row total">
                <strong>Order Total</strong>
                <strong>₹{total.toLocaleString('en-IN')}</strong>
              </div>
              <button className="btn-checkout" onClick={() => navigate('/checkout')} id="btn-proceed-checkout">
                Proceed to Checkout ({items.reduce((s,i)=>s+i.quantity,0)} items)
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
