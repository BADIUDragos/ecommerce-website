import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_PASSWORD_RESET_REQUEST,
  USER_PASSWORD_RESET_SUCCESS,
  USER_PASSWORD_RESET_FAIL,
  USER_PASSWORD_RESET_VALIDATE_TOKEN_REQUEST,
  USER_PASSWORD_RESET_VALIDATE_TOKEN_SUCCESS,
  USER_PASSWORD_RESET_VALIDATE_TOKEN_FAIL,
  USER_PASSWORD_RESET_CHANGE_REQUEST,
  USER_PASSWORD_RESET_CHANGE_SUCCESS,
  USER_PASSWORD_RESET_CHANGE_FAIL,
} from "../constants/userConstants";

import { ORDER_LIST_MY_RESET } from "../constants/orderConstants";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import { CART_CLEAR_ITEMS } from "../constants/cartConstants";

export const login = (email, password) => async (dispatchEvent) => {
  try {
    dispatchEvent({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login/",
      { username: email, password: password },
      config
    );

    dispatchEvent({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatchEvent({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const logout = () => (dispatchEvent) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("paymentMethod");
  dispatchEvent({ type: USER_LOGOUT });
  dispatchEvent({ type: USER_DETAILS_RESET });
  dispatchEvent({ type: ORDER_LIST_MY_RESET });
  dispatchEvent({ type: USER_LIST_RESET });
  dispatchEvent({ type: PRODUCT_CREATE_REVIEW_RESET})
  dispatchEvent({ type: CART_CLEAR_ITEMS})
};

export const register = (name, email, password) => async (dispatchEvent) => {
  try {
    dispatchEvent({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/register/",
      { name: name, email: email, password: password },
      config
    );

    dispatchEvent({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    dispatchEvent({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatchEvent({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: USER_DETAILS_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatchEvent({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/users/profile/update/`,
      user,
      config
    );

    dispatchEvent({
      type: USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    dispatchEvent({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatchEvent({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listUsers = () => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/`, config);

    dispatchEvent({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: USER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteUser = (id) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/users/delete/${id}`, config);

    dispatchEvent({
      type: USER_DELETE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateUser = (user) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: USER_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/users/update/${user._id}`,
      user,
      config
    );

    dispatchEvent({
      type: USER_UPDATE_SUCCESS,
    });

    dispatchEvent({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: USER_UPDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const resetPasswordRequest = (email) => async (dispatchEvent) => {
  try {
    dispatchEvent({
      type: USER_PASSWORD_RESET_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/password_reset/",
      { email: email },
      config
    );

    dispatchEvent({
      type: USER_PASSWORD_RESET_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: USER_PASSWORD_RESET_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const resetPasswordRequestVerifyToken = (uid, token) => async (dispatchEvent) => {
  try {
    dispatchEvent({
      type: USER_PASSWORD_RESET_VALIDATE_TOKEN_REQUEST,
    });

    const config = {
      params: { uid: uid, token: token },
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.get(
      "/api/users/validate_token/",
      config
    );

    dispatchEvent({
      type: USER_PASSWORD_RESET_VALIDATE_TOKEN_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: USER_PASSWORD_RESET_VALIDATE_TOKEN_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const changePasswordRequest = (uid, token, password) => async (dispatchEvent) => {
  try {
    dispatchEvent({
      type: USER_PASSWORD_RESET_CHANGE_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/update_password/",
      { uid: uid, token: token, password: password },
      config
    );

    dispatchEvent({
      type: USER_PASSWORD_RESET_CHANGE_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: USER_PASSWORD_RESET_CHANGE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};