import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, ListGroup, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const address = JSON.parse(localStorage.getItem('shippingAddress')) || {};
    const payment = localStorage.getItem('paymentMethod') || '';

    if (items.length === 0) {
      navigate('/cart');
    }
    if (!address.address) {
      navigate('/shipping');
    }
    if (!payment) {
      navigate('/payment');
    }

    setCartItems(items);
    setShippingAddress(address);
    setPaymentMethod(payment);
  }, [navigate]);

  const placeOrderHandler = () => {
    setLoading(true);
    // Here you would typically make an API call to create the order
    // For now, we'll just simulate a successful order
    setTimeout(() => {
      // Clear cart after successful order
      localStorage.removeItem('cartItems');
      setLoading(false);
      navigate(`/order/123`); // Redirect to order success page
    }, 1000);
  };

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Place Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Shipping</h5>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Payment Method</h5>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Order Items</h5>
              {cartItems.length === 0 ? (
                <Alert variant="info">Your cart is empty</Alert>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className="align-items-center">
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`} className="text-decoration-none">
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">Order Summary</h5>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="fw-bold">
                  <Row>
                    <Col>Total</Col>
                    <Col>${totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {error && (
                  <ListGroup.Item>
                    <Alert variant="danger">{error}</Alert>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="w-100"
                    onClick={placeOrderHandler}
                    disabled={cartItems.length === 0 || loading}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderPage;
