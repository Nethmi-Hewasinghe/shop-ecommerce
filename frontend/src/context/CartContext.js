import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(
        localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    );

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty) => {
        const existItem = cartItems.find((x) => x._id === product._id);
        if (existItem) {
            setCartItems(cartItems.map((x) => (x._id === product._id ? { ...product, qty: Number(qty) } : x)));
        } else {
            setCartItems([...cartItems, { ...product, qty: Number(qty) }]);
        }
    };

    const removeFromCart = (id) => setCartItems(cartItems.filter((x) => x._id !== id));

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, setCartItems }}>
            {children}
        </CartContext.Provider>
    );
};