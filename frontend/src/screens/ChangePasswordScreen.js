import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { resetPasswordVerifyToken } from "../actions/userActions";

function ResetPasswordScreen() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("")

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetPasswordVerifyToken(uid, token));
  }, [dispatch]);

  const passwordResetValidate = useSelector((state) => state.userPasswordResetValidate);
  const { loading: loadingValidate, error: errorValidate } = passwordResetValidate;

  const passwordReset = useSelector((state) => state.userPasswordReset);
  const { success, loading, error } = passwordReset;

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch()
    }
  };

  return (
    <FormContainer>
      <h1>Change Password</h1>

      {loadingValidate && <Loader/>}

      {!success && !errorValidate && !loadingValidate && (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="password">
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter a new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirm-password" className="mt-3">
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="btn-block w-100 mt-3 mb-3"
          >
            Reset Password
          </Button>
        </Form>
      )}

      {errorValidate && <Message variant="danger">{errorValidate}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {success && (
        <Message variant="success">
          Please check your email in order to reset your password.
        </Message>
      )}
      {loading && <Loader />}
    </FormContainer>
  );
}

export default ResetPasswordScreen;
