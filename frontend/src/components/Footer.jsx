const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Mkuru Shop</h3>
          <p>Your one-stop shop for quality products</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/orders">My Orders</a>
            </li>
            <li>
              <a href="/cart">Cart</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: info@mkurushop.com</p>
          <p>Phone: +1 (234) 567-8900</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Mkuru Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;