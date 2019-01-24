import reducer from 'reducers/server_login'
import * as types from 'constants/actions'

describe('server_login', () => {
  const initialState = {
    user: null,
    isAuthenticated: false
  }

  it('should return the initial state', () => {
    const action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  it('should handle UPDATE_SERVER_LOGIN', () => {
    const action = {
      type: types.UPDATE_SERVER_LOGIN,
      user: {
        id: "1",
        provider: "facebook",
        uid: "104149837337889",
        name: "my name",
        email: "myemail@example.com"
      }
    }

    const expectedState = {
      user: {
        id: "1",
        provider: "facebook",
        uid: "104149837337889",
        name: "my name",
        email: "myemail@example.com"
      },
      isAuthenticated: true
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should not update state with user: null', () => {
    const action = {
      type: types.UPDATE_SERVER_LOGIN,
      user: null
    }

    expect(reducer(initialState, action)).toEqual(initialState)
  })
})