import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
    const navigate = useNavigate();
    const userInfo = localStorage.getItem('userInfo') 
        ? JSON.parse(localStorage.getItem('userInfo')) 
        : null;

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems');
        navigate('/login');
        window.location.reload(); // Refresh to clear state
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Navbar.Brand as={Link} to="/">STUDENT SHOP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/cart">
                                <i className="fas fa-shopping-cart"></i> Cart
                            </Nav.Link>
                            
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id='username'>
                                    <NavDropdown.Item as={Link} to='/orders'>
                                        <i className='fas fa-shopping-bag me-1'></i> My Orders
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={logoutHandler}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} to="/login">
                                    <i className="fas fa-user"></i> Sign In
                                </Nav.Link>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu'>
                                    <NavDropdown.Item as={Link} to='/admin'>
                                        Dashboard
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/admin/products'>
                                        Products
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;