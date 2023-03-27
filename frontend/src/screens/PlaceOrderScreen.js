import { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder, getTotal } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

function OrderSummary() {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
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

        {/* <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item> */}

        <ListGroup.Item>
          <Button
            type="button"
            className="w-100"
            // disabled={cart.cartItems === 0}
            // onClick={placeOrder}
          >
            Place Order
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}

function PlaceOrderScreen() {
  const navigate = useNavigate();

  // const orderCreate = useSelector((state) => state.orderCreate);
  // const { order, error, success } = orderCreate;

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // if (!cart.paymentMethod) {
  //   navigate("/payment");
  // }
  // if (cart.cartItems.length === 0) {
  //   navigate("/");
  // }

  // useEffect(() => {
  //   if (success) {
  //     navigate(`/order/${order._id}`);
  //     dispatch({ type: ORDER_CREATE_RESET });
  //   }
  // }, [success, navigate]);

  // const placeOrder = () => {
  //   dispatch(
  //     createOrder({
  //       orderItems: cart.cartItems,
  //       shippingAddress: cart.shippingAddress,
  //       paymentMethod: cart.paymentMethod,
  //       itemsPrice: cart.itemsPrice,
  //       shippingPrice: cart.shippingPrice,
  //       taxPrice: cart.taxPrice,
  //       totalPrice: cart.totalPrice,
  //     })
  //   );
  // };

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
          <OrderSummary />
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
