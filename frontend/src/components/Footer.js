import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>About Us</h5>
            <p className="text-muted">
              StudentShop is your one-stop shop for all your academic and lifestyle needs.
              We provide quality products at student-friendly prices.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/products" className="text-decoration-none text-muted">Products</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: info@studentshop.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 University Ave, City, Country</li>
            </ul>
          </div>
        </div>
        <hr className="bg-secondary" />
        <div className="text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} StudentShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
