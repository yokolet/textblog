import configureStore from 'redux-mock-store'
import * as actions from 'actions/update_server_login'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('updateServerLogin', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const data = {
    "signInUser": {
      "id": "1",
      "provider": "facebook",
      "uid": "104149837337889",
      "name": "my name",
      "email": "myemail@example.com"
    }
  }

  const expectedAction = {
    type: types.UPDATE_SERVER_LOGIN,
    user: {
      id: "1",
      provider: "facebook",
      uid: "104149837337889",
      name: "my name",
      email: "myemail@example.com"
    }
  }

  it('should create an action to return user info', () => {
    expect(actions.updateServerLogin(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.updateServerLogin(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})