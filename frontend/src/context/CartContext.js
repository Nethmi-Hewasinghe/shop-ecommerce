import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(
        localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
    );
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product, qty) => {
        setCartItems(prevItems => {
            const existItem = prevItems.find((x) => x._id === product._id);
            if (existItem) {
                return prevItems.map((x) => 
                    x._id === product._id ? { ...product, qty: Number(qty) } : x
                );
            } else {
                return [...prevItems, { ...product, qty: Number(qty) }];
            }
        });
        // Only open cart when adding a new item, not when updating quantity
        if (!cartItems.some(item => item._id === product._id)) {
            setIsCartOpen(true);
        }
    }, [cartItems]);

    const updateCartItem = useCallback((product, qty) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item._id === product._id ? { ...item, qty: Math.max(1, qty) } : item
            )
        );
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prevItems => prevItems.filter((x) => x._id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const openCart = useCallback(() => {
        setIsCartOpen(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsCartOpen(false);
    }, []);

    const value = {
        cartItems,
        isCartOpen,
        addToCart,
        updateCart: updateCartItem,
        removeFromCart,
        clearCart,
        openCart,
        closeCart,
        setCartItems,
        cartCount: cartItems.reduce((sum, item) => sum + item.qty, 0)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};