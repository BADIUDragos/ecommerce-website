import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,

    ORDER_DETAILS_REQUEST, 
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,

    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,

    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,

    ORDER_SHIPPED_REQUEST,
    ORDER_SHIPPED_SUCCESS,
    ORDER_SHIPPED_FAIL,

    ORDER_DELIVERED_REQUEST,
    ORDER_DELIVERED_SUCCESS,
    ORDER_DELIVERED_FAIL,

    ORDER_GET_TOTAL_REQUEST,
    ORDER_GET_TOTAL_SUCCESS,
    ORDER_GET_TOTAL_FAIL,

    ORDER_GET_STRIPE_INFO_REQUEST,
    ORDER_GET_STRIPE_INFO_SUCCESS,
    ORDER_GET_STRIPE_INFO_FAIL,
  } from "../constants/orderConstants";

import { CART_CLEAR_ITEMS } from '../constants/cartConstants'


export const createOrder = (order) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: ORDER_CREATE_REQUEST,
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

    const { data } = await axios.post(
      `/api/orders/add/`,
      order,
      config
    );

    const dispatchedAction = dispatchEvent({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });

    dispatchEvent({
      type: CART_CLEAR_ITEMS,
      payload: data,
    });

    localStorage.removeItem('cartItems')
    return dispatchedAction

  } catch (error) {
    dispatchEvent({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getOrderDetails = (id) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: ORDER_DETAILS_REQUEST,
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

    const { data } = await axios.get(
      `/api/orders/${id}/`,
      config
    );

    dispatchEvent({
      type: ORDER_DETAILS_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listMyOrders = () => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: ORDER_LIST_MY_REQUEST,
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

    const { data } = await axios.get(
      `/api/orders/myorders/`,
      config
    );

    dispatchEvent({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listOrders = () => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: ORDER_LIST_REQUEST,
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

    const { data } = await axios.get(
      `/api/orders/`,
      config
    );

    dispatchEvent({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const markOrderAsShipped = (id) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: ORDER_SHIPPED_REQUEST,
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
      `/api/orders/${id}/shipped/`,
      {},
      config
    );

    dispatchEvent({
      type: ORDER_SHIPPED_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: ORDER_SHIPPED_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const markOrderAsDelivered = (id) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: ORDER_DELIVERED_REQUEST,
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
      `/api/orders/${id}/delivered/`,
      {},
      config
    );

    dispatchEvent({
      type: ORDER_DELIVERED_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatchEvent({
      type: ORDER_DELIVERED_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const getTotal = (items) => async(dispatch, getState) => {
  try {
      
      dispatch({
          type: ORDER_GET_TOTAL_REQUEST
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      };

      const { data } = await axios.post(`/api/orders/total/`, items, config);

      dispatch({
          type: ORDER_GET_TOTAL_SUCCESS,
          payload: data
      });
  } catch (error) {
      dispatch({
          type: ORDER_GET_TOTAL_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
}

export const getStripeInfo = () => async(dispatch, getState) => {
  try {
      
      dispatch({
          type: ORDER_GET_STRIPE_INFO_REQUEST
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
          }
      };

      const { data } = await axios.get(`/api/orders/stripe/`, config);

      dispatch({
          type: ORDER_GET_STRIPE_INFO_SUCCESS,
          payload: data
      });

  } catch (error) {
      dispatch({
          type: ORDER_GET_STRIPE_INFO_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
}

export const createPaymentIntent = (amount) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'CHECKOUT_SESSION_REQUEST' });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`
        }
    };
    const { data } = await axios.post('/api/orders/payment-intent/', amount, config);

    dispatch({ type: 'CHECKOUT_SESSION_SUCCESS' });
    return data;
  } catch (error) {
    dispatch({
      type: 'CHECKOUT_SESSION_FAIL',
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};