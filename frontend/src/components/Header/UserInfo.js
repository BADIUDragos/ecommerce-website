import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { logout } from '../../actions/userActions';

function Login() {
    return (
      <LinkContainer to="/login">
        <Nav.Link>
          <div className="fas fa-user" style={{ marginRight: '0.4rem' }}/>
          Login
        </Nav.Link>
      </LinkContainer>
    );
}

function UserInfo() {
    const { userInfo } = useSelector((state) => state.userLogin);

    const dispatch = useDispatch()
    const navigate = useNavigate()
  
    const logoutHandler = () => {
      dispatch(logout())
      navigate('/')
    }

    if (!userInfo) return <Login />;

    return (
      <>
        <NavDropdown title={userInfo.name} id="username">
            <LinkContainer to="/profile">
                <NavDropdown.Item>
                    Profile
                </NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Item onClick={logoutHandler}>
            {" "}
            Logout{" "}
            </NavDropdown.Item>
        </NavDropdown>
        {userInfo.isAdmin ? (
            <NavDropdown title='Admin' id="adminmenu">
                <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item> Users </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item> Products </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item> Orders </NavDropdown.Item>
                </LinkContainer>
            </NavDropdown>
        ) : null}

      </>
    );
};

export default UserInfo;
