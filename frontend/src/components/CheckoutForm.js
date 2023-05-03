import { CardElement } from "@stripe/react-stripe-js";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import Message from "../components/Message";

function CheckoutForm(clientSecret) {
    const stripe = useStripe();
    const elements = useElements();
  
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
  
      setIsProcessing(true);
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });
  
      if (error) {
        console.log("[error]", error);
        setMessage(error.message);
        setIsProcessing(false);
      } else {
        const confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });
  
        if (confirmResult.error) {
          console.log("[error]", confirmResult.error);
          setMessage(confirmResult.error.message);
          setIsProcessing(false);
        } else {
          // Payment succeeded, redirect to a success page or handle the result as needed
          setMessage("Payment succeeded!");
          setIsProcessing(false);
        }
      }
    };
  
    return (
      <Form id="payment-form" onSubmit={handleSubmit}>
        <CardElement id="payment-element" />
        <Button disabled={isProcessing || !stripe || !elements} id="submit">
          <span id="button-text">
            {isProcessing ? "Processing ... " : "Pay now"}
          </span>
        </Button>
        {/* Show any error or success messages */}
        {message && <Message id="payment-message">{message}</Message>}
      </Form>
    );
}

export default CheckoutForm

