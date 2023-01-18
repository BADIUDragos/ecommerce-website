import axios from 'axios'
import { 
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT } 
from '../constants/userConstants'


export const login = (email, password) => async (dispatchEvent) => {
    try{
        dispatchEvent({
            type: USER_LOGIN_REQUEST
        }) 

        const config = {
            headers:{
                'Content-type': 'application/json'
            }
        }

        const {data} = await axios.post(
            '/api/users/login/',
            {'isername':email, 'password': password},
            config
            )
        
        dispatchEvent({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

        
    }catch(error){
        dispatchEvent({
            type: USER_LOGIN_FAIL,
            payload:error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}