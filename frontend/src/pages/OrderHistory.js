import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Badge, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import API from '../services/api';
import '../styles/OrderPage.css';

const OrderHistory = () => {
    const BASE_URL = 'http://localhost:5000'; 
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/orders/myorders');
                const hiddenOrders = JSON.parse(localStorage.getItem('hiddenOrderIds') || '[]');
                const visibleOrders = data.filter(order => !hiddenOrders.includes(order._id));
                setOrders(visibleOrders);
                setError(null);
            } catch (err) {
                setError('Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "Date Unknown";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const handleHideOrder = (orderId) => {
        if (window.confirm('Hide this order permanently from your view?')) {
            const hiddenOrders = JSON.parse(localStorage.getItem('hiddenOrderIds') || '[]');
            const updatedHiddenList = [...hiddenOrders, orderId];
            localStorage.setItem('hiddenOrderIds', JSON.stringify(updatedHiddenList));
            setOrders(orders.filter(order => order._id !== orderId));
        }
    };

    const getStatusBadge = (order) => {
        if (!order.isPaid) return <Badge className="kawaii-badge badge-pending">Pending</Badge>;
        if (order.isDelivered) return <Badge className="kawaii-badge badge-success">Delivered</Badge>;
        return <Badge className="kawaii-badge badge-processing">In Transit</Badge>;
    };

    if (loading) return (
        <div className="loading-container text-center my-5">
            <Spinner animation="border" className="text-pink" />
            <p className="mt-3 text-muted">🌸 Loading your history... 🌸</p>
        </div>
    );

    return (
        <div className="order-history-container py-5">
            <div className="order-page-header-container px-3">
                <h2 className="order-title">🌸 My Orders</h2>
                <Link to="/" className="btn btn-kawaii btn-outline-pink">
                    <FaBox className="me-2" /> CONTINUE SHOPPING
                </Link>
            </div>
            
            {orders.length === 0 ? (
                <div className="text-center my-5">
                    <h3>Your history is empty!</h3>
                    <Link to="/" className="btn btn-kawaii btn-pink text-white px-5 mt-3">Start Shopping</Link>
                </div>
            ) : (
                orders.map((order) => {
                    // FIX: Define flat shipping fee and calculate total
                    const shippingFee = 400;
                    const calculatedSubtotal = order.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
                    const calculatedTotal = calculatedSubtotal + shippingFee;

                    return (
                        <Card key={order._id} className="order-master-card shadow-sm">
                            <Card.Header className="order-header-main">
                                <Row className="align-items-center">
                                    <Col xs={7} md={6}>
                                        <div className="d-flex align-items-center">
                                            <div className="header-icon-box me-3">
                                                <FaBox className="text-pink" />
                                            </div>
                                            <div>
                                                <div className="order-id-text">Order #{order._id.substring(0, 8).toUpperCase()}</div>
                                                <small className="text-muted">Placed on {formatDate(order.createdAt)}</small>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={5} md={6} className="text-end">
                                        <div className="d-flex justify-content-end align-items-center gap-3">
                                            <div className="d-none d-sm-block">{getStatusBadge(order)}</div>
                                            <Button variant="light" className="btn-hide-order shadow-sm border" onClick={() => handleHideOrder(order._id)}>
                                                <FaTrash size={14} /> 
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Header>
                            
                            <Card.Body className="p-4">
                                <Row>
                                    <Col lg={7}>
                                        <h6 className="mb-4 fw-bold text-muted text-uppercase small">Items Ordered</h6>
                                        <ListGroup variant="flush">
                                            {order.orderItems.map((item, index) => (
                                                <ListGroup.Item key={index} className="order-item-row px-0 border-0 mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="product-img-box me-3">
                                                            <img src={item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-bold text-dark">{item.name}</div>
                                                            <div className="text-muted small">Qty: {item.qty} × Rs. {(item.price || 0).toFixed(2)}</div>
                                                        </div>
                                                        <div className="fw-bold text-pink-dark">Rs. {(item.price * item.qty).toFixed(2)}</div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                    
                                    <Col lg={5}>
                                        <Card className="summary-inner-card border-0 shadow-sm mb-4">
                                            <Card.Header className="py-3 text-pink-dark">Order Summary</Card.Header>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">Subtotal</span>
                                                    <span className="fw-bold">Rs. {calculatedSubtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="text-muted">Shipping Fee</span>
                                                    {/* FIX: Constant Rs. 400 fee */}
                                                    <span className="text-danger fw-bold">Rs. {shippingFee.toFixed(2)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between price-total-row fw-bold mt-3">
                                                    <span>Grand Total</span>
                                                    <span>Rs. {calculatedTotal.toFixed(2)}</span>
                                                </div>
                                            </Card.Body>
                                        </Card>

                                        <div className="shipping-info-box p-3 rounded-4 mb-4">
                                            <div className="d-flex align-items-start mb-2">
                                                <FaMapMarkerAlt className="me-2 text-pink mt-1" />
                                                <div className="small">
                                                    <span className="d-block fw-bold text-dark mb-1">Shipping Address:</span>
                                                    {/* FIX: Ensure address displays correctly */}
                                                    <span className="text-muted">
                                                        {order.shippingAddress?.address ? (
                                                            <>
                                                                {order.shippingAddress.address}, <br />
                                                                {order.shippingAddress.city} {order.shippingAddress.postalCode}
                                                            </>
                                                        ) : (
                                                            "Address not specified"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button onClick={() => navigate(`/track-order/${order._id}`)} className="btn-kawaii btn-pink text-white w-100 shadow-sm">
                                            <FaTruck className="me-2" /> Track My Package
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    );
                })
            )}
        </div>
    );
};

export default OrderHistory;