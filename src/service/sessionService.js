// @format

import axios from 'axios'

import { userAuth } from '../actions/AuthActions'

// get the login information from the backend server and store it in redux `store`
export default function init(store) {
  return axios.get('/login').then(response => {
    const body = response.data
    if (body.logged_in === true) {
      store.dispatch(userAuth(body.user_id))
    }
  })
}
