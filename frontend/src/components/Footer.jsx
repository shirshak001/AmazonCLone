import React, { useState } from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Newsletter subscription for ${email} coming soon!`);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      {/* Back to Top Button */}
      <button className="footer-back-to-top" onClick={scrollToTop}>
        ↑ Back to Top
      </button>

      {/* Main Footer Content */}
      <div className="footer-main">
        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to get special offers and updates</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>

        {/* Footer Links Grid */}
        <div className="footer-links">
          <div className="footer-column">
            <h3>Get to Know Us</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press Releases</a></li>
              <li><a href="#science">Amazon Science</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Connect with Us</h3>
            <ul>
              <li><a href="#facebook">🌐 Facebook</a></li>
              <li><a href="#twitter">🐦 Twitter</a></li>
              <li><a href="#instagram">📷 Instagram</a></li>
              <li><a href="#linkedin">💼 LinkedIn</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Make Money with Us</h3>
            <ul>
              <li><a href="#sell">Sell on Amazon</a></li>
              <li><a href="#accelerator">Amazon Accelerator</a></li>
              <li><a href="#brand">Build Your Brand</a></li>
              <li><a href="#affiliate">Become an Affiliate</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Let Us Help You</h3>
            <ul>
              <li><a href="#account">Your Account</a></li>
              <li><a href="#returns">Returns Centre</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-logo">
              <span className="logo-amazon">amazon</span>
              <span className="logo-dot">🛒</span>
            </div>
            <p className="footer-copyright">
              © 2026 Amazon Clone. Built with ❤️ by Shirshak.
            </p>
            <div className="footer-links-bottom">
              <a href="#privacy">Privacy Policy</a>
              <span>•</span>
              <a href="#terms">Terms of Service</a>
              <span>•</span>
              <a href="#cookies">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
