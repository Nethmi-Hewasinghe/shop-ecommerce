// src/pages/admin/ProductListPage.js
import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const ProductListPage = () => {
  return (
    <Container>
      <h1>Products</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>BRAND</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Sample Product</td>
            <td>$99.99</td>
            <td>Electronics</td>
            <td>Sample Brand</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default ProductListPage;