import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_IMAGE_UPLOAD_REQUEST,
  PRODUCT_IMAGE_UPLOAD_SUCCESS,
  PRODUCT_IMAGE_UPLOAD_FAIL,
} from "../constants/productConstants";

export const listProducts = () => async (dispatchEvent) => {
  try {
    dispatchEvent({ type: PRODUCT_LIST_REQUEST });

    const { data } = await axios.get("/api/products/");

    dispatchEvent({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatchEvent) => {
  try {
    dispatchEvent({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatchEvent({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: PRODUCT_DELETE_REQUEST,
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

    const { data } = await axios.delete(`/api/products/delete/${id}`, config);

    dispatchEvent({
      type: PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatchEvent({
      type: PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const createProduct = () => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: PRODUCT_CREATE_REQUEST,
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

    const { data } = await axios.post(`/api/products/create/`, {}, config);

    dispatchEvent({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatchEvent({
      type: PRODUCT_CREATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const updateProduct = (product) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: PRODUCT_UPDATE_REQUEST,
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
      `/api/products/update/${product._id}`,
      product,
      config
    );

    dispatchEvent({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    });

    dispatchEvent({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
    
  } catch (error) {
    dispatchEvent({
      type: PRODUCT_UPDATE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const uploadProductImage = (file, productId) => async (dispatch) => {
  try {
      
      const formData = new FormData();
      formData.append("image", file);
      formData.append("product_id", productId);

      dispatch({ type: PRODUCT_IMAGE_UPLOAD_REQUEST });

      const config = {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      };

      const { data } = await axios.post(
          "/api/products/upload/",
          formData,
          config
      );

      dispatch({
          type: PRODUCT_IMAGE_UPLOAD_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: PRODUCT_IMAGE_UPLOAD_FAIL,
          payload: error.response,
      });
  }
};

export const createProductReview = (productId, review) => async (dispatchEvent, getState) => {
  try {
    dispatchEvent({
      type: PRODUCT_CREATE_REVIEW_REQUEST,
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
      `/api/products/${productId}/review`,
      review,
      config
    );

    dispatchEvent({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
      payload: data,
    });
    
  } catch (error) {
    dispatchEvent({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
