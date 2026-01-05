import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    Button,
    Form,
    Modal,
    Row,
    Col,
    Alert,
    Badge,
    Spinner,
    InputGroup,
    Nav
} from 'react-bootstrap';
import {
    FaSearch,
    FaPlus,
    FaEdit,
    FaTrash,
    FaEye,
    FaUpload
} from 'react-icons/fa';
import API from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import '../styles/AdminDashboard.css';

const CATEGORIES = [
    'Books (Academic Focus)',
    'Stationery',
    'Electronics',
    'Student Essentials'
];

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminDashboard = () => {
    // CHANGE THIS to your actual backend server URL (e.g., http://localhost:5000)
    const BASE_URL = 'http://localhost:5000'; 

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    
    const [searchTerm, setSearchTerm] = useState({ products: '', orders: '', users: '' });
    const [isLoading, setIsLoading] = useState({ products: false, users: false, orders: false, deleting: null });

    const [newProduct, setNewProduct] = useState({
        name: '', price: 0, image: '', category: '', countInStock: 0, description: '', imageFile: null
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setIsLoading({ products: true, users: true, orders: true });
            const [p, o, u] = await Promise.all([
                API.get('/products'),
                API.get('/orders/all'),
                API.get('/users')
            ]);
            setProducts(p.data);
            setOrders(o.data);
            setUsers(u.data);
        } catch (err) {
            setError('Failed to load admin data');
        } finally {
            setIsLoading({ products: false, users: false, orders: false });
        }
    };

    const formatPrice = price => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

    const filteredProducts = useMemo(() => {
        if (!searchTerm.products) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.products.toLowerCase()));
    }, [products, searchTerm.products]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm.orders) return orders;
        return orders.filter(o => o._id.toLowerCase().includes(searchTerm.orders.toLowerCase()));
    }, [orders, searchTerm.orders]);

    const filteredUsers = useMemo(() => {
        if (!searchTerm.users) return users;
        return users.filter(u => u.email.toLowerCase().includes(searchTerm.users.toLowerCase()));
    }, [users, searchTerm.users]);

    const uploadFileHandler = async (e, isEdit = false) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { data } = await API.post('/upload', formData);
            if (isEdit) {
                setCurrentProduct(prev => ({ ...prev, image: data.image, imageFile: file }));
            } else {
                setNewProduct(prev => ({ ...prev, image: data.image, imageFile: file }));
            }
        } catch {
            setError('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(newProduct).forEach(([key, value]) => {
                if (key === 'imageFile' && value) formData.append('image', value);
                else if (key !== 'imageFile') formData.append(key, value);
            });
            const { data } = await API.post('/products', formData);
            setProducts([...products, data]);
            setShowAddModal(false);
            setSuccess('Product added successfully!');
        } catch (err) { setError('Failed to add product'); }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(currentProduct).forEach(([key, value]) => {
                if (key === 'imageFile' && value) formData.append('image', value);
                else if (key !== 'imageFile') formData.append(key, value);
            });
            const { data } = await API.put(`/products/${currentProduct._id}`, formData);
            setProducts(products.map(p => p._id === data._id ? data : p));
            setShowEditModal(false);
            setSuccess('Product updated successfully!');
        } catch (err) { setError('Failed to update product'); }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await API.delete(`/products/${productId}`);
            setProducts(products.filter(p => p._id !== productId));
            setSuccess('Product deleted!');
        } catch (err) { setError('Delete failed'); }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const { data } = await API.put(`/orders/${orderId}`, { status });
            setOrders(orders.map(o => o._id === orderId ? data : o));
            setSuccess('Order updated!');
        } catch (err) { setError('Update failed'); }
    };

    const renderFileUpload = (isEdit = false) => (
        <Form.Group className="mb-3">
            <Form.Control type="file" hidden id={`upload-${isEdit}`} onChange={e => uploadFileHandler(e, isEdit)} accept="image/*" />
            <Button variant="outline-secondary" onClick={() => document.getElementById(`upload-${isEdit}`).click()} disabled={uploading}>
                <FaUpload className="me-2" /> {uploading ? 'Uploading...' : 'Choose Image'}
            </Button>
        </Form.Group>
    );

    const renderModals = () => (
        <>
            {/* ADD PRODUCT MODAL */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered className="admin-modal">
                <Form onSubmit={handleAddProduct}>
                    <Modal.Header closeButton><Modal.Title>Add New Product</Modal.Title></Modal.Header>
                    <Modal.Body className="modal-scroll-area">
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Name</Form.Label>
                            <Form.Control type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} required />
                        </Form.Group>
                        <Row>
                            <Col><Form.Group className="mb-3"><Form.Label className="fw-bold">Price</Form.Label><Form.Control type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required /></Form.Group></Col>
                            <Col><Form.Group className="mb-3"><Form.Label className="fw-bold">Stock</Form.Label><Form.Control type="number" value={newProduct.countInStock} onChange={(e) => setNewProduct({...newProduct, countInStock: e.target.value})} required /></Form.Group></Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Category</Form.Label>
                            <Form.Select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} required>
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </Form.Select>
                        </Form.Group>
                        {renderFileUpload(false)}
                        {newProduct.image && <img src={newProduct.image.startsWith('http') ? newProduct.image : `${BASE_URL}${newProduct.image}`} className="preview-img img-thumbnail" alt="preview" />}
                    </Modal.Body>
                    <Modal.Footer className="bg-light sticky-footer">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={uploading}>Save Product</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* EDIT PRODUCT MODAL */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered className="admin-modal">
                {currentProduct && (
                    <Form onSubmit={handleUpdateProduct}>
                        <Modal.Header closeButton><Modal.Title>Edit Product</Modal.Title></Modal.Header>
                        <Modal.Body className="modal-scroll-area">
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Product Name</Form.Label>
                                <Form.Control type="text" value={currentProduct.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Price</Form.Label>
                                <Form.Control type="number" value={currentProduct.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Category</Form.Label>
                                <Form.Select value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} required>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </Form.Select>
                            </Form.Group>
                            {renderFileUpload(true)}
                            {currentProduct.image && <img src={currentProduct.image.startsWith('http') ? currentProduct.image : `${BASE_URL}${currentProduct.image}`} className="preview-img img-thumbnail" alt="edit preview" />}
                        </Modal.Body>
                        <Modal.Footer className="bg-light sticky-footer">
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button variant="primary" type="submit" disabled={uploading}>Update Product</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Modal>

            {/* ORDER VIEW MODAL */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg" centered>
                {currentOrder && (
                    <>
                        <Modal.Header closeButton><Modal.Title>Order #{currentOrder._id.substring(0,8)}</Modal.Title></Modal.Header>
                        <Modal.Body>
                            <p><strong>Customer:</strong> {currentOrder.user?.name}</p>
                            <p><strong>Status:</strong> <Badge bg="info">{currentOrder.status}</Badge></p>
                            <Form.Group className="mt-3">
                                <Form.Label>Update Status</Form.Label>
                                <Form.Select value={currentOrder.status} onChange={(e) => handleUpdateOrderStatus(currentOrder._id, e.target.value)}>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                    </>
                )}
            </Modal>
        </>
    );

    return (
        <div className="admin-dashboard container py-4">
            <h2 className="mb-4">Admin Dashboard</h2>
            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
            
            <Nav variant="tabs" activeKey={activeTab} onSelect={k => setActiveTab(k)} className="mb-4">
                <Nav.Item><Nav.Link eventKey="products">Products</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="orders">Orders</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="users">Users</Nav.Link></Nav.Item>
            </Nav>

            <div className="tab-content">
                {activeTab === 'products' && (
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center bg-white">
                            <h5 className="mb-0">Products</h5>
                            <Button variant="primary" onClick={() => setShowAddModal(true)}><FaPlus /> Add</Button>
                        </div>
                        <div className="card-body p-0">
                            <Table hover responsive className="align-middle mb-0">
                                <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p._id}>
                                            <td><div className="product-thumbnail-container"><ImageWithFallback src={p.image.startsWith('http') ? p.image : `${BASE_URL}${p.image}`} alt={p.name} fallbackText={p.name.charAt(0)} className="admin-product-thumb" /></div></td>
                                            <td>{p.name}</td><td>{formatPrice(p.price)}</td><td><Badge bg="secondary">{p.category}</Badge></td>
                                            <td>
                                                <Button variant="light" size="sm" onClick={() => { setCurrentProduct(p); setShowEditModal(true); }}><FaEdit className="text-primary"/></Button>
                                                <Button variant="light" size="sm" onClick={() => handleDeleteProduct(p._id)}><FaTrash className="text-danger"/></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <Table hover responsive className="align-middle mb-0">
                                <thead><tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {filteredOrders.map(o => (
                                        <tr key={o._id}>
                                            <td>{o._id.substring(0,8)}</td><td>{o.user?.name}</td><td>{formatPrice(o.totalPrice)}</td>
                                            <td><Badge bg="warning">{o.status}</Badge></td>
                                            <td><Button variant="light" size="sm" onClick={() => { setCurrentOrder(o); setShowOrderModal(true); }}><FaEye/></Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <Table hover responsive className="align-middle mb-0">
                                <thead><tr><th>Name</th><th>Email</th><th>Admin</th></tr></thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td>{u.isAdmin ? '✅' : '❌'}</td></tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
            {renderModals()}
        </div>
    );
};

export default AdminDashboard;