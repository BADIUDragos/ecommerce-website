import { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder, getTotal, getPayPalInfo } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalPayment(props) {
  const { cart, prices } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error:errorCreateOrder, success } = orderCreate;

  useEffect(() => {
    dispatch(getPayPalInfo());
  }, [dispatch]);

  if (!cart.paymentMethod) {
    navigate("/payment");
  }

  const { error, loading, info } = useSelector(
    (state) => state.orderPayPalInfo
  );
  const { client_id = 0, currency = 0 } = info || {};
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = prices || {};

  const successPaymentHandler = async (paymentResult) => {
    const createOrderResult = await dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      })
    );
  
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  };

  if (loading & !info) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (errorCreateOrder) return <Message variant="danger">{error}</Message>;

  return (
    <PayPalScriptProvider
      options={{
        "client-id": client_id,
        currency: currency,
        "disable-funding": "card",
      }}
    >
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order
            .create({
              purchase_units: [
                {
                  amount: {
                    value: total,
                  },
                },
              ],
            })
            .then((orderId) => {
              // Your code here after create the order
              return orderId;
            });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(function (details) {
            successPaymentHandler(details);
          });
        }}
      />
    </PayPalScriptProvider>
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

        <ListGroup.Item>
          <PayPalPayment total={total} cart={cart} prices={prices} />
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
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
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
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
