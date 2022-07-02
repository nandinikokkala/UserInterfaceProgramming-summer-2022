import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {Container, Navbar, Nav, Offcanvas,Button } from 'react-bootstrap'
import jwt_decode from "jwt-decode";
import axios from 'axios';
import {SERVER_URL} from '../config/config'
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

    const [name, setName] = useState(false);
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get(SERVER_URL+'users/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            //console.log('Token',response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
            
        } catch (error) {
            if (error.response) {
                //navigate("/");
            }
        }
    }

    const Logout = async () => {
        try {
            await axios.delete(SERVER_URL+'users/logout');
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container>
            <Navbar  bg="light" expand="lg" className="mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">MEDIA APP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
                    <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-lg"
                    aria-labelledby="offcanvasNavbarLabel-expand-lg"
                    placement="end"
                    >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                        Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            { name && 
                                <>
                                    <NavLink to="/profile" className="nav-link">Profile</NavLink>
                                    <Navbar.Text>
                                        Signed in as: <a>{name}</a>
                                    </Navbar.Text>
                                    <Button onClick={Logout} className="ml-3"  variant="primary">Sign Out</Button>
                                </>
                            }
                            {!name &&
                                <>
                                    <NavLink to="/" className="btn btn-warning me-md-2">Login</NavLink>
                                    <NavLink to="/register" className="btn btn-success">Signup</NavLink>
                                </>
                            }
                            
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </Container>
    )
}
export default NavBar;