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
        return {
          userId: Number(response.data.user_id),
        }
      })
  }

  static logout() {
    return axios
      .post('/logout', {})
      .then(response => {})
      .catch(err => {})
  }
}
