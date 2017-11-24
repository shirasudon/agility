import { UserTable } from './repositoryStub'

export default class SessionApiStub {
  static login(user) {
    const match = UserTable.getUserByUserName(user.username)
    let response

    if (match === null || match.password !== user.password) {
      response = {
        ok: false,
      }
    } else {
      response = {
        ok: true,
        token: '82jf3td9h',
        data: {
          id: match.id,
          username: match.username,
          firstName: match.firstName,
          lastName: match.lastName,
        },
      }
    }
    return new Promise(resolve =>
      setTimeout(() => {
        resolve(response)
      }, 1000)
    )
  }

  static logout() {
    return new Promise(resolve => setTimeout(resolve, 1000))
  }
}
