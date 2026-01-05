import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, ListGroup, Button, Row, Col, Image, Alert } from 'react-bootstrap';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you would fetch the order details from your API
    const fetchOrder = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          // Mock order data
          const mockOrder = {
            _id: id,
            user: {
              name: 'John Doe',
              email: 'john@example.com'
            },
            orderItems: [
              {
                _id: '1',
                name: 'Sample Product',
                qty: 1,
                image: '/images/sample.jpg',
                price: 99.99
              }
            ],
            shippingAddress: {
              address: '123 Main St',
              city: 'New York',
              postalCode: '10001',
              country: 'USA'
            },
            paymentMethod: 'PayPal',
            itemsPrice: 99.99,
            taxPrice: 14.99,
            shippingPrice: 0,
            totalPrice: 114.98,
            isPaid: true,
            paidAt: new Date().toISOString(),
            isDelivered: false,
            deliveredAt: null
          };
          setOrder(mockOrder);
          setLoading(false);
        }, 500);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="container py-5">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <h1 className="mb-4">Order {order._id}</h1>
          <Row>
            <Col md={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Shipping</h5>
                  <p>
                    <strong>Name: </strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>{' '}
                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Alert variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Alert>
                  ) : (
                    <Alert variant="warning">Not Delivered</Alert>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Payment Method</h5>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Alert variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Alert>
                  ) : (
                    <Alert variant="danger">Not Paid</Alert>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <h5 className="mb-3">Order Items</h5>
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => (
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
                        <Col>${order.itemsPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping</Col>
                        <Col>${order.shippingPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        <Col>${order.taxPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="fw-bold">
                      <Row>
                        <Col>Total</Col>
                        <Col>${order.totalPrice.toFixed(2)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Button
                        as={Link}
                        to="/"
                        variant="primary"
                        className="w-100"
                      >
                        Continue Shopping
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default OrderPage;
