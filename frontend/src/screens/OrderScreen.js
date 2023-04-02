import { useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, markOrderAsShipped, markOrderAsDelivered } from "../actions/orderActions";
import moment from "moment";
import { ORDER_SHIPPED_RESET, ORDER_DELIVERED_RESET } from '../constants/orderConstants'

function OrderScreen() {

  const { id } = useParams();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderShipped = useSelector((state) => state.orderShipped);
  const { loading: loadingShipped, error: errorShipped, success: successShipped } = orderShipped;

  const orderDelivered = useSelector((state) => state.orderDelivered);
  const { loading: loadingDelivered, error: errorDelivered, success: successDelivered } = orderDelivered;

  const dispatch = useDispatch();

  useEffect(() => {
    if(!userInfo){
      navigate('/')
    }

    if (!order || order._id !== Number(id) || successShipped || successDelivered ) {
      dispatch({type:ORDER_SHIPPED_RESET})
      dispatch({type:ORDER_DELIVERED_RESET})
      dispatch(getOrderDetails(id));
    }
  }, [order, id, dispatch, successShipped, successDelivered, navigate, userInfo]);

  const markAsShippedHandler = () => {
    dispatch(markOrderAsShipped(id))
  }

  const markAsDeliveredHandler = () => {
    dispatch(markOrderAsDelivered(id))
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <h1>Order: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}{" "}
              </p>
              <p>
                <strong>Email: </strong> {order.user.email}{" "}
              </p>
              <p>
                <strong>Shipping:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},
                {"   "}
                {order.shippingAddress.postalCode},{"   "}
                {"Canada"}
              </p>

              {order.isShipped ? (
                <Message variant="success">
                  Shipped on{" "}
                  {moment(order.shippedAt).format("MMMM Do, YYYY")}
                </Message>
              ) : (
                <Message variant="warning">Not Shipped</Message>
              )}
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on{" "}
                  {moment(order.deliveredAt).format("MMMM Do, YYYY")}
                </Message>
              ) : (
                <Message variant="warning">Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>

              {order.isPaid ? (
                <Message variant="success">
                  Paid on {moment(order.paidAt).format("MMMM Do, YYYY")} at {moment(order.paidAt).format("h:mm a")} EST
                </Message>
              ) : (
                <Message variant="warning">Not paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant="info">Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
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
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Taxes:</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
            
            {userInfo && userInfo.isAdmin && order.isPaid &&  (
              <ListGroup>
                <ListGroup.Item>
                  <Button 
                    type="button"
                    className="btn btn-block w-100"
                    onClick={markAsShippedHandler} >
                    Mark As Shipped
                  </Button>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button 
                    type="button"
                    className="btn btn-block w-100"
                    onClick={markAsDeliveredHandler} >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            )}

          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
