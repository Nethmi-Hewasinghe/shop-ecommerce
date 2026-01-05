import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { FaSearch, FaTruck, FaInfoCircle, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
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
            setError('Order not found. Please verify your order ID.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (orderId) fetchOrder(orderId); else setLoading(false); }, [orderId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchId.trim()) navigate(`/track-order/${searchId}`);
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-sm border-0 mb-4 rounded-4">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4 fw-bold">Track Your Package 📦</h2>
                            <Form onSubmit={handleSubmit} className="d-flex gap-2">
                                <Form.Control size="lg" placeholder="Order ID (e.g. 64b1...)" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
                                <Button variant="primary" type="submit" disabled={loading}><FaSearch /></Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}

                    {order && (
                        <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                            <Card.Header className="bg-white border-0 py-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Status: <span className="text-primary text-uppercase">{order.status}</span></span>
                                    <FaTruck className="text-muted h4 mb-0" />
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4 bg-light">
                                <Alert variant="primary" className="border-0 shadow-sm">
                                    <div className="d-flex align-items-center">
                                        <FaMoneyBillWave className="me-3 h4 mb-0" />
                                        <div>
                                            <h6 className="mb-0 fw-bold">Cash on Delivery</h6>
                                            <small>Please keep <strong>Rs. {order.totalPrice.toFixed(2)}</strong> ready to pay the courier.</small>
                                        </div>
                                    </div>
                                </Alert>
                                <div className="ps-3 border-start border-2 border-primary ms-2 py-2">
                                    <div className="mb-4">
                                        <FaCheckCircle className="text-success me-2" /> <strong>Order Received</strong>
                                        <div className="text-muted small ps-4">{new Date(order.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className={order.status === 'delivered' ? 'text-dark' : 'text-muted'}>
                                        <FaCheckCircle className={order.status === 'delivered' ? 'text-success me-2' : 'text-muted me-2'} /> 
                                        <strong>Expected Delivery</strong>
                                        <div className="small ps-4">Usually within 3-5 business days.</div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default TrackOrder;