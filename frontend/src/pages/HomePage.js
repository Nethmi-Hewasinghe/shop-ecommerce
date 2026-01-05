import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import API from '../services/api';
import '../styles/HomePage.css';
import heroBanner from '../images/hero-banner.jpg';
import Chatbot from '../components/Chatbot';

const BASE_URL = 'http://localhost:5000';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { 
            id: 'books', 
            name: 'Books (Academic Focus)', 
            icon: '📚',
            image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
            description: 'Textbooks, notebooks, and study materials for all your academic needs'
        },
        { 
            id: 'stationery', 
            name: 'Stationery', 
            icon: '✏️',
            image: 'https://images.unsplash.com/photo-1586232702178-c8419076e3b3?auto=format&fit=crop&w=500&q=80',
            description: 'Pens, pencils, and all essential writing supplies'
        },
        { 
            id: 'electronics', 
            name: 'Electronics', 
            icon: '💻',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=80',
            description: 'Laptops, tablets, and tech accessories for students'
        },
        { 
            id: 'essentials', 
            name: 'Student Essentials', 
            icon: '🎒',
            image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=500&q=80',
            description: 'Everything else you need for campus life'
        }
    ];

    const placeholders = [
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=500",
        "https://images.unsplash.com/photo-1583485088034-697b5bc54cdc?auto=format&fit=crop&q=80&w=500",
        "https://images.unsplash.com/photo-1529859503572-5b9d1e68e952?auto=format&fit=crop&q=80&w=500"
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await API.get('/products');

                const enhancedData = data.map((item, index) => ({
                    ...item,
                    displayImage: item.image
                        ? (item.image.startsWith('http')
                            ? item.image
                            : `${BASE_URL}${item.image}`)
                        : placeholders[index % placeholders.length],
                    rating: 5,
                    reviews: Math.floor(Math.random() * 500) + 100
                }));

                setProducts(enhancedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getProductsByCategory = (category) => {
        return products.filter(product =>
            product.category &&
            product.category.toLowerCase().includes(category.toLowerCase())
        ).slice(0, 4);
    };

    if (loading) {
        return <div className="loading-screen">Loading products...</div>;
    }

    return (
        <div className="home-page-container">
            {/* Shipping Bar */}
            <div className="shipping-bar">
                ✨ FREE SHIPPING ON ALL ORDERS OVER Rs. 2000! USE CODE: STUDENTLIFE ✨
            </div>

            {/* Hero Section */}
            <div className="hero-container">
                <img
                    src={heroBanner}
                    alt="Student Store Banner"
                    className="hero-landscape-img"
                />
            </div>

            {/* Categories */}
            <section className="section-container">
                <div className="section-header">
                    <h2>Shop by Category</h2>
                </div>
                <div className="category-cards">
                    {categories.map(category => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="category-card"
                        >
                            <div
                                className="category-image"
                                style={{ backgroundImage: `url(${category.image})` }}
                            >
                                <div className="category-overlay">
                                    <span className="category-icon">{category.icon}</span>
                                    <h3>{category.name}</h3>
                                    <p>{category.description}</p>
                                    <span className="shop-now">Shop Now →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* New Arrivals */}
            <section className="section-container">
                <div className="section-header">
                    <h2>New Arrivals</h2>
                    <Link to="/products" className="view-all">
                        View All <FaArrowRight />
                    </Link>
                </div>
                <div className="kawaii-grid">
                    {products.slice(0, 4).map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>

            {/* Category Sections */}
            {categories.map(category => {
                const items = getProductsByCategory(category.id);
                if (!items.length) return null;

                return (
                    <section key={category.id} className="section-container">
                        <div className="section-header">
                            <h2>{category.icon} {category.name}</h2>
                            <Link
                                to={`/products?category=${category.id}`}
                                className="view-all"
                            >
                                View All <FaArrowRight />
                            </Link>
                        </div>
                        <div className="kawaii-grid">
                            {items.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                );
            })}

            <Chatbot />
        </div>
    );
};

// Product Card Component
const ProductCard = ({ product }) => {
    const isOutOfStock = product.countInStock <= 0;
    const isLowStock = product.countInStock > 0 && product.countInStock <= 5;

    return (
        <div className={`kawaii-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="kawaii-image-wrapper">
                <img
                    src={product.displayImage}
                    alt={product.name}
                    className={`kawaii-img ${isOutOfStock ? 'grayscale' : ''}`}
                />

                <div className="hover-actions">
                    <button className="wish-btn">
                        <FaHeart />
                    </button>
                </div>

                {isOutOfStock ? (
                    <span className="tag sold">OUT OF STOCK</span>
                ) : isLowStock ? (
                    <span className="tag warning">ONLY {product.countInStock} LEFT</span>
                ) : (
                    <span className="tag new">{product.countInStock} IN STOCK</span>
                )}
            </div>

            <div className="kawaii-info">
                <h3 className="kawaii-title">{product.name}</h3>

                <div className="kawaii-stars">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                    ))}
                    <span className="review-count">({product.reviews})</span>
                </div>

                <div className="kawaii-price">
                    <span className="currency">Rs. </span>{product.price}
                </div>

                <Link
                    to={isOutOfStock ? '#' : `/product/${product._id}`}
                    className={`kawaii-btn ${isOutOfStock ? 'disabled' : ''}`}
                    onClick={(e) => isOutOfStock && e.preventDefault()}
                >
                    {isOutOfStock
                        ? 'OUT OF STOCK'
                        : <><FaShoppingCart className="me-2" /> VIEW DETAILS</>}
                </Link>

                {isLowStock && !isOutOfStock && (
                    <div className="stock-warning">
                        Hurry! Only {product.countInStock} left
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
