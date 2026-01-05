import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';



import AdminDashboard from './pages/AdminDashboard';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';
import './App.css';
import './styles/CartSidebar.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <CartSidebar />
        <main className="py-3">
          <Container>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              
              
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/track-order/:id" element={<TrackOrder />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              
            </Routes>
          </Container>
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;