import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/users/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (error) {
            alert('Invalid Email or Password');
        }
    };

    return (
        <Row className='justify-content-md-center mt-5'>
            <Col xs={12} md={6}>
                <h1>Sign In</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button type='submit' variant='primary'>Sign In</Button>
                </Form>
                <Row className='py-3'>
                    <Col>New Customer? <Link to='/register'>Register</Link></Col>
                </Row>
            </Col>
        </Row>
    );
};
export default LoginPage;