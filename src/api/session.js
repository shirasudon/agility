// @format

import axios from 'axios'

export default class SessionApi {
  static login(user, config = {}) {
    return axios
      .post(
        '/login',
        {
          name: user.username,
          password: user.password,
        },
        config
      )
      .then(response => {
        if (!response.data.logged_in) {
          throw new Error('Authentication failed')
        }
        return {
          userId: Number(response.data.user_id),
        }
      })
  }

  static logout(config = {}) {
    return axios.post('/logout', {}, config).then(response => {
      if (response.data.logged_in) {
        throw new Error('Server returned logged_in=true')
      }
    })
  }
}
