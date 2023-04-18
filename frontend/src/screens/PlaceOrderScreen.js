import { useEffect, useState } from "react";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  createOrder,
  getTotal,
  getStripeInfo,
  createPaymentIntent,
} from "../actions/orderActions";
import {
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
} from "../constants/orderConstants";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [stripeFetched, setStripeFetched] = useState(false);
  const { info } = useSelector((state) => state.orderStripeInfo);
  const { stripe_public } = info || {};

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getStripeInfo());
      setStripeFetched(true);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (stripe_public && stripeFetched && !stripePromise) {
      const loadStripePromise = async () => {
        const stripe = await loadStripe(stripe_public);
        setStripePromise(stripe);
      };

      loadStripePromise();
    }})

    useEffect(() => {
      const getClientSecret = async () => {
        if (stripePromise) {
          const paymentIntentData = dispatch(createPaymentIntent());
          setClientSecret(paymentIntentData.client_secret);
        }
      };
      getClientSecret();
  }, [stripePromise, dispatch]);
  

  return (
    <>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

function OrderSummary(props) {
  const dispatch = useDispatch();

  const { cart } = props;
  const { cartItems } = cart;
  const items = cartItems.map((item) => ({
    id: item.product,
    qty: item.qty,
  }));

  useEffect(() => {
    dispatch(getTotal(items));
  }, [dispatch]);

  const { error, loading, prices } = useSelector((state) => state.orderTotal);
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = prices || {};

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  return (
    <Card>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <h2>Order Summary</h2>
        </ListGroup.Item>

        <ListGroup.Item>
          <Row>
            <Col>Subtotal:</Col>
            <Col>${subtotal}</Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item>
          <Row>
            <Col>Shipping:</Col>
            <Col>${shipping}</Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item>
          <Row>
            <Col>Taxes:</Col>
            <Col>${tax}</Col>
          </Row>
        </ListGroup.Item>

        <ListGroup.Item>
          <Row>
            <Col>Total:</Col>
            <Col>${total}</Col>
          </Row>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

function PlaceOrderScreen() {
  const cart = useSelector((state) => state.cart);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Shipping:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},
                {"   "}
                {cart.shippingAddress.postalCode},{"   "}
                {"Canada"}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <OrderSummary cart={cart} />
          <Payment />
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
