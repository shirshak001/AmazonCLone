import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMapPin, FiMenu, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar({ onSearch }) {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    else navigate(`/?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-amazon">amazon</span>
          <span className="logo-dot">.in</span>
        </Link>

        {/* Deliver to */}
        <div className="navbar-deliver">
          <FiMapPin size={14} />
          <div>
            <span className="deliver-label">Deliver to</span>
            <span className="deliver-location">India</span>
          </div>
        </div>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <select className="search-category">
            <option>All</option>
            <option>Electronics</option>
            <option>Books</option>
            <option>Clothing</option>
            <option>Home &amp; Kitchen</option>
            <option>Sports</option>
          </select>
          <input
            type="text"
            placeholder="Search Amazon.in"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            <FiSearch size={20} />
          </button>
        </form>

        {/* Auth Section (Login/Signup or User Menu) */}
        {user ? (
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="navbar-link">
              <span className="nav-label">Hello</span>
              <span className="nav-val">{user.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 10px',
                border: '1px solid transparent',
                borderRadius: '4px',
                background: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all .2s'
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = '#fff')}
              onMouseLeave={(e) => (e.target.style.borderColor = 'transparent')}
            >
              <FiLogOut size={14} />
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-link">
            <span className="nav-label">Hello, Sign in</span>
            <span className="nav-val">Account</span>
          </Link>
        )}

        {/* Returns */}
        <Link to="/orders" className="navbar-link">
          <span className="nav-label">Returns</span>
          <span className="nav-val">& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="navbar-cart">
          <div className="cart-icon-wrap">
            <FiShoppingCart size={26} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <span className="cart-label">Cart</span>
        </Link>
      </div>

      {/* Bottom nav bar */}
      <div className="navbar-bottom">
        <Link to="/" className="bottom-link"><FiMenu size={13} style={{verticalAlign:'middle',marginRight:4}} /> All</Link>
        <Link to="/?category=Electronics" className="bottom-link">Electronics</Link>
        <Link to="/?category=Books" className="bottom-link">Books</Link>
        <Link to="/?category=Clothing" className="bottom-link">Clothing</Link>
        <Link to="/?category=Home+%26+Kitchen" className="bottom-link">Home &amp; Kitchen</Link>
        <Link to="/?category=Sports" className="bottom-link">Sports</Link>
        <span className="bottom-link hot">Today's Deals</span>
        <span className="bottom-link">Customer Service</span>
      </div>
    </nav>
  );
}
