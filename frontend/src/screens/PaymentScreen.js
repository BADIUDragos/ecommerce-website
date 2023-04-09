import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from '../actions/cartActions'

function PaymentScreen() {

  const navigate = useNavigate()

  const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart

  const dispatch = useDispatch()

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  if(!shippingAddress.address) {
    navigate('/shipping')
  }

  const userDetails = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (!userDetails){
      navigate('/')
    }
  }, [navigate, userDetails])

  const submitHandler = (e) =>{
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3/>

      <Form onSubmit={submitHandler}>

        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              label='PayPal'
              id='paypal'
              name='paymentMethod'
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            >

            </Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3 w-100">
          Continue
        </Button>
      </Form>

    </FormContainer>
  )
}

export default PaymentScreen