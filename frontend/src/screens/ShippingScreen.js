import { useState, useEffect } from "react";
import { Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { saveShippingAddress } from "../actions/cartActions";

function ShippingScreen() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);

  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (!userDetails){
      navigate('/')
    }
  }, [navigate, userDetails])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode }));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Address:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" class='mt-3'>
          <Form.Label>City:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="City"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" class='mt-3'>
          <Form.Label>Postal Code:</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Postal Code"
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" class='mt-3'>
          <Form.Label>Country:</Form.Label>
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="shipping-tooltip">
                We're only shipping within Canada momentarily
              </Tooltip>
            }
          >
            <Form.Control disabled value={"Canada"} type="text" />
          </OverlayTrigger>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
