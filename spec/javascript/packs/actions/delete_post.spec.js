import configureStore from 'redux-mock-store'
import * as actions from 'actions/delete_post'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('deletePost', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const data = {
    "deletePost": "1"
  }

  const expectedAction = {
    type: types.DELETE_POST,
    post_id: "1"
  }

  it('should create an action to return deleted id', () => {
    expect(actions.deletePost(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.deletePost(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})