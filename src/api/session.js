// @format

import axios from 'axios'

export default class SessionApi {
  static login(user) {
    return axios
      .post('/login', {
        name: user.username,
        password: user.password,
      })
      .then(response => {
        if (!response.data.logged_in) {
          throw new Error('Authentication failed')
        }
        return {
          userId: Number(response.data.user_id),
        }
      })
  }

  static logout() {
    return axios
      .post('/logout', {})
      .then(response => {
        if (response.data.logged_in) {
          throw new Error('Could not logout')
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
