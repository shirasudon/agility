// @format
import { init } from './sessionService'
import httpService from './http'

describe('login', () => {
  beforeEach(() => {})
  it('sets user ID in auth part of redux store if logged in', () => {
    const store = {
      dispatch: jest.fn(),
    }
    httpService.setAdapter(config => {
      return new Promise((resolve, reject) => {
        const mockData = { logged_in: true, user_id: 0 }
        resolve({ data: mockData, status: 200 })
      })
    })
    return init(store).then(() => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'USER_AUTH',
        payload: {
          userId: 0,
        },
      })
    })
  })

  it('does not sets user ID in auth part of redux store if not logged in', () => {
    const store = {
      dispatch: jest.fn(),
    }
    httpService.setAdapter(config => {
      return new Promise(resolve => {
        const mockData = { logged_in: false, user_id: 0 }
        resolve({ data: mockData, status: 200 })
      })
    })
    return init(store).then(() => {
      expect(store.dispatch).not.toHaveBeenCalled()
    })
  })
})
