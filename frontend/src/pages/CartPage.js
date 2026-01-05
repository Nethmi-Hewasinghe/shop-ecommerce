import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, Alert, Modal, Spinner } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaShoppingBasket, FaTruck, FaMapMarkerAlt, FaPhone, FaTimes } from 'react-icons/fa';
import API from '../services/api';
import { Formik } from 'formik';
import * as Yup from 'yup';
import '../styles/CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart, setCartItems } = useContext(CartContext);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [orderProcessing, setOrderProcessing] = useState(false);

    const BASE_URL = 'http://localhost:5000'; 
    const shippingPrice = 400.00;

    const validationSchema = Yup.object().shape({
        address: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        postalCode: Yup.string().required('Required'),
        phone: Yup.string().required('Required').matches(/^[0-9]{10}$/, 'Invalid phone')
    });

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
    const totalPrice = itemsPrice + shippingPrice;

    const handleCheckoutClick = () => {
        if (!localStorage.getItem('userInfo')) {
            navigate('/login?redirect=cart');
            return;
        }
        setShowAddressModal(true);
    };

    const submitOrder = async (values) => {
        setOrderProcessing(true);
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name, qty: item.qty, image: item.image,
                    price: item.price, product: item._id
                })),
                shippingAddress: { ...values, country: 'Sri Lanka' },
                paymentMethod: 'Cash on Delivery',
                itemsPrice, shippingPrice, totalPrice, isPaid: false,
            };
            await API.post('/orders', orderData);
            setCartItems([]);
            localStorage.removeItem('cartItems');
            setShowAddressModal(false);
            navigate('/orders');
        } catch (err) {
            alert('Failed to place order.');
        } finally {
            setOrderProcessing(false);
        }
    };

    return (
        <div className="cart-container py-5">
            <div className="container">
                <div className="d-flex align-items-center mb-5">
                    <FaShoppingBasket className="text-pink me-3 h3 mb-0" />
                    <h2 className="fw-bold text-pink-dark mb-0">My Shopping Cart</h2>
                </div>
                
                {cartItems.length === 0 ? (
                    <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                        <h4>Your cart is feeling light! 🌸</h4>
                        <Link to="/" className="btn btn-kawaii btn-pink text-white mt-3">Start Shopping</Link>
                    </Card>
                ) : (
                    <Row className="g-4">
                        {/* ITEM LIST - EACH IN SEPARATE CARDS */}
                        <Col lg={8}>
                            {cartItems.map((item) => (
                                <Card key={item._id} className="border-0 shadow-sm rounded-4 mb-3 item-card">
                                    <Card.Body className="p-3">
                                        <Row className="align-items-center">
                                            <Col xs={4} md={3}>
                                                <div className="cart-product-img-wrapper">
                                                    <Image 
                                                        src={item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`} 
                                                        alt={item.name} 
                                                        fluid 
                                                        className="rounded-3"
                                                    />
                                                </div>
                                            </Col>
                                            <Col xs={8} md={5}>
                                                <Link to={`/product/${item._id}`} className="text-decoration-none h6 fw-bold text-dark d-block mb-1">
                                                    {item.name}
                                                </Link>
                                                <span className="text-pink-dark fw-bold">Rs. {item.price.toFixed(2)}</span>
                                            </Col>
                                            <Col xs={12} md={4} className="mt-3 mt-md-0 d-flex align-items-center justify-content-between justify-content-md-end gap-3">
                                                <Form.Control 
                                                    as="select" 
                                                    value={item.qty} 
                                                    className="qty-dropdown rounded-pill"
                                                    onChange={(e) => addToCart(item, Number(e.target.value))}
                                                >
                                                    {[...Array(10).keys()].map(x => <option key={x + 1} value={x + 1}>{x + 1}</option>)}
                                                </Form.Control>
                                                <Button variant="light" className="btn-circle-delete shadow-sm" onClick={() => removeFromCart(item._id)}>
                                                    <FaTrash className="text-danger" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Col>

                        {/* SUMMARY SECTION */}
                        <Col lg={4}>
                            <Card className="summary-card-modern border-0 shadow-sm rounded-4 p-3 sticky-top">
                                <Card.Body>
                                    <h5 className="fw-bold mb-4 text-pink-dark border-bottom pb-2">Order Summary</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Subtotal</span>
                                        <span className="fw-bold">Rs. {itemsPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Shipping</span>
                                        <span className="text-danger fw-bold">+ Rs. {shippingPrice.toFixed(2)}</span>
                                    </div>
                                    <hr className="pink-divider" />
                                    <div className="d-flex justify-content-between mb-4 mt-2">
                                        <span className="h5 fw-bold">Total</span>
                                        <span className="h5 fw-bold text-pink-dark">Rs. {totalPrice.toFixed(2)}</span>
                                    </div>
                                    <Button className="btn-kawaii-checkout w-100 py-3 shadow" onClick={handleCheckoutClick}>
                                        PROCEED TO CHECKOUT
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </div>

            {/* CHECKOUT MODAL WITH CANCEL BUTTON */}
            <Modal show={showAddressModal} onHide={() => !orderProcessing && setShowAddressModal(false)} centered className="kawaii-modal">
                <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-center">
                    <Modal.Title className="fw-bold text-pink-dark h4">🌸 Delivery Details</Modal.Title>
                    {!orderProcessing && (
                        <Button variant="light" className="rounded-circle border-0 text-muted" onClick={() => setShowAddressModal(false)}>
                            <FaTimes />
                        </Button>
                    )}
                </Modal.Header>
                <Formik
                    initialValues={{ address: '', city: '', postalCode: '', phone: '' }}
                    validationSchema={validationSchema}
                    onSubmit={submitOrder}
                >
                    {({ values, errors, touched, handleChange, handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body className="px-4 py-4">
                                <Alert variant="pink" className="small d-flex align-items-center mb-4 rounded-3 border-0">
                                    <FaTruck className="me-2" />
                                    <span>Cash on Delivery: Pay <b>Rs. {totalPrice.toFixed(2)}</b> upon receipt.</span>
                                </Alert>
                                
                                <Form.Group className="mb-3">
                                    <label className="fw-bold small mb-1"><FaMapMarkerAlt className="me-1" /> Street Address</label>
                                    <Form.Control name="address" className="kawaii-input" placeholder="e.g., 123 Flower Lane" value={values.address} onChange={handleChange} isInvalid={touched.address && !!errors.address} />
                                </Form.Group>
                                <Row className="mb-3">
                                    <Col><Form.Group><label className="fw-bold small mb-1">City</label><Form.Control name="city" className="kawaii-input" value={values.city} onChange={handleChange} isInvalid={touched.city && !!errors.city} /></Form.Group></Col>
                                    <Col><Form.Group><label className="fw-bold small mb-1">Postal Code</label><Form.Control name="postalCode" className="kawaii-input" value={values.postalCode} onChange={handleChange} isInvalid={touched.postalCode && !!errors.postalCode} /></Form.Group></Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <label className="fw-bold small mb-1"><FaPhone className="me-1" /> Contact Number</label>
                                    <Form.Control name="phone" className="kawaii-input" placeholder="07XXXXXXXX" value={values.phone} onChange={handleChange} isInvalid={touched.phone && !!errors.phone} />
                                </Form.Group>

                                <div className="d-flex gap-2">
                                    {/* ADDED CANCEL BUTTON */}
                                    <Button 
                                        variant="outline-secondary" 
                                        className="flex-grow-1 py-3 rounded-pill fw-bold border-2" 
                                        onClick={() => setShowAddressModal(false)}
                                        disabled={orderProcessing}
                                    >
                                        CANCEL
                                    </Button>
                                    
                                    <Button 
                                        variant="pink" 
                                        type="submit" 
                                        className="flex-grow-2 w-100 py-3 text-white fw-bold rounded-pill shadow-sm" 
                                        disabled={orderProcessing}
                                    >
                                        {orderProcessing ? (
                                            <div className="d-flex align-items-center justify-content-center">
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                <span>CONFIRMING...</span>
                                            </div>
                                        ) : `CONFIRM ORDER`}
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default CartPage;