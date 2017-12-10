// @format

import httpService from './http'
import { userAuth } from '../actions/AuthActions'

// get the login information from the backend server and store it in redux `store`
export function init(store) {
  return httpService.axios.get('/login').then(response => {
    const body = response.data
    if (body.logged_in === true) {
      store.dispatch(userAuth(body.user_id))
    }
  })
}

export default init
