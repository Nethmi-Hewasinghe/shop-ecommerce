import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Badge, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBox, FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaPhone, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';
import API from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/orders/myorders');
                setOrders(data);
                setError(null);
            } catch (err) {
                setError('Failed to load orders. Please try again.');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (order) => {
        if (!order.isPaid) return <Badge bg="warning" className="d-flex align-items-center"><FaClock className="me-1" /> Payment Pending</Badge>;
        if (order.isDelivered) return <Badge bg="success" className="d-flex align-items-center"><FaCheckCircle className="me-1" /> Delivered</Badge>;
        return <Badge bg="info" className="d-flex align-items-center"><FaTruck className="me-1" /> Processing</Badge>;
    };

    const getPaymentStatus = (order) => {
        if (order.isPaid) {
            return <Badge bg="success" className="d-flex align-items-center"><FaCheckCircle className="me-1" /> Paid on {new Date(order.paidAt).toLocaleDateString()}</Badge>;
        }
        return <Badge bg="warning" text="dark" className="d-flex align-items-center"><FaClock className="me-1" /> Not Paid</Badge>;
    };

    const getDeliveryStatus = (order) => {
        if (order.isDelivered) {
            return <Badge bg="success" className="d-flex align-items-center"><FaCheckCircle className="me-1" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Badge>;
        }
        return <Badge bg="info" className="d-flex align-items-center"><FaClock className="me-1" /> In Transit</Badge>;
    };

    if (loading) return <div className="text-center my-5"><h3>Loading your orders...</h3></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (orders.length === 0) {
        return (
            <div className="text-center my-5">
                <h3>No Orders Found</h3>
                <p>You haven't placed any orders yet.</p>
                <Link to="/" className="btn btn-primary">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">My Orders</h2>
                <Link to="/" className="btn btn-outline-primary">
                    <FaBox className="me-2" /> Continue Shopping
                </Link>
            </div>
            
            {orders.map((order) => (
                <Card key={order._id} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                        <Row className="align-items-center">
                            <Col md={6}>
                                <div className="d-flex align-items-center">
                                    <div className="bg-light p-2 rounded-circle me-3">
                                        <FaBox className="text-primary" />
                                    </div>
                                    <div>
                                        <h6 className="mb-0">Order #{order._id.substring(0, 8).toUpperCase()}</h6>
                                        <small className="text-muted">Placed on {formatDate(order.createdAt)}</small>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="mt-2 mt-md-0">
                                <div className="d-flex justify-content-md-end">
                                    {getStatusBadge(order)}
                                </div>
                            </Col>
                        </Row>
                    </Card.Header>
                    
                    <Card.Body>
                        <Row>
                            <Col lg={8}>
                                <h5 className="mb-3">Order Items</h5>
                                <ListGroup variant="flush" className="border rounded">
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index} className="px-3 py-3">
                                            <div className="d-flex align-items-center">
                                                <div className="border rounded p-1 me-3" style={{ width: '80px', height: '80px' }}>
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <Link to={`/product/${item.product}`} className="text-decoration-none fw-medium">
                                                        {item.name}
                                                    </Link>
                                                    <div className="d-flex justify-content-between align-items-center mt-1">
                                                        <span className="text-muted small">Qty: {item.qty}</span>
                                                        <span className="fw-medium">Rs. {(item.price * item.qty).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                                
                                <div className="mt-4">
                                    <h5 className="mb-3">Order Status</h5>
                                    <div className="bg-light p-3 rounded">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="d-flex align-items-center">
                                                <FaMoneyBillWave className="text-primary me-2" />
                                                <span>Payment Status:</span>
                                            </div>
                                            {getPaymentStatus(order)}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <FaTruck className="text-primary me-2" />
                                                <span>Delivery Status:</span>
                                            </div>
                                            {getDeliveryStatus(order)}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            
                            <Col lg={4} className="mt-4 mt-lg-0">
                                <Card className="border-0 shadow-sm">
                                    <Card.Header className="bg-white border-bottom">
                                        <h5 className="mb-0">Order Summary</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item className="d-flex justify-content-between px-0">
                                                <span>Subtotal ({order.orderItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
                                                <span>Rs. {order.itemsPrice?.toFixed(2)}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between px-0">
                                                <span>Shipping:</span>
                                                <span className={order.shippingPrice > 0 ? '' : 'text-success'}>Rs. {order.shippingPrice?.toFixed(2)}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between px-0">
                                                <span>Tax:</span>
                                                <span>Rs. {order.taxPrice?.toFixed(2)}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between fw-bold px-0 pt-2 pb-0">
                                                <span>Total:</span>
                                                <span>Rs. {order.totalPrice?.toFixed(2)}</span>
                                            </ListGroup.Item>
                                        </ListGroup>
                                        
                                        <div className="alert alert-info mt-3 small d-flex align-items-center">
                                            <FaInfoCircle className="me-2" />
                                            <div>Payment will be collected at the time of delivery</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                                
                                <Card className="border-0 shadow-sm mt-3">
                                    <Card.Header className="bg-white border-bottom">
                                        <h5 className="mb-0">Shipping Address</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="d-flex align-items-start mb-2">
                                            <FaMapMarkerAlt className="text-muted mt-1 me-2" />
                                            <div>
                                                <p className="mb-1 fw-medium">{order.shippingAddress?.address}</p>
                                                <p className="mb-1">
                                                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                                </p>
                                                <p className="mb-0">{order.shippingAddress?.country}</p>
                                            </div>
                                        </div>
                                        {order.shippingAddress?.phone && (
                                            <div className="d-flex align-items-center mt-3">
                                                <FaPhone className="text-muted me-2" />
                                                <span>{order.shippingAddress.phone}</span>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                                
                                <div className="mt-3 d-grid gap-2">
                                    <Button 
    as={Link}
    to={`/track-order/${order._id}`}
    variant="outline-primary" 
    size="lg"
    className="mb-2"
>
    <FaTruck className="me-2" /> Track Order
</Button>
                                    <Button variant="light" size="lg">
                                        Need Help?
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default OrderHistory;