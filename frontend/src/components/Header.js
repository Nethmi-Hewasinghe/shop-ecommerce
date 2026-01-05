import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import '../styles/Header.css';

const Header = () => {
    const navigate = useNavigate();
    const { cartItems, openCart, cartCount } = useContext(CartContext);
    const userInfo = localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null;

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems');
        navigate('/login');
        window.location.reload();
    };

    const getNavLinkClass = ({ isActive }) => 
        "nav-item-link" + (isActive ? " active-link" : "");

    return (
        <header className="unibuy-header-wrapper">
            <div className="top-banner-bar">
                ✨ FREE SHIPPING ON ALL ORDERS OVER Rs. 2000! USE CODE: STUDENTLIFE ✨
            </div>

            <Navbar className="unibuy-navbar">
                <Container fluid className="d-flex justify-content-between align-items-center">
                    {/* Brand */}
                    <Navbar.Brand as={NavLink} to="/" end className="unibuy-brand">
                        <span className="brand-icon">🌸</span> UniBuy
                    </Navbar.Brand>

                    {/* Links */}
                    <Nav className="nav-horizontal">
                        <Nav.Link onClick={openCart} className="position-relative">
                            <FaShoppingCart className="me-1" />
                            Cart
                            {cartCount > 0 && (
                                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <Nav.Link onClick={openCart} className="position-relative">
                            <FaShoppingCart className="me-1" />
                            Cart
                            {cartCount > 0 && (
                                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                                    {cartCount}
                                </Badge>
                            )}
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/orders" className={getNavLinkClass}>
                            My Orders
                        </Nav.Link>

                        {userInfo ? (
                            <>
                                <Nav.Link onClick={logoutHandler} className="nav-item-link">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <Nav.Link as={NavLink} to="/login" className="nav-item-link login-pill">
                                Sign In
                            </Nav.Link>
                        )}

                        {userInfo && userInfo.isAdmin && (
                            <NavDropdown title="Admin" id="adminmenu" className="unibuy-dropdown admin-tag">
                                <NavDropdown.Item as={NavLink} to="/admin" className={getNavLinkClass}>
                                    Dashboard
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
