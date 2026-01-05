import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart } from 'react-feather';

const CartSidebar = ({ isOpen, onClose, cartItems = [], removeFromCart, updateCart }) => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="cart-sidebar-overlay" onClick={onClose}></div>
            <div className="cart-sidebar-content">
                <div className="cart-sidebar-header">
                    <h4>
                        <ShoppingCart className="me-2" />
                        Your Cart
                        <span className="badge bg-primary ms-2">{totalItems}</span>
                    </h4>
                    <button className="btn-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="cart-sidebar-body">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-5">
                            <p>Your cart is empty</p>
                            <Link to="/products" className="btn btn-primary mt-3" onClick={onClose}>
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="cart-item">
                                        <div className="cart-item-img">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cart-item-details">
                                            <h6>{item.name}</h6>
                                            <div className="d-flex align-items-center">
                                                <span className="price">Rs. {item.price}</span>
                                                <div className="qty-selector ms-auto">
                                                    <button 
                                                        className="qty-btn" 
                                                        onClick={() => updateCart(item, item.qty - 1)}
                                                        disabled={item.qty <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="qty">{item.qty}</span>
                                                    <button 
                                                        className="qty-btn"
                                                        onClick={() => updateCart(item, item.qty + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn-remove"
                                            onClick={() => removeFromCart(item._id)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="cart-summary">
                                <div className="d-flex justify-content-between mb-3">
                                    <span>Subtotal:</span>
                                    <span className="fw-bold">Rs. {subtotal.toFixed(2)}</span>
                                </div>
                                <Link 
                                    to="/cart" 
                                    className="btn btn-primary w-100 mb-2"
                                    onClick={onClose}
                                >
                                    View Cart
                                </Link>
                                <Link 
                                    to="/checkout" 
                                    className="btn btn-outline-primary w-100"
                                    onClick={onClose}
                                >
                                    Checkout
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
