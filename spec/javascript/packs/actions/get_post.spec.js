import configureStore from 'redux-mock-store'
import * as actions from 'actions/get_post'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('updateServerLogin', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const data = {
    "post": {
      "id": "1",
      "title": "this title",
      "content": "this content",
      "updated_at": "2019-01-13 22:12:36 UTC",
      "user": {
        "id": "1",
        "name": "my name",
        "provider": "facebook"
      }
    }
  }

  const expectedAction = {
    type: types.GET_POST,
    post: {
      id: "1",
      title: "this title",
      content: "this content",
      updated_at: "2019-01-13 22:12:36 UTC",
      user: {
        id: "1",
        name: "my name",
        provider: "facebook"
      }
    }
  }

  it('should create an action to return user info', () => {
    expect(actions.getPost(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.getPost(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})