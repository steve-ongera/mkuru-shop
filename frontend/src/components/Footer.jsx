import { Link } from 'react-router-dom';
import '../Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* NewsLetter Section */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <i className="fas fa-envelope-open-text"></i>
              <div>
                <h3>Subscribe to our newsletter</h3>
                <p>Get the latest updates on new products and upcoming sales</p>
              </div>
            </div>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-col company-info">
              <div className="footer-logo">
                <span className="logo-text">Mkuru</span>
                <span className="logo-shop">Shop</span>
              </div>
              <p className="company-desc">
                Your one-stop shop for quality products at affordable prices. 
                We offer a wide range of products with fast delivery across the country.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/products">
                    <i className="fas fa-chevron-right"></i>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/orders">
                    <i className="fas fa-chevron-right"></i>
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart">
                    <i className="fas fa-chevron-right"></i>
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist">
                    <i className="fas fa-chevron-right"></i>
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-col">
              <h4>Customer Service</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/help">
                    <i className="fas fa-chevron-right"></i>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/faq">
                    <i className="fas fa-chevron-right"></i>
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/returns">
                    <i className="fas fa-chevron-right"></i>
                    Returns Policy
                  </Link>
                </li>
                <li>
                  <Link to="/shipping">
                    <i className="fas fa-chevron-right"></i>
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="fas fa-chevron-right"></i>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-col">
              <h4>Contact Us</h4>
              <ul className="contact-info">
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Business Street, Nairobi, Kenya</span>
                </li>
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <span>+254 712 345 678</span>
                </li>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>info@mkurushop.com</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Download App */}
            <div className="footer-col">
              <h4>Download Our App</h4>
              <p className="app-text">Get exclusive offers and faster checkout</p>
              <div className="app-buttons">
                <a href="#" className="app-button">
                  <i className="fab fa-google-play"></i>
                  <div className="app-button-text">
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
                <a href="#" className="app-button">
                  <i className="fab fa-apple"></i>
                  <div className="app-button-text">
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="footer-payment">
        <div className="container">
          <div className="payment-content">
            <span>We Accept:</span>
            <div className="payment-icons">
              <i className="fab fa-cc-visa" title="Visa"></i>
              <i className="fab fa-cc-mastercard" title="Mastercard"></i>
              <i className="fab fa-cc-paypal" title="PayPal"></i>
              <i className="fab fa-cc-amex" title="American Express"></i>
              <i className="fas fa-mobile-alt" title="M-Pesa"></i>
              <span className="payment-text">M-Pesa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="bottom-content">
            <p className="copyright">
              &copy; {currentYear} Mkuru Shop. All rights reserved.
            </p>
            <div className="bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;