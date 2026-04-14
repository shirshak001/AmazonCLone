import React from 'react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-back-to-top" onClick={scrollToTop}>
        Back to top
      </div>
      
      <div className="footer-links">
        <div className="footer-column">
          <h3>Get to Know Us</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press Releases</li>
            <li>Amazon Science</li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Connect with Us</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Make Money with Us</h3>
          <ul>
            <li>Sell on Amazon</li>
            <li>Sell under Amazon Accelerator</li>
            <li>Protect and Build Your Brand</li>
            <li>Amazon Global Selling</li>
            <li>Become an Affiliate</li>
            <li>Fulfilment by Amazon</li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3>Let Us Help You</h3>
          <ul>
            <li>COVID-19 and Amazon</li>
            <li>Your Account</li>
            <li>Returns Centre</li>
            <li>100% Purchase Protection</li>
            <li>Amazon App Download</li>
            <li>Help</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-logo">
          <span className="logo-amazon">amazon</span>
          <span className="logo-dot">.in</span>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2026, Amazon Clone Project, Built by Shirshak. SDE Intern Assignment.</p>
        </div>
      </div>
    </footer>
  );
}
