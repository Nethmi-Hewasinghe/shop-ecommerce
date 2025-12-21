import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col, Alert } from 'react-bootstrap';
import API from '../services/api';

const CATEGORIES = [
    'Books (Academic Focus)',
    'Stationery',
    'Electronics',
    'Student Essentials'
];

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [error, setError] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
    
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        price: 0, 
        image: '', 
        category: '', 
        countInStock: 0, 
        description: '' 
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, orderRes] = await Promise.all([
                API.get('/products'),
                API.get('/orders/all')
            ]);
            setProducts(prodRes.data);
            setOrders(orderRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
            setError("Failed to fetch data. Please try again.");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await API.post('/products', newProduct);
            setShowAddModal(false);
            fetchData();
            setNewProduct({ name: '', price: 0, image: '', category: '', countInStock: 0, description: '' });
        } catch (err) {
            setError(err.response?.data?.message || "Error creating product");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await API.put(`/products/${currentProduct._id}`, currentProduct);
            setShowEditModal(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || "Error updating product");
        }
    };

    const handleEditClick = (product) => {
        setCurrentProduct({...product});
        setShowEditModal(true);
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                fetchData();
            } catch (err) {
                setError("Failed to delete product");
            }
        }
    };

    return (
        <div className="mt-4">
            <Row className='align-items-center mb-4'>
                <Col><h1>Admin Dashboard</h1></Col>
                <Col className='text-end'>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <i className='fas fa-plus'></i> Add New Kawaii Product
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            <h3>Inventory</h3>
            <Table striped bordered hover responsive className='table-sm shadow-sm'>
                <thead className="table-dark">
                    <tr>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>CATEGORY</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td className={product.countInStock === 0 ? 'text-danger fw-bold' : ''}>
                                {product.countInStock === 0 ? 'Out of Stock' : product.countInStock}
                            </td>
                            <td>{product.category}</td>
                            <td>
                                <Button 
                                    variant='info' 
                                    className='btn-sm me-2 text-white'
                                    onClick={() => handleEditClick(product)}
                                >
                                    <i className="fas fa-edit"></i> Edit
                                </Button>
                                <Button 
                                    variant='danger' 
                                    className='btn-sm'
                                    onClick={() => deleteHandler(product._id)}
                                >
                                    <i className="fas fa-trash"></i> Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Product Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-2">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control 
                                required 
                                type="text" 
                                placeholder="e.g. Sakura Lip Gloss" 
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label>Price ($)</Form.Label>
                                    <Form.Control 
                                        required 
                                        type="number" 
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label>Stock Count</Form.Label>
                                    <Form.Control 
                                        required 
                                        type="number" 
                                        value={newProduct.countInStock}
                                        onChange={(e) => setNewProduct({...newProduct, countInStock: e.target.value})} 
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-2">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control 
                                required 
                                type="text" 
                                placeholder="https://..." 
                                value={newProduct.image}
                                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Category</Form.Label>
                            <Form.Select 
                                required
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            >
                                <option value="">Select a category</option>
                                {CATEGORIES.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                required 
                                as="textarea" 
                                rows={3} 
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} 
                            />
                        </Form.Group>

                        <Button type="submit" variant="success" className="w-100">Create Product</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentProduct && (
                        <Form onSubmit={handleUpdate}>
                            <Form.Group className="mb-2">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control 
                                    required 
                                    type="text" 
                                    value={currentProduct.name}
                                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} 
                                />
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Price ($)</Form.Label>
                                        <Form.Control 
                                            required 
                                            type="number" 
                                            value={currentProduct.price}
                                            onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Stock Count</Form.Label>
                                        <Form.Control 
                                            required 
                                            type="number" 
                                            value={currentProduct.countInStock}
                                            onChange={(e) => setCurrentProduct({...currentProduct, countInStock: e.target.value})} 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-2">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control 
                                    required 
                                    type="text" 
                                    value={currentProduct.image}
                                    onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})} 
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Category</Form.Label>
                                <Form.Control 
                                    required 
                                    type="text" 
                                    value={currentProduct.category}
                                    onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} 
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control 
                                    required 
                                    as="textarea" 
                                    rows={3} 
                                    value={currentProduct.description}
                                    onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} 
                                />
                            </Form.Group>

                            <Button type="submit" variant="primary" className="w-100">Update Product</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminDashboard;