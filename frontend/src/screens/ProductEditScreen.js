import { useState, useEffect } from "react";
import second from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import {
  listProductDetails,
  updateProduct,
  uploadProductImage,
} from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

function ProductEditScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    error: errorUpdate,
    loading: loadingUpdate,
    success: successUpdate,
  } = productUpdate;

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("Annedora");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productList");
    } else {
      if (!product.name || product._id !== Number(id)) {
        dispatch(listProductDetails(id));
      } else {
        setName(product.name);
        setPrice(product.price);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [id, product, navigate, dispatch, successUpdate]);

  const uploadFileHandler = async (e) => {
    setUploading(true);

    const file = e.target.files[0];
    dispatch(uploadProductImage(file, id));

    setUploading(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: product._id,
        name,
        price,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  return (
    <div>
      <Link to="/admin/productList">Go Back</Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>

              <Form.Control type="file" onChange={uploadFileHandler} />

              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="btn-block w-100 mt-3"
            >
              UPDATE
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
}

export default ProductEditScreen;
