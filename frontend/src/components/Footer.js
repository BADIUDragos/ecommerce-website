import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";

function Footer() {
  return (
    <footer>
      <Container>
        <Row>
          <Col md={6}>
              About us:<br/>
            Put company description here ? Mesajul/ misiunea scrisa deja ?
              
            
          </Col>
          
          <Col md={3}>
            <ListGroup variant="flush">
              Contact info: 
              <ListGroup.Item className="mt-3">
                <i className="fa-solid fa-envelope"></i> info@annedora.ca
              </ListGroup.Item>
              <ListGroup.Item>
                <i className="fa-solid fa-phone"></i> + 1 (514) 123-4567
              </ListGroup.Item>
              <ListGroup.Item>
              <i className="fa-solid fa-location-dot"></i> Chateauguay, QC, Canada
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3} >
            <ListGroup variant='flush'>
              Follow the bees on social media !
              <ListGroup.Item action href="https://www.instagram.com/miellerie.annedora/" className="mt-3">
                <i className="fa-brands fa-instagram"></i> miellerie.annedora
              </ListGroup.Item>
              <ListGroup.Item action href="https://www.facebook.com/profile.php?id=100087444407877">
                <i className="fa-brands fa-facebook"></i> Miellerie Annedora
              </ListGroup.Item>
              <ListGroup.Item action href="https://www.tiktok.com/@miellerieannedoraa">
                <i className="fa-brands fa-tiktok"></i> miellerieannedoraa
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center py-3"> Copyright &copy; Annedora
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
