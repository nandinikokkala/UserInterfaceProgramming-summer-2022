import React from 'react';
import { NavLink } from 'react-router-dom';
import {Container, Navbar, Nav, Offcanvas, } from 'react-bootstrap'

const NavBar = () => {
    return (
        <Container>
            <Navbar  bg="light" expand="lg" className="mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">APP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
                    <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-lg"
                    aria-labelledby="offcanvasNavbarLabel-expand-lg"
                    placement="end"
                    >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                        Offcanvas
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                            <NavLink to="/login" className="btn btn-warning me-md-2">Login</NavLink>
                            <NavLink to="/register" className="btn btn-success">Signup</NavLink>
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </Container>
    )
}
export default NavBar;