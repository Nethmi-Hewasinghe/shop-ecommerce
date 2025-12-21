import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import API from '../services/api';
import '../styles/ProductPage.css';

// --- Sub-Component: Individual Product Card ---
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);

    const addToCartHandler = (e) => {
        e.stopPropagation(); // Prevents clicking through to the detail page
        addToCart(product, 1);
    };

    return (
        <div className="kawaii-card" onClick={() => navigate(`/product/${product._id}`)}>
            <div className="kawaii-image-wrapper">
                <img src={product.image} alt={product.name} className="kawaii-img" />
                <div className="hover-actions">
                    <button className="wish-btn" onClick={(e) => e.stopPropagation()}><FaHeart /></button>
                </div>
                {product.countInStock > 0 ? (
                    <span className="tag new">{product.countInStock} IN STOCK</span>
                ) : (
                    <span className="tag sold">OUT OF STOCK</span>
                )}
            </div>
            <div className="kawaii-info">
                <h3 className="kawaii-title">{product.name}</h3>
                <div className="kawaii-stars">
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                    <span className="review-count">({Math.floor(Math.random() * 50) + 10})</span>
                </div>
                <div className="kawaii-price">Rs. {product.price}</div>
                <button 
                    className={`btn w-100 py-2 ${product.countInStock > 0 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                >
                    {product.countInStock > 0 ? (
                        <><FaShoppingCart className="me-2" /> ADD TO CART</>
                    ) : (
                        <><i className="fas fa-times-circle me-2"></i> OUT OF STOCK</>
                    )}
                </button>
                {product.countInStock <= 5 && product.countInStock > 0 && (
                    <div className="text-warning small mt-2">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Only {product.countInStock} left in stock!
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-Component: Product Detail View ---
const ProductDetail = ({ id }) => {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="loading-screen">🌸 Loading Details... 🌸</div>;
    if (!product) return <div className="not-found text-center mt-5">Product not found</div>;

    return (
        <div className="product-detail-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <FaArrowLeft /> Back
            </button>
            <div className="detail-grid">
                <div className="detail-image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="detail-info">
                    <h1>{product.name}</h1>
                    <p className="category-badge">{product.category}</p>
                    <div className="detail-price">Rs. {product.price}</div>
                    <p className="description">{product.description}</p>
                    
                    <div className="qty-section">
                        {product.countInStock > 0 ? (
                            <>
                                <label>Quantity:</label>
                                <select 
                                    value={qty} 
                                    onChange={(e) => setQty(Number(e.target.value))}
                                    className="form-select"
                                >
                                    {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                                <div className="text-muted small mt-1">
                                    {product.countInStock} available
                                </div>
                            </>
                        ) : (
                            <div className="alert alert-warning mb-0">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                This item is currently out of stock.
                            </div>
                        )}
                    </div>

                    <button 
                        className="add-to-cart-big"
                        onClick={() => { addToCart(product, qty); navigate('/cart'); }}
                        disabled={product.countInStock === 0}
                    >
                        <FaShoppingCart /> {product.countInStock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
const ProductPage = () => {
    const { id } = useParams(); // Get ID for Detail View
    const { search } = useLocation(); // Get Query Params for Category Filtering
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (id) return; // Skip if we are on the detail page
            try {
                const params = new URLSearchParams(search);
                const category = params.get('category'); // Extract category
                
                const url = category ? `/products?category=${category}` : '/products';
                const { data } = await API.get(url);
                setProducts(data);
            } catch (error) {
                console.error('Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [id, search]);

    if (id) return <ProductDetail id={id} />;

    return (
        <div className="products-list-page">
            <h2 className="section-title">Explore Our Collection</h2>
            {loading ? (
                <div className="loading-screen">🌸 Browsing Inventory... 🌸</div>
            ) : (
                <div className="kawaii-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="no-products text-center w-100">
                            <h3>No items found in this category.</h3>
                            <Link to="/products" className="kawaii-btn d-inline-block mt-3">View All</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductPage;