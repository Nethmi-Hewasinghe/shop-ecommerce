// src/pages/admin/OrderListPage.js
import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const OrderListPage = () => {
  return (
    <Container>
      <h1>Orders</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAID</th>
            <th>DELIVERED</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>2023-01-01</td>
            <td>$99.99</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderListPage;