import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from '../components/ProductCarousel'
import { listProducts } from '../actions/productActions';

function ProductRow() {
  const dispatch = useDispatch();
  const { error, loading, products } = useSelector((state) => state.productList);
  
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);


  // use early returns outside of your main render to avoid cluttering the actual ui being returned
  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  
  return (
    <Row>
      {products.map((product) => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3} style={{ display: 'flex' }}>
          <Product product={product} />
        </Col>
      ))}
    </Row>
  );
}

function HomeScreen() {
  return (
    <div>
      <h1 className='mt-3'>Featured</h1>
      <ProductCarousel/>
      <h1 className='mt-5'>Natural Products</h1>
      <ProductRow />
    </div>
  );
}

export default HomeScreen;
