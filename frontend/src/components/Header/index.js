import React from "react";
import { useSelector } from "react-redux";
import { Navbar, Nav, Container } from "react-bootstrap";
import Badge from 'react-bootstrap/Badge'
import { LinkContainer } from "react-router-bootstrap";
import UserInfo from './UserInfo';


function Header() {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <header>
      <Navbar bg="black" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={"images/logo_cut.png"} style={{width:400, marginTop: -7}} alt='Annedora'/>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart">
                    <Badge pill className="bg-danger">{Object.keys(cartItems).length}</Badge>
                  </i>
                </Nav.Link>
              </LinkContainer>
              <UserInfo />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
export default Header;
