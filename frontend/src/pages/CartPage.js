import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import API from '../services/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart, setCartItems } = useContext(CartContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [stockStatus, setStockStatus] = useState({});
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [orderProcessing, setOrderProcessing] = useState(false);

    // Form validation schema
    const validationSchema = Yup.object().shape({
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        postalCode: Yup.string()
            .required('Postal Code is required')
            .matches(/^[0-9]{5}$/, 'Postal Code must be 5 digits'),
        country: Yup.string().required('Country is required'),
        phone: Yup.string()
            .required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    });

    // Check stock status when cart items change
    useEffect(() => {
        const checkStock = async () => {
            const status = {};
            for (const item of cartItems) {
                try {
                    const { data } = await API.get(`/products/${item._id}`);
                    status[item._id] = data.countInStock;
                } catch (error) {
                    console.error('Error checking stock:', error);
                    status[item._id] = 0;
                }
            }
            setStockStatus(status);
        };

        if (cartItems.length > 0) {
            checkStock();
        }
    }, [cartItems]);

    const handleCheckoutClick = () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }
        setShowAddressModal(true);
    };

    const submitOrder = async (values) => {
        setOrderProcessing(true);
        setError('');

        try {
            // Verify stock one more time before placing order
            const stockCheckPromises = cartItems.map(item => 
                API.get(`/products/${item._id}`).then(({ data }) => ({
                    item,
                    stock: data.countInStock
                }))
            );

            const stockResults = await Promise.all(stockCheckPromises);
            const outOfStockItems = stockResults.filter(
                ({ item, stock }) => stock < item.qty
            );

            if (outOfStockItems.length > 0) {
                const itemNames = outOfStockItems.map(({ item, stock }) => 
                    `${item.name} (only ${stock} available)`
                ).join(', ');
                throw new Error(`Insufficient stock: ${itemNames}. Please update your cart.`);
            }

            const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress: {
                    address: values.address,
                    city: values.city,
                    postalCode: values.postalCode,
                    country: values.country,
                    phone: values.phone
                },
                paymentMethod: 'Cash on Delivery',
                totalPrice,
                isPaid: false,
                paidAt: null,
                isDelivered: false,
                deliveredAt: null
            };

            await API.post('/orders', orderData);
            setCartItems([]); // Clear cart
            setShowAddressModal(false);
            navigate('/orders');
        } catch (error) {
            console.error('Checkout error:', error);
            setError(error.response?.data?.message || error.message || 'Checkout failed. Please try again.');
        } finally {
            setOrderProcessing(false);
        }
    };

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <div className="alert alert-info">Your cart is empty <Link to='/'>Go Back</Link></div>
                ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item._id}>
                                <Row>
                                    <Col md={2}><Image src={item.image} alt={item.name} fluid rounded /></Col>
                                    <Col md={3}><Link to={`/product/${item._id}`}>{item.name}</Link></Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control 
                                            as='select' 
                                            value={item.qty} 
                                            onChange={(e) => addToCart(item, Number(e.target.value))}
                                            disabled={loading || (stockStatus[item._id] || 0) === 0}
                                        >
                                            {[...Array(stockStatus[item._id] || 0).keys()].map((x) => {
                                                const quantity = x + 1;
                                                return (
                                                    <option 
                                                        key={quantity}
                                                        value={quantity}
                                                    >
                                                        {quantity}
                                                    </option>
                                                );
                                            })}
                                        </Form.Control>
                                        {stockStatus[item._id] !== undefined && (
                                            <div className="small text-muted">
                                                {stockStatus[item._id] === 0 ? (
                                                    <span className="text-danger">Out of stock</span>
                                                ) : (
                                                    `${stockStatus[item._id]} in stock`
                                                )}
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={2}>
                                        <Button type='button' variant='light' onClick={() => removeFromCart(item._id)}>
                                            <i className='fas fa-trash text-danger'></i> Remove
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>Order Summary</h3>
                            <div className="d-flex justify-content-between">
                                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items):</span>
                                <span>Rs. {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mt-2">
                                <span>Shipping:</span>
                                <span>Cash on Delivery</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span>Rs. {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {error && <Alert variant="danger" className="small p-2 mb-3">{error}</Alert>}
                            <Button 
                                type='button' 
                                className='btn-block w-100' 
                                disabled={cartItems.length === 0 || loading}
                                onClick={handleCheckoutClick}
                                variant="primary"
                                size="lg"
                            >
                                {loading ? 'Processing...' : 'Proceed To Checkout'}
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>

                {/* Shipping Address Modal */}
                <Modal show={showAddressModal} onHide={() => !orderProcessing && setShowAddressModal(false)}>
                    <Modal.Header closeButton={!orderProcessing}>
                        <Modal.Title>Shipping Details</Modal.Title>
                    </Modal.Header>
                    <Formik
                        initialValues={{
                            address: '',
                            city: '',
                            postalCode: '',
                            country: 'Sri Lanka',
                            phone: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={submitOrder}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Modal.Body>
                                    <Form.Group className="mb-3" controlId="address">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            placeholder="Enter your address"
                                            value={values.address}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            isInvalid={touched.address && !!errors.address}
                                            disabled={orderProcessing}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6" controlId="city">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="city"
                                                placeholder="Enter city"
                                                value={values.city}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.city && !!errors.city}
                                                disabled={orderProcessing}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.city}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6" controlId="postalCode">
                                            <Form.Label>Postal Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="postalCode"
                                                placeholder="Enter postal code"
                                                value={values.postalCode}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.postalCode && !!errors.postalCode}
                                                disabled={orderProcessing}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.postalCode}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} md="6" controlId="country">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="country"
                                                value={values.country}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.country && !!errors.country}
                                                disabled={orderProcessing}
                                            >
                                                <option value="Sri Lanka">Sri Lanka</option>
                                                <option disabled>──────────</option>
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="India">India</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6" controlId="phone">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                placeholder="Enter phone number"
                                                value={values.phone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                isInvalid={touched.phone && !!errors.phone}
                                                disabled={orderProcessing}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.phone}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <div className="alert alert-info mt-3">
                                        <i className="fas fa-info-circle me-2"></i>
                                        Your order will be delivered within 3-5 business days. Payment will be collected upon delivery.
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setShowAddressModal(false)}
                                        disabled={orderProcessing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        disabled={orderProcessing}
                                    >
                                        {orderProcessing ? 'Placing Order...' : 'Place Order'}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Modal>
            </Col>
        </Row>
    );
};

export default CartPage;