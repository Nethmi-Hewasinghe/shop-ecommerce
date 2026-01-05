// src/pages/admin/ProductEditPage.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductDetails } from '../../actions/productActions';
import { PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } from '../../constants/productConstants';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import axios from 'axios';

const ProductEditPage = () => {
  const { id } = useParams();
  const productId = id;
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productCreate = useSelector((state) => state.productCreate);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = productCreate;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate('/admin/productlist');
    }

    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate('/admin/productlist');
    }

    if (productId) {
      if (!product || product._id !== productId) {
        dispatch(getProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
        setImage(product.image);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setImagePreview(product.image);
      }
    } else {
      // Reset form for new product
      setName('');
      setPrice(0);
      setDescription('');
      setImage('');
      setCategory('');
      setCountInStock(0);
      setImagePreview('');
    }
  }, [dispatch, product, productId, successCreate, successUpdate, navigate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data.image);
      setImagePreview(data.image);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      setMessage('Image upload failed. Please try again.');
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (productId) {
      // Update product
      dispatch(
        updateProduct({
          _id: productId,
          name,
          price,
          description,
          image,
          category,
          countInStock,
        })
      );
    } else {
      // Create product
      dispatch(
        createProduct({
          name,
          price,
          description,
          image,
          category,
          countInStock,
        })
      );
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h1 className="my-4">{productId ? 'Edit Product' : 'Add New Product'}</h1>
          
          {message && <Message variant="danger">{message}</Message>}
          {errorCreate && <Message variant="danger">{errorCreate}</Message>}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          
          {loadingCreate || loadingUpdate ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="price" className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </Form.Group>

              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mb-2"
                />
                <Form.Control
                  type="file"
                  label="Choose File"
                  onChange={uploadFileHandler}
                  className="mb-2"
                />
                {uploading && <Loader />}
                {imagePreview && (
                  <div className="mt-2">
                    <Image src={imagePreview} alt="Preview" fluid style={{ maxHeight: '200px' }} />
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="countInStock" className="mb-3">
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(Number(e.target.value))}
                  required
                />
              </Form.Group>

              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="my-3">
                {productId ? 'Update' : 'Create'}
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductEditPage;