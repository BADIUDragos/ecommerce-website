import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { resetPasswordRequest } from "../actions/userActions";

function ResetPasswordScreen() {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const passwordReset = useSelector((state) => state.userPasswordReset)
  const { success, loading, error} = passwordReset

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(resetPasswordRequest(email))
  }

  return (
    <FormContainer>
      <h1>Reset Password</h1>

      {!success && 
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="email">
            <Form.Label>Please enter your email address:</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="btn-block w-100 mt-3 mb-3 visible">
            Reset Password
          </Button>
        </Form>
      }

      {error && <Message variant="danger">{error}</Message>}
      {success && 
      <Message variant="success">Please check your email in order to reset your password.</Message>}
      {loading && <Loader />}
     
    </FormContainer>
  );
}

export default ResetPasswordScreen;
