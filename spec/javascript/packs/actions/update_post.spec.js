import configureStore from 'redux-mock-store'
import * as actions from 'actions/update_post'
import * as types from 'constants/actions'

const mockStore = configureStore()
const store = mockStore()

describe('updatePost', () => {
  beforeEach(() => {
    store.clearActions()
  })

  const data = {
    "updatePost": "1"
  }

  const expectedAction = {
    type: types.UPDATE_POST,
    post_id: "1"
  }

  it('should create an action to return updated id', () => {
    expect(actions.updatePost(data)).toEqual(expectedAction)
  })

  it('should dispatch action and return expected result', () => {
    store.dispatch(actions.updatePost(data))
    expect(store.getActions()).toEqual([expectedAction])
  })
})