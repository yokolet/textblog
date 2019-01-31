import reducer from 'reducers/social_login'
import * as types from 'constants/actions'

describe('social_login', () => {
  const initialState = {
    provider: '',
    access_token: null,
  }

  it('should return the initial state', () => {
    const action = { type: 'DUMMY' }

    expect(reducer(undefined, action)).toEqual(initialState)
  })

  it('should handle UPDATE_SOCIAL_LOGIN', () => {
    const action = {
      type: types.UPDATE_SOCIAL_LOGIN,
      provider: 'facebook',
      access_token: 'a1b2c3d4e5f6g7h8i9j0',
    }

    const expectedState = {
      provider: 'facebook',
      access_token: 'a1b2c3d4e5f6g7h8i9j0',
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})