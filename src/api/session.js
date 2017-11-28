// @format
import axios from 'axios'

export default class SessionApi {
  static login(user) {
    return axios
      .post('/login', {
        name: user.username,
        password: user.password,
      })
      .then(response => ({
        ok: true,
        data: response.data,
      }))
      .catch(err => ({
        ok: false,
      }))
  }

  static logout() {
    return axios
      .post('http://localhost:8080/logout', {})
      .then(response => {})
      .catch(err => {})
  }
}
