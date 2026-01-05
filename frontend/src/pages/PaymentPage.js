import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    // Save payment method and proceed to place order
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 mb-4">
          <Card className="shadow">
            <Card.Body>
              <h2 className="mb-4">Payment Method</h2>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label as="legend">Select Method</Form.Label>
                  <ListGroup>
                    <ListGroup.Item>
                      <Form.Check
                        type="radio"
                        id="paypal"
                        label="PayPal or Credit Card"
                        name="paymentMethod"
                        value="PayPal"
                        checked={paymentMethod === 'PayPal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Check
                        type="radio"
                        id="stripe"
                        label="Stripe"
                        name="paymentMethod"
                        value="Stripe"
                        checked={paymentMethod === 'Stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                    </ListGroup.Item>
                  </ListGroup>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  Continue to Place Order
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-4">
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3">Order Summary</h5>
              {/* Order summary would go here */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>$0.00</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>$0.00</span>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
