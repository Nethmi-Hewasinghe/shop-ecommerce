import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import OrderHistory from './pages/OrderHistory';
import { CartProvider } from './context/CartContext';
import TrackOrder from './pages/TrackOrder';


function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* This route handles "Shop Now" and category filtering */}
              <Route path="/products" element={<ProductPage />} /> 
              {/* This route handles specific item details */}
              <Route path="/product/:id" element={<ProductPage />} /> 
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/track-order/:id" element={<TrackOrder />} />
              <Route path="/track-order" element={<TrackOrder />} />
             
            </Routes>
          </Container>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;