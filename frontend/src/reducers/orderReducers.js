import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,

  ORDER_DETAILS_REQUEST, 
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,

  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,

  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,

  ORDER_SHIPPED_REQUEST,
  ORDER_SHIPPED_SUCCESS,
  ORDER_SHIPPED_FAIL,
  ORDER_SHIPPED_RESET,

  ORDER_DELIVERED_REQUEST,
  ORDER_DELIVERED_SUCCESS,
  ORDER_DELIVERED_FAIL,
  ORDER_DELIVERED_RESET,

  ORDER_GET_TOTAL_REQUEST,
  ORDER_GET_TOTAL_SUCCESS,
  ORDER_GET_TOTAL_FAIL,

  ORDER_GET_STRIPE_INFO_REQUEST,
  ORDER_GET_STRIPE_INFO_SUCCESS,
  ORDER_GET_STRIPE_INFO_FAIL,
  
  CHECKOUT_SESSION_REQUEST,
  CHECKOUT_SESSION_SUCCESS,
  CHECKOUT_SESSION_FAIL
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };

    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDetailsReducer = (state = {loading: true, orderItems:[], shippingAddress: {}}, action) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderListMyReducer = (state = {orders:[]}, action) => {
  switch (action.type) {
    case ORDER_LIST_MY_REQUEST:
      return {
        loading: true,
      };

    case ORDER_LIST_MY_SUCCESS:
      return {
        loading: false,
        orders: action.payload
      };
    case ORDER_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_LIST_MY_RESET:
      return {
        orders:[]
      };
    
    default:
      return state;
  }
};

export const orderListReducer = (state = {orders:[]}, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return {
        loading: true,
      };

    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload
      };
    case ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderShippedReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_SHIPPED_REQUEST:
      return {
        loading: true,
      };

    case ORDER_SHIPPED_SUCCESS:
      return {
        loading: false,
        success: true
      };
    case ORDER_SHIPPED_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_SHIPPED_RESET:
      return {};
    
    default:
      return state;
  }
};

export const orderDeliveredReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELIVERED_REQUEST:
      return {
        loading: true,
      };

    case ORDER_DELIVERED_SUCCESS:
      return {
        loading: false,
        success: true
      };
    case ORDER_DELIVERED_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case ORDER_DELIVERED_RESET:
      return {};
    
    default:
      return state;
  }
};

export const orderTotalReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_GET_TOTAL_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    
    case ORDER_GET_TOTAL_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: null,
        prices: action.payload
      };
    
    case ORDER_GET_TOTAL_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export const orderStripeInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_GET_STRIPE_INFO_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
      };
    
    case ORDER_GET_STRIPE_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        error: false,
        info: action.payload
      };
    
    case ORDER_GET_STRIPE_INFO_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };
    
    default:
      return state;
  }
};

export const checkoutSessionReducer = (state = {}, action) => {
  switch(action.type){
    case CHECKOUT_SESSION_REQUEST:
      return{ loading: true};
    case CHECKOUT_SESSION_SUCCESS:
      return{ loading: false, session: action.payload};
    case CHECKOUT_SESSION_FAIL:
      return{ loading: false, error: action.payload};
    default:
      return state;
  }
}

