import configureStore from 'redux-mock-store'
import * as actions from 'actions/update_facebook_login'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('updateFacebookLogin', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const response = {
    accessToken: 'a1b2c3d4e5f6g7h8i9j0',
  }

  const expectedAction = {
    type: types.UPDATE_SOCIAL_LOGIN,
    provider: 'facebook',
    access_token: 'a1b2c3d4e5f6g7h8i9j0',
  }

  it('should create an action to return user info', () => {
    expect(actions.updateFacebookLogin(response)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.updateFacebookLogin(response))
    expect(store.getActions()).toEqual([expectedAction])
  })
})