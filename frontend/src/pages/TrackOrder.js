// frontend/src/pages/TrackOrder.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { FaSearch, FaTruck, FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaPhone } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';


const TrackOrder = () => {
    const { id: orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchId, setSearchId] = useState(orderId || '');
    const navigate = useNavigate();

    const fetchOrder = async (id) => {
        setLoading(true);
        setError('');

        try {
            const { data } = await API.get(`/orders/track/${id}`);
            setOrder(data);
        } catch (err) {
            setError('Order not found. Please check your order ID and try again.');
            console.error('Error fetching order:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) {
            fetchOrder(orderId);
        } else {
            setLoading(false);
        }
    }, [orderId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!searchId.trim()) {
            setError('Please enter an order ID');
            return;
        }
        navigate(`/track-order/${searchId}`);
    };

    const getStatusBadge = (status) => {
        const statuses = {
            'pending': { text: 'Pending Payment', variant: 'warning' },
            'processing': { text: 'Processing', variant: 'info' },
            'shipped': { text: 'Shipped', variant: 'primary' },
            'delivered': { text: 'Delivered', variant: 'success' },
            'cancelled': { text: 'Cancelled', variant: 'danger' }
        };

        const currentStatus = statuses[status?.toLowerCase()] || { text: 'Unknown', variant: 'secondary' };
        return <span className={`badge bg-${currentStatus.variant}`}>{currentStatus.text}</span>;
    };

    const getStatusIcon = (status, currentStatus) => {
        if (status === currentStatus) return <FaCheckCircle className="text-success" />;
        if (status === 'cancelled' && currentStatus === 'cancelled') return <FaTimesCircle className="text-danger" />;
        return <FaInfoCircle className="text-muted" />;
    };

    const getStatusDate = (order, status) => {
        const dates = {
            'pending': order.createdAt,
            'processing': order.paidAt,
            'shipped': order.shippedAt,
            'delivered': order.deliveredAt
        };
        return dates[status] ? new Date(dates[status]).toLocaleDateString() : 'Pending';
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Track Your Order</h2>
                            <Form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your order ID"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" /> : <><FaSearch className="me-1" /> Track</>}
                                    </Button>
                                </div>
                                {!orderId && <div className="text-center text-muted small">Enter your order ID to track your package</div>}
                            </Form>
                        </Card.Body>
                    </Card>

                    {loading && orderId ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="mt-2">Loading order details...</p>
                        </div>
                    ) : error ? (
                        <Alert variant="danger" className="text-center">
                            {error}
                            <div className="mt-2">
                                <Link to="/orders" className="btn btn-outline-primary btn-sm">
                                    View My Orders
                                </Link>
                            </div>
                        </Alert>
                    ) : order ? (
                        <Card className="shadow-sm">
                            <Card.Header className="bg-white">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">Order #{order._id.substring(0, 8).toUpperCase()}</h4>
                                    {getStatusBadge(order.status)}
                                </div>
                                <div className="text-muted small mt-1">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </Card.Header>
                            
                            <Card.Body>
                                <div className="timeline mb-4">
                                    {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                                        <div 
                                            key={status} 
                                            className={`timeline-step ${order.status === status ? 'active' : ''} ${status === 'cancelled' ? 'cancelled' : ''}`}
                                        >
                                            <div className="timeline-icon">
                                                {getStatusIcon(status, order.status)}
                                            </div>
                                            <div className="timeline-content">
                                                <h6 className="text-capitalize mb-0">{status}</h6>
                                                <small className="text-muted">{getStatusDate(order, status)}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Row>
                                    <Col md={6} className="mb-3 mb-md-0">
                                        <h5><FaTruck className="me-2" />Shipping Information</h5>
                                        {order.shippingAddress && (
                                            <div className="ps-4">
                                                <p className="mb-1 fw-medium">{order.shippingAddress.address}</p>
                                                <p className="mb-1">
                                                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                                </p>
                                                <p className="mb-1">{order.shippingAddress.country}</p>
                                                {order.shippingAddress.phone && (
                                                    <p className="mb-0">
                                                        <FaPhone className="me-2" /> {order.shippingAddress.phone}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={6}>
                                        <h5><FaInfoCircle className="me-2" />Order Summary</h5>
                                        <ListGroup variant="flush" className="border rounded">
                                            <ListGroup.Item className="d-flex justify-content-between px-3 py-2">
                                                <span>Items ({order.orderItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                                                <span>Rs. {order.itemsPrice?.toFixed(2)}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between px-3 py-2">
                                                <span>Shipping:</span>
                                                <span className={order.shippingPrice > 0 ? '' : 'text-success'}>
                                                    {order.shippingPrice > 0 ? `Rs. ${order.shippingPrice.toFixed(2)}` : 'FREE'}
                                                </span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between fw-bold px-3 py-2 bg-light">
                                                <span>Total:</span>
                                                <span>Rs. {order.totalPrice?.toFixed(2)}</span>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card.Body>
                            
                            <Card.Footer className="bg-white border-top">
                                <div className="d-flex justify-content-between">
                                    <Button 
                                        variant="outline-secondary" 
                                        as={Link} 
                                        to="/orders"
                                    >
                                        Back to Orders
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        as={Link} 
                                        to={`/order/${order._id}`}
                                    >
                                        View Order Details
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    ) : null}
                </Col>
            </Row>
        </Container>
    );
};

export default TrackOrder;