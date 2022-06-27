import React from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <p className="text-center"><Link to="/login">Login</Link></p>
                        </Card.Body>
                    </Card> 
                </Col>
            </Row>
        </Container>
    )
}
export default Home;