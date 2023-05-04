import { PaymentElement } from "@stripe/react-stripe-js";
import { Form, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";
import {
  ORDER_CREATE_RESET,
  ORDER_CREATE_SUCCESS,
} from "../constants/orderConstants";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { prices } = useSelector((state) => state.orderTotal);
  const { subtotal = 0, shipping = 0, tax = 0, total = 0 } = prices || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required'
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else {
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

      if (createOrderResult.type === ORDER_CREATE_SUCCESS) {
        navigate(`/order/${createOrderResult.payload._id}`);
        dispatch({ type: ORDER_CREATE_RESET });
      }
    }
  };

  return (
    <Form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className="mt-3 w-100"
        type="submit"
      >
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <Message id="payment-message" className="mt-3" variant="info">
          {message}
        </Message>
      )}
    </Form>
  );
}

export default CheckoutForm;
