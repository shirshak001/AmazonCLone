import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiSearch, FiMapPin, FiMenu } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar({ onSearch }) {
  const { cartCount } = useCart();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    else navigate(`/?search=${encodeURIComponent(query)}`);
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

        {/* Returns */}
        <div className="navbar-link">
          <span className="nav-label">Returns</span>
          <span className="nav-val">& Orders</span>
        </div>

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
