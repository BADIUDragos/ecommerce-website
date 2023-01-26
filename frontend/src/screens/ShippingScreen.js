import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from '../actions/cartActions'

function ShippingScreen() {

  const navigate = useNavigate()
  const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart

  const dispatch = useDispatch()

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({address, city, postalCode}))
    navigate('/payment')
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="address">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Address"
              value={address ? address : ''}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="city">
            <Form.Label>City:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="City"
              value={city ? city : ''}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          
          <Form.Group controlId="postalCode">
            <Form.Label>Postal Code:</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Postal Code"
              value={postalCode ? postalCode : ''}
              onChange={(e) => setPostalCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          
          <Form.Group controlId="country">
            <Form.Label>Country:</Form.Label>
            <Form.Control
              disabled
              value={'Canada'}
              type="text"
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="mt-3 w-100">
            Continue
          </Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreen