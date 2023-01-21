import axios from "axios";
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL} 
from "../constants/userConstants";

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
  dispatchEvent({
    type: USER_LOGOUT,
  });
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
      {name: name, email: email, password: password },
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
