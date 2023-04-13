
import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import { productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productImageUploadReducer, productCreateReviewReducer,
        productTopReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, 
        userListReducer, userDeleteReducer, userUpdateReducer, userPasswordResetReducer, userPasswordResetReducerValidateToken, userPasswordResetReducerChange } from './reducers/userReducers'
import { orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderListReducer, orderShippedReducer, orderDeliveredReducer, orderTotalReducer, orderPayPalInfoReducer } from './reducers/orderReducers'

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const store = configureStore({
    reducer: {
        productList: productListReducer,
        productDetails: productDetailsReducer,
        productDelete: productDeleteReducer,
        productCreate: productCreateReducer,
        productUpdate: productUpdateReducer,
        productUploadImage: productImageUploadReducer,
        productCreateReview: productCreateReviewReducer,
        productTop: productTopReducer,

        cart: cartReducer,
        
        userLogin: userLoginReducer,
        userRegister: userRegisterReducer,
        userDetails: userDetailsReducer,
        userUpdateProfile: userUpdateProfileReducer,
        userPasswordReset: userPasswordResetReducer,
        userPasswordResetValidate: userPasswordResetReducerValidateToken,
        userPasswordResetChange: userPasswordResetReducerChange,
        userList: userListReducer,
        userDelete: userDeleteReducer,
        userUpdate: userUpdateReducer,

        orderCreate: orderCreateReducer,
        orderDetails: orderDetailsReducer,
        orderListMy: orderListMyReducer,
        orderList: orderListReducer,
        orderShipped: orderShippedReducer,
        orderDelivered: orderDeliveredReducer,
        orderTotal: orderTotalReducer,
        orderPayPalInfo: orderPayPalInfoReducer,
        
    },
    middleware: [thunk],
    preloadedState: {
        cart: {cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage},
        userLogin: {userInfo: userInfoFromStorage},
    },
    devTools: true
})

export default store