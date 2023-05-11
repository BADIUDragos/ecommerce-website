import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Tabs, Tab, FormControl } from "react-bootstrap";
import { Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrders } from "../actions/orderActions";
import moment from "moment";

function OrderTable({ filteredOrders }) {

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (currentPage > 1) {
      paginationItems.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} />
      );
      paginationItems.push(
        <Pagination.Prev key="prev" onClick={() => onPageChange(currentPage - 1)} />
      );
    }

    for (let i = 1; i <= totalPages; i++) {
      if (Math.abs(currentPage - i) <= 2 || i === 1 || i === totalPages) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    if (currentPage < totalPages) {
      paginationItems.push(
        <Pagination.Next key="next" onClick={() => onPageChange(currentPage + 1)} />
      );
      paginationItems.push(
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} />
      );
    }

    return paginationItems;
  };


  return (
    <>
    <Table striped bordered hover responsive className="table-sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>USER</th>
          <th>DATE</th>
          <th>TOTAL</th>
          <th>PAID</th>
          <th>SHIPPED</th>
          <th>DELIVERED</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {currentOrders.map((order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.user && order.user.name}</td>
            <td>{moment(order.createdAt).format("MMMM Do, YYYY")}</td>
            <td>${order.totalPrice}</td>
            <td>
              {order.isPaid ? (
                moment(order.paidAt).format("MMMM Do, YYYY")
              ) : (
                <i className="fas fa-times" style={{ color: "red" }}></i>
              )}
            </td>
            <td>
              {order.isShipped ? (
                moment(order.shippedAt).format("MMMM Do, YYYY")
              ) : (
                <i className="fas fa-times" style={{ color: "red" }}></i>
              )}
            </td>
            <td>
              {order.isDelivered ? (
                moment(order.deliveredAt).format("MMMM Do, YYYY")
              ) : (
                <i className="fas fa-times" style={{ color: "red" }}></i>
              )}
            </td>
            <td>
              <LinkContainer to={`/order/${order._id}`}>
                <Button variant="light" className="btn-sm">
                  DETAILS
                </Button>
              </LinkContainer>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    <Pagination>{renderPaginationItems()}</Pagination>
 </>
);
}

function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      navigate("/");
    }
  }, [dispatch, navigate, userInfo]);

  const filteredOrders = (orders) => {
    return orders.filter((order) =>
      order.user && order.user.name
        ? order.user.name.toLowerCase().includes(search.toLowerCase())
        : false
    );
  };

  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <div>
      <h1>Orders</h1>
      <FormControl
        className="mb-3"
        type="text"
        placeholder="Search by User"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Tabs defaultActiveKey="toShip" id="orders-tabs">
        <Tab eventKey="toShip" title="To Ship">
        <OrderTable
            filteredOrders={filteredOrders(
              orders
                .filter((order) => !order.isShipped)
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            )}
          />
        </Tab>
        <Tab eventKey="toDeliver" title="To Deliver">
          <OrderTable
            filteredOrders={filteredOrders(
              orders
              .filter((order) => order.isShipped && !order.isDelivered)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              )}
          />
        </Tab>
        <Tab eventKey="delivered" title="Delivered">
          <OrderTable
            filteredOrders={filteredOrders(
              orders
              .filter((order) => order.isShipped && order.isDelivered)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              )}
          />
        </Tab>
        <Tab eventKey="allOrders" title="All Orders">
          <OrderTable
            filteredOrders={filteredOrders(
              orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              )}
          />
        </Tab>
      </Tabs>
    </div>
  );
}

export default OrderListScreen;
